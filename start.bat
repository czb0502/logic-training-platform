@echo off
chcp 65001 >nul
echo ==========================================
echo    逻辑思维训练平台 - 启动脚本
echo ==========================================
echo.

:: 检查Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    pause
    exit /b 1
)

echo [1/4] 检测到Node.js版本:
node -v
echo.

:: 安装后端依赖
echo [2/4] 正在安装后端依赖...
cd /d "%~dp0backend"
call npm install
if errorlevel 1 (
    echo [错误] 后端依赖安装失败
    pause
    exit /b 1
)
echo [✓] 后端依赖安装完成
echo.

:: 安装前端依赖
echo [3/4] 正在安装前端依赖...
cd /d "%~dp0frontend"
call npm install
if errorlevel 1 (
    echo [错误] 前端依赖安装失败
    pause
    exit /b 1
)
echo [✓] 前端依赖安装完成
echo.

:: 启动服务
echo [4/4] 正在启动服务...
echo.

cd /d "%~dp0backend"
start "后端服务" cmd /k "npm start"

cd /d "%~dp0frontend"
start "前端服务" cmd /k "npm run dev"

echo ==========================================
echo    服务启动成功！
echo ==========================================
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:3001
echo.
echo 按任意键关闭此窗口（服务将继续运行）
pause >nul
