/**
 * 文件读写工具 - 带文件锁防止并发写入冲突
 */
const fs = require('fs');
const path = require('path');

// 文件锁Map
const fileLocks = new Map();

/**
 * 读取JSON文件
 * @param {string} filename - 文件名（相对于data目录）
 * @param {*} defaultValue - 读取失败时的默认值
 * @returns {*} 解析后的JSON数据
 */
function readJSON(filename, defaultValue = []) {
  try {
    const filePath = path.join(__dirname, '../data', filename);
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`读取文件 ${filename} 失败:`, error.message);
    return defaultValue;
  }
}

/**
 * 写入JSON文件 - 带锁机制
 * @param {string} filename - 文件名
 * @param {*} data - 要写入的数据
 * @returns {boolean} 是否成功
 */
function writeJSON(filename, data) {
  const filePath = path.join(__dirname, '../data', filename);
  
  // 等待锁释放
  if (fileLocks.has(filename)) {
    // 简单重试机制
    setTimeout(() => writeJSON(filename, data), 50);
    return false;
  }
  
  // 加锁
  fileLocks.set(filename, true);
  
  try {
    // 先写入临时文件，再重命名，确保原子性
    const tempPath = filePath + '.tmp';
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
    
    // 解锁
    fileLocks.delete(filename);
    return true;
  } catch (error) {
    console.error(`写入文件 ${filename} 失败:`, error.message);
    fileLocks.delete(filename);
    return false;
  }
}

/**
 * 确保数据目录存在
 */
function ensureDataDir() {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

module.exports = {
  readJSON,
  writeJSON,
  ensureDataDir
};
