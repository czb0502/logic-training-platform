/**
 * 加密工具 - 使用bcryptjs
 */
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/**
 * 对密码进行哈希加密
 * @param {string} password - 明文密码
 * @returns {string} 加密后的密码
 */
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * 验证密码
 * @param {string} password - 明文密码
 * @param {string} hash - 加密后的密码
 * @returns {boolean} 是否匹配
 */
async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

/**
 * 生成简单的token（base64编码 userId + timestamp）
 * @param {string} userId - 用户ID
 * @returns {string} token
 */
function generateToken(userId) {
  const timestamp = Date.now();
  const data = JSON.stringify({ userId, timestamp });
  return Buffer.from(data).toString('base64');
}

/**
 * 验证token
 * @param {string} token - token字符串
 * @returns {object|null} 解析后的数据或null
 */
function verifyToken(token) {
  try {
    const data = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'));
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    
    // 检查是否过期（7天）
    if (Date.now() - data.timestamp > sevenDays) {
      return null;
    }
    return data;
  } catch (error) {
    return null;
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken
};
