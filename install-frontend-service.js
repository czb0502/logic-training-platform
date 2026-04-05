const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'LogicTraining Frontend',
  description: '逻辑思维训练平台前端服务',
  script: path.join('C:', 'Users', 'Asus', '.qclaw', 'workspace', 'logic-training-platform', 'frontend', 'node_modules', '.bin', 'serve.cmd'),
  scriptOptions: '-s dist -l 3000',
  workingDirectory: path.join('C:', 'Users', 'Asus', '.qclaw', 'workspace', 'logic-training-platform', 'frontend'),
  env: {
    name: 'NODE_ENV',
    value: 'production'
  }
});

svc.on('install', () => {
  console.log('前端服务安装成功！');
  svc.start();
});

svc.on('error', (err) => {
  console.error('服务安装错误:', err);
});

svc.install();