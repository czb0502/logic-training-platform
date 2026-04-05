#!/bin/bash

echo "=========================================="
echo "   逻辑思维训练平台 - 启动脚本"
echo "=========================================="
echo ""

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未检测到Node.js，请先安装Node.js"
    exit 1
fi

echo "[1/4] 检测到Node.js版本: $(node -v)"
echo ""

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# 安装后端依赖
echo "[2/4] 正在安装后端依赖..."
cd "$SCRIPT_DIR/backend" || exit
npm install
if [ $? -ne 0 ]; then
    echo "[错误] 后端依赖安装失败"
    exit 1
fi
echo "[✓] 后端依赖安装完成"
echo ""

# 安装前端依赖
echo "[3/4] 正在安装前端依赖..."
cd "$SCRIPT_DIR/frontend" || exit
npm install
if [ $? -ne 0 ]; then
    echo "[错误] 前端依赖安装失败"
    exit 1
fi
echo "[✓] 前端依赖安装完成"
echo ""

# 启动服务
echo "[4/4] 正在启动服务..."
echo ""

cd "$SCRIPT_DIR/backend" || exit
npm start &
BACKEND_PID=$!

cd "$SCRIPT_DIR/frontend" || exit
npm run dev &
FRONTEND_PID=$!

echo "=========================================="
echo "   服务启动成功！"
echo "=========================================="
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:3001"
echo ""
echo "按 Ctrl+C 停止服务"

# 等待用户输入
wait
