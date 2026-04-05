# 逻辑思维训练平台 - Windows服务安装脚本
# 以管理员身份运行PowerShell执行此脚本

# 检查是否以管理员身份运行
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "请以管理员身份运行此脚本！" -ForegroundColor Red
    pause
    exit
}

# 设置变量
$ProjectPath = "C:\Users\Asus\.qclaw\workspace\logic-training-platform"
$BackendPath = "$ProjectPath\backend"
$FrontendPath = "$ProjectPath\frontend"
$NodePath = (Get-Command node).Source
$NpmPath = (Get-Command npm).Source

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  逻辑思维训练平台 - Windows服务安装" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. 安装依赖
Write-Host "[1/5] 检查并安装依赖..." -ForegroundColor Yellow
Set-Location $BackendPath
& $NpmPath install

Set-Location $FrontendPath
& $NpmPath install
& $NpmPath run build

# 2. 创建服务脚本
Write-Host "[2/5] 创建服务启动脚本..." -ForegroundColor Yellow

# 后端服务脚本
$BackendScript = @"
const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'LogicTraining Backend',
  description: '逻辑思维训练平台后端服务',
  script: path.join('$BackendPath', 'server.js'),
  nodeOptions: ['--harmony', '--max_old_space_size=4096'],
  workingDirectory: '$BackendPath',
  env: {
    name: 'NODE_ENV',
    value: 'production'
  }
});

svc.on('install', () => {
  console.log('后端服务安装成功！');
  svc.start();
});

svc.install();
"@

# 前端服务脚本（使用serve静态服务器）
$FrontendScript = @"
const { Service } = require('node-windows');
const path = require('path');

const svc = new Service({
  name: 'LogicTraining Frontend',
  description: '逻辑思维训练平台前端服务',
  script: path.join('$FrontendPath', 'node_modules', '.bin', 'serve.cmd'),
  scriptOptions: '-s dist -l 3000',
  workingDirectory: '$FrontendPath',
  env: {
    name: 'NODE_ENV',
    value: 'production'
  }
});

svc.on('install', () => {
  console.log('前端服务安装成功！');
  svc.start();
});

svc.install();
"@

# 保存脚本
$BackendScript | Out-File -FilePath "$ProjectPath\install-backend-service.js" -Encoding UTF8
$FrontendScript | Out-File -FilePath "$ProjectPath\install-frontend-service.js" -Encoding UTF8

# 3. 安装node-windows
Write-Host "[3/5] 安装node-windows..." -ForegroundColor Yellow
Set-Location $ProjectPath
& $NpmPath install node-windows

# 4. 安装服务
Write-Host "[4/5] 安装Windows服务..." -ForegroundColor Yellow

# 先卸载旧服务（如果存在）
$services = Get-Service | Where-Object { $_.Name -like "*LogicTraining*" }
foreach ($svc in $services) {
    Write-Host "  停止并删除旧服务: $($svc.Name)" -ForegroundColor Gray
    Stop-Service $svc.Name -Force -ErrorAction SilentlyContinue
    sc.exe delete $svc.Name | Out-Null
}

# 安装新服务
& $NodePath "$ProjectPath\install-backend-service.js"
Start-Sleep -Seconds 3
& $NodePath "$ProjectPath\install-frontend-service.js"

# 5. 配置防火墙
Write-Host "[5/5] 配置防火墙规则..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "LogicTraining Backend" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow -ErrorAction SilentlyContinue
New-NetFirewallRule -DisplayName "LogicTraining Frontend" -Direction Inbound -Protocol TCP -LocalPort 3000 -Action Allow -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  服务安装完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "服务信息：" -ForegroundColor Cyan
Write-Host "  - 后端服务: LogicTraining Backend (端口3001)" -ForegroundColor White
Write-Host "  - 前端服务: LogicTraining Frontend (端口3000)" -ForegroundColor White
Write-Host ""
Write-Host "访问地址：" -ForegroundColor Cyan
Write-Host "  - 本地: http://localhost:3000" -ForegroundColor White
Write-Host "  - 局域网: http://$((Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -notlike "127.*" -and $_.IPAddress -notlike "169.*"} | Select-Object -First 1).IPAddress):3000" -ForegroundColor White
Write-Host ""
Write-Host "管理命令（以管理员运行）：" -ForegroundColor Cyan
Write-Host "  - 启动: net start 'LogicTraining Backend'" -ForegroundColor Gray
Write-Host "  - 停止: net stop 'LogicTraining Backend'" -ForegroundColor Gray
Write-Host "  - 重启: net stop 'LogicTraining Backend'; net start 'LogicTraining Backend'" -ForegroundColor Gray
Write-Host ""
Write-Host "卸载服务：运行 uninstall-services.ps1" -ForegroundColor Yellow
Write-Host ""
pause