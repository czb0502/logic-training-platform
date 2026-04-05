# 逻辑思维训练平台

一个游戏化逻辑思维训练全栈平台，通过侦探推理、工程产线沙盘、逻辑表达三大核心游戏模块，全面提升用户的逻辑推理、工程顺控思维、结构化表达能力。

## 功能特性

- 🔍 **侦探推理游戏** - 6个完整侦探案件，通过线索分析提升推理能力
- ⚙️ **产线沙盘游戏** - 6个工程关卡，通过产线编排训练工程思维
- 📝 **逻辑表达游戏** - 12个表达关卡，提升结构化表达能力
- 🐾 **宠物陪伴系统** - 6只可爱宠物，解锁、喂食、升级、互动
- 🏆 **成就系统** - 丰富的成就体系，激励持续学习
- 📊 **排行榜** - 与好友比拼，激发竞争动力

## 技术栈

### 前端
- Vue 3 + Vite
- Pinia 状态管理
- GSAP 动画
- Axios HTTP请求

### 后端
- Node.js + Express
- bcryptjs 密码加密
- JSON文件数据持久化

## 快速开始

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### 手动启动

1. 安装后端依赖并启动
```bash
cd backend
npm install
npm start
```

2. 安装前端依赖并启动
```bash
cd frontend
npm install
npm run dev
```

3. 访问 http://localhost:3000

## 项目结构

```
logic-training-platform/
├── frontend/          # 前端项目
│   ├── src/
│   │   ├── components/  # 组件
│   │   ├── pages/       # 页面
│   │   ├── router/      # 路由
│   │   ├── store/       # Pinia状态
│   │   ├── api/         # API接口
│   │   └── data/        # 静态数据
│   └── package.json
├── backend/           # 后端项目
│   ├── controller/    # 控制器
│   ├── middleware/    # 中间件
│   ├── utils/         # 工具函数
│   ├── data/          # 数据文件
│   └── server.js      # 服务入口
├── start.bat          # Windows启动脚本
├── start.sh           # Linux/Mac启动脚本
└── README.md
```

## 默认端口

- 前端: http://localhost:3000
- 后端: http://localhost:3001

## 隐藏宠物解锁码

月亮玉兔解锁码: `520`

## 开发说明

- 用户数据存储在 `backend/data/users.json`
- 密码使用bcryptjs加密存储
- Token有效期7天

## License

MIT
