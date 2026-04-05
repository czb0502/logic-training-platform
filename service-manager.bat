@echo off
chcp 65001 >nul
title 逻辑思维训练平台 - 服务管理

:: 检查管理员权限
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 请以管理员身份运行此脚本！
    echo 右键点击此文件，选择"以管理员身份运行"
    pause
    exit /b 1
)

:menu
cls
echo ==========================================
echo   逻辑思维训练平台 - 服务管理
echo ==========================================
echo.
echo  [1] 安装服务（开机自动启动）
echo  [2] 卸载服务
echo  [3] 启动服务
echo  [4] 停止服务
echo  [5] 重启服务
echo  [6] 查看服务状态
echo  [7] 查看日志
echo  [8] 退出
echo.
echo ==========================================
set /p choice=请选择操作 [1-8]: 

if "%choice%"=="1" goto install
if "%choice%"=="2" goto uninstall
if "%choice%"=="3" goto start
if "%choice%"=="4" goto stop
if "%choice%"=="5" goto restart
if "%choice%"=="6" goto status
if "%choice%"=="7" goto logs
if "%choice%"=="8" goto exit
goto menu

:install
cls
echo 正在安装服务...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0install-services.ps1"
goto menu

:uninstall
cls
echo 正在卸载服务...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0uninstall-services.ps1"
goto menu

:start
cls
echo 正在启动服务...
echo.
net start "LogicTraining Backend" 2>nul
net start "LogicTraining Frontend" 2>nul
echo.
echo 服务启动完成！
echo 访问: http://localhost:3000
pause
goto menu

:stop
cls
echo 正在停止服务...
echo.
net stop "LogicTraining Frontend" 2>nul
net stop "LogicTraining Backend" 2>nul
echo.
echo 服务已停止！
pause
goto menu

:restart
cls
echo 正在重启服务...
echo.
net stop "LogicTraining Frontend" 2>nul
net stop "LogicTraining Backend" 2>nul
timeout /t 2 /nobreak >nul
net start "LogicTraining Backend" 2>nul
net start "LogicTraining Frontend" 2>nul
echo.
echo 服务重启完成！
echo 访问: http://localhost:3000
pause
goto menu

:status
cls
echo ==========================================
echo   服务状态
echo ==========================================
echo.
sc query "LogicTraining Backend" | findstr "STATE"
sc query "LogicTraining Frontend" | findstr "STATE"
echo.
echo 端口占用情况:
netstat -ano | findstr ":3000"
netstat -ano | findstr ":3001"
echo.
pause
goto menu

:logs
cls
echo ==========================================
echo   服务日志
echo ==========================================
echo.
echo 后端日志位置:
echo   C:\Windows\System32\config\systemprofile\AppData\Local\LogicTraining Backend\logs\
echo.
echo 前端日志位置:
echo   C:\Windows\System32\config\systemprofile\AppData\Local\LogicTraining Frontend\logs\
echo.
pause
goto menu

:exit
exit