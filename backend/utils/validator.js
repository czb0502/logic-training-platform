/**
 * 数据校验工具
 */

/**
 * 校验账号格式
 * @param {string} account - 账号
 * @returns {object} { valid: boolean, message: string }
 */
function validateAccount(account) {
  if (!account || typeof account !== 'string') {
    return { valid: false, message: '账号不能为空' };
  }
  if (account.length < 4 || account.length > 20) {
    return { valid: false, message: '账号长度应为4-20位' };
  }
  if (!/^[a-zA-Z0-9]+$/.test(account)) {
    return { valid: false, message: '账号只能包含字母和数字' };
  }
  return { valid: true, message: '' };
}

/**
 * 校验密码格式
 * @param {string} password - 密码
 * @returns {object} { valid: boolean, message: string }
 */
function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: '密码不能为空' };
  }
  if (password.length < 6 || password.length > 20) {
    return { valid: false, message: '密码长度应为6-20位' };
  }
  return { valid: true, message: '' };
}

/**
 * 校验昵称格式
 * @param {string} username - 昵称
 * @returns {object} { valid: boolean, message: string }
 */
function validateUsername(username) {
  if (!username || typeof username !== 'string') {
    return { valid: false, message: '昵称不能为空' };
  }
  if (username.length < 2 || username.length > 16) {
    return { valid: false, message: '昵称长度应为2-16位' };
  }
  return { valid: true, message: '' };
}

module.exports = {
  validateAccount,
  validatePassword,
  validateUsername
};
