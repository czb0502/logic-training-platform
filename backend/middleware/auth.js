/**
 * 登录校验中间件
 */
const { verifyToken } = require('../utils/encrypt');
const { readJSON } = require('../utils/fileUtils');

/**
 * 验证用户登录态
 */
function authMiddleware(req, res, next) {
  try {
    // 从请求头获取token
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: '未登录或登录已过期'
      });
    }
    
    const token = authHeader.substring(7);
    const tokenData = verifyToken(token);
    
    if (!tokenData) {
      return res.status(401).json({
        success: false,
        message: '登录已过期，请重新登录'
      });
    }
    
    // 查找用户
    const users = readJSON('users.json', []);
    const user = users.find(u => u.userId === tokenData.userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 将用户信息附加到请求对象
    req.userId = user.userId;
    req.user = user;
    
    next();
  } catch (error) {
    console.error('认证中间件错误:', error);
    return res.status(500).json({
      success: false,
      message: '认证失败'
    });
  }
}

module.exports = { authMiddleware };
