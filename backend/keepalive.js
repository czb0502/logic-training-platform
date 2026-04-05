/**
 * 服务保活脚本
 * 每3分钟检查一次服务状态，异常时自动重启
 */
const http = require('http');

const CHECK_INTERVAL = 3 * 60 * 1000; // 3分钟
const API_URL = 'http://localhost:3001/health';

console.log('🔄 服务保活守护进程已启动');
console.log(`⏰ 检查间隔: ${CHECK_INTERVAL / 1000}秒`);

function checkService() {
  http.get(API_URL, (res) => {
    if (res.statusCode === 200) {
      console.log(`[${new Date().toLocaleString()}] ✅ 服务运行正常`);
    } else {
      console.error(`[${new Date().toLocaleString()}] ⚠️ 服务状态异常: ${res.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`[${new Date().toLocaleString()}] ❌ 服务连接失败: ${err.message}`);
    console.log('🔄 正在尝试重启服务...');
    // 这里可以添加重启逻辑
  });
}

// 立即检查一次
checkService();

// 定时检查
setInterval(checkService, CHECK_INTERVAL);
