/**
 * 后端服务入口
 */
const express = require('express');
const corsMiddleware = require('./middleware/cors');
const { errorHandler } = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');

// 控制器
const userController = require('./controller/userController');
const gameController = require('./controller/gameController');
const petController = require('./controller/petController');
const rankController = require('./controller/rankController');

const app = express();
const PORT = 3001;

// 中间件
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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

// 错误处理
app.use(errorHandler);

// 启动服务
app.listen(PORT, () => {
  console.log(`🚀 逻辑思维训练平台后端服务已启动`);
  console.log(`📡 API地址: http://localhost:${PORT}`);
  console.log(`🔍 健康检查: http://localhost:${PORT}/health`);
});
