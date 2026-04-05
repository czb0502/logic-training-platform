/**
 * 跨域中间件
 * 支持本地开发和生产环境
 */
const cors = require('cors');

// 允许的域名列表
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // 本地开发前端
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  // Railway 部署 - 稍后更新
  /\.railway\.app$/,
  // Vercel 部署
  /\.vercel\.app$/,
  // 通用模式 - 允许所有，方便部署
  '*'
];

const corsOptions = {
  origin: function (origin, callback) {
    // 允许没有 origin 的请求（如 Postman、curl）
    if (!origin) {
      return callback(null, true);
    }
    
    // 检查 origin 是否在允许列表中
    const allowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') {
        return origin === allowed;
      }
      // 正则表达式匹配
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return false;
    });
    
    if (allowed) {
      callback(null, true);
    } else {
      // 临时允许所有，方便开发
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

module.exports = cors(corsOptions);
