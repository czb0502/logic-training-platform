# 使用 Node.js 18
FROM node:18-alpine

WORKDIR /app

# 复制后端代码
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# 复制前端代码并构建
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# 复制构建好的前端到后端目录
RUN cp -r frontend/dist backend/

# 暴露端口
EXPOSE 3001

# 启动后端服务（它会托管前端）
CMD ["node", "backend/server.js"]
