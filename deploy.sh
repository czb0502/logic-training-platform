#!/bin/bash
# Railway 部署脚本

echo "🚀 开始部署逻辑思维训练平台..."

# 1. 安装后端依赖
echo "📦 安装后端依赖..."
cd backend
npm install
cd ..

# 2. 构建前端
echo "🔨 构建前端..."
cd frontend
npm install
npm run build
cd ..

# 3. 启动后端服务
echo "🌐 启动服务..."
cd backend
node server.js
