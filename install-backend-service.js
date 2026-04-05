const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'LogicTraining Backend',
  description: '逻辑思维训练平台后端服务',
  script: path.join('C:', 'Users', 'Asus', '.qclaw', 'workspace', 'logic-training-platform', 'backend', 'server.js'),
  nodeOptions: ['--harmony', '--max_old_space_size=4096'],
  workingDirectory: path.join('C:', 'Users', 'Asus', '.qclaw', 'workspace', 'logic-training-platform', 'backend'),
  env: {
    name: 'NODE_ENV',
    value: 'production'
  }
});

svc.on('install', () => {
  console.log('后端服务安装成功！');
  svc.start();
});

svc.on('error', (err) => {
  console.error('服务安装错误:', err);
});

svc.install();