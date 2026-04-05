/**
 * 后端服务入口
 * 支持前后端一体化部署
 */
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 动态获取 API URL（用于 CORS 和前端配置）
const API_BASE_URL = process.env.API_BASE_URL || `http://localhost:${PORT}`;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

// 中间件
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ========== API 接口 ==========

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 配置（供前端获取）
app.get('/api/config', (req, res) => {
  res.json({
    apiBaseUrl: API_BASE_URL,
    environment: process.env.NODE_ENV || 'development'
  });
});

// 控制器
const userController = require('./controller/userController');
const gameController = require('./controller/gameController');
const petController = require('./controller/petController');
const rankController = require('./controller/rankController');

// ========== 用户相关接口 ==========
// 公开接口
app.post('/api/user/register', userController.register);
app.post('/api/user/login', userController.login);

// 需要登录的接口
app.get('/api/user/profile', authMiddleware, userController.getProfile);
app.put('/api/user/profile', authMiddleware, userController.updateProfile);
app.put('/api/user/password', authMiddleware, userController.changePassword);
app.post('/api/user/logout', authMiddleware, userController.logout);
app.delete('/api/user/account', authMiddleware, userController.deleteAccount);
app.post('/api/user/checkin', authMiddleware, userController.checkin);
app.get('/api/user/tasks', authMiddleware, userController.getTasks);
app.post('/api/user/task/complete', authMiddleware, userController.completeTask);

// ========== 游戏相关接口 ==========
app.post('/api/game/detective/complete', authMiddleware, gameController.completeDetectiveCase);
app.post('/api/game/engineering/complete', authMiddleware, gameController.completeEngineeringLevel);
app.post('/api/game/expression/complete', authMiddleware, gameController.completeExpressionLevel);
app.get('/api/game/progress', authMiddleware, gameController.getGameProgress);

// ========== 宠物相关接口 ==========
app.get('/api/pet/list', authMiddleware, petController.getPetList);
app.post('/api/pet/unlock', authMiddleware, petController.unlockPet);
app.post('/api/pet/feed', authMiddleware, petController.feedPet);
app.post('/api/pet/upgrade', authMiddleware, petController.upgradePet);
app.put('/api/pet/active', authMiddleware, petController.setActivePet);
app.post('/api/pet/interact', authMiddleware, petController.interactPet);

// ========== 排行榜相关接口 ==========
app.get('/api/rank/total', authMiddleware, rankController.getTotalRank);
app.get('/api/rank/detective', authMiddleware, rankController.getDetectiveRank);
app.get('/api/rank/engineering', authMiddleware, rankController.getEngineeringRank);
app.get('/api/rank/expression', authMiddleware, rankController.getExpressionRank);

// ========== 前端静态文件（生产环境） ==========
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDistPath));

// 所有未匹配的路由都返回前端 index.html（SPA 路由支持）
app.get('*', (req, res, next) => {
  // API 路由不处理
  if (req.path.startsWith('/api') || req.path.startsWith('/health')) {
    return next();
  }
  
  const indexPath = path.join(frontendDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // 前端未构建时返回简单提示
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <title>逻辑思维训练平台</title>
          <style>
            body { 
              font-family: sans-serif; 
              display: flex; 
              justify-content: center; 
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background: #1a1a2e;
              color: #fff;
            }
            .container { text-align: center; }
            h1 { color: #00d4ff; }
            p { color: #888; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 逻辑思维训练平台</h1>
            <p>后端服务运行正常！请等待前端构建完成...</p>
            <p>API 健康检查: <a href="/health" style="color:#00d4ff">/health</a></p>
          </div>
        </body>
        </html>
      `);
    }
  });
});

// 错误处理
app.use(errorHandler);

// 启动服务
app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   🚀 逻辑思维训练平台后端服务已启动        ║');
  console.log(`╠════════════════════════════════════════════╣`);
  console.log(`║   📡 API地址: ${API_BASE_URL.padEnd(22)}║`);
  console.log(`║   🔍 健康检查: ${`${API_BASE_URL}/health`.padEnd(22)}║`);
  console.log(`║   📁 前端目录: ${frontendDistPath.slice(-20).padEnd(22)}║`);
  console.log('╚════════════════════════════════════════════╝');
});
