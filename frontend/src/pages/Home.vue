<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <nav class="top-nav">
      <div class="nav-brand">
        <span class="logo">🧠</span>
        <span class="brand-text">逻辑训练</span>
      </div>
      <div class="nav-user" @click="router.push('/user')">
        <span class="username">{{ userStore.userInfo?.username }}</span>
        <span class="level-badge">{{ userStore.userInfo?.level }}</span>
      </div>
    </nav>
    
    <!-- 用户信息卡片 -->
    <div class="user-card card">
      <div class="user-info">
        <div class="avatar">{{ userStore.userInfo?.username?.[0] || '?' }}</div>
        <div class="info-text">
          <h2>{{ userStore.userInfo?.username }}</h2>
          <p class="level">{{ userStore.userInfo?.level }}</p>
        </div>
        <div class="coins">
          <span class="coin-icon">💰</span>
          <span class="coin-count">{{ userStore.userInfo?.coins || 0 }}</span>
        </div>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <span class="stat-value">{{ userStore.userInfo?.totalScore || 0 }}</span>
          <span class="stat-label">总积分</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.userInfo?.scores?.detective || 0 }}</span>
          <span class="stat-label">侦探</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.userInfo?.scores?.engineering || 0 }}</span>
          <span class="stat-label">工程</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userStore.userInfo?.scores?.expression || 0 }}</span>
          <span class="stat-label">表达</span>
        </div>
      </div>
      
      <div class="level-progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: userStore.levelProgress + '%' }"></div>
        </div>
        <span class="progress-text">升级进度 {{ userStore.levelProgress }}%</span>
      </div>
    </div>
    
    <!-- 游戏模块入口 -->
    <div class="game-modules">
      <h3 class="section-title">选择训练模块</h3>
      
      <div class="module-grid">
        <div class="module-card card" @click="router.push('/games/detective')">
          <div class="module-icon">🕵️</div>
          <h4>侦探推理</h4>
          <p>通过案件分析提升推理能力</p>
          <div class="module-stats">
            <span>已完成 {{ completedCases.length }}/6</span>
          </div>
        </div>
        
        <div class="module-card card" @click="router.push('/games/engineering')">
          <div class="module-icon">⚙️</div>
          <h4>产线沙盘</h4>
          <p>通过产线编排训练工程思维</p>
          <div class="module-stats">
            <span>已完成 {{ completedEngineering.length }}/6</span>
          </div>
        </div>
        
        <div class="module-card card" @click="router.push('/games/expression')">
          <div class="module-icon">📝</div>
          <h4>逻辑表达</h4>
          <p>通过表达训练提升沟通能力</p>
          <div class="module-stats">
            <span>已完成 {{ completedExpression.length }}/12</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 快捷入口 -->
    <div class="quick-links">
      <div class="link-card card" @click="router.push('/achievements')">
        <span class="link-icon">🏆</span>
        <span>成就墙</span>
      </div>
      <div class="link-card card" @click="router.push('/rank')">
        <span class="link-icon">📊</span>
        <span>排行榜</span>
      </div>
      <div class="link-card card" @click="router.push('/pets')">
        <span class="link-icon">🏠</span>
        <span>宠物屋</span>
      </div>
    </div>
    
    <!-- 今日任务 -->
    <div class="daily-tasks card">
      <h3 class="section-title">今日任务</h3>
      <div class="task-list">
        <div 
          v-for="task in tasks" 
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed }"
        >
          <span class="task-check">{{ task.completed ? '✅' : '⭕' }}</span>
          <span class="task-name">{{ task.title }}</span>
          <span class="task-reward">+{{ task.reward }}💰</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import { useGameStore } from '@/store/gameStore'
import { dailyTasks } from '@/data/tasks'

const router = useRouter()
const userStore = useUserStore()
const gameStore = useGameStore()

const completedCases = computed(() => gameStore.gameProgress.completedCases || [])
const completedEngineering = computed(() => gameStore.gameProgress.completedEngineering || [])
const completedExpression = computed(() => gameStore.gameProgress.completedExpression || [])

const tasks = computed(() => {
  const completed = userStore.userInfo?.dailyTasks?.completedTasks || []
  return dailyTasks.slice(0, 4).map(task => ({
    ...task,
    completed: completed.includes(task.id)
  }))
})

onMounted(() => {
  gameStore.fetchGameProgress()
})
</script>

<style scoped>
.home-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  font-size: 28px;
}

.brand-text {
  font-family: 'Orbitron', sans-serif;
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-user:hover {
  background: rgba(255, 255, 255, 0.2);
}

.level-badge {
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.user-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}

.info-text h2 {
  font-size: 20px;
  margin-bottom: 5px;
}

.info-text .level {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.coins {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 18px;
  font-weight: 600;
  color: #ffd700;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-item {
  text-align: center;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.stat-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #00d4ff;
}

.stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.level-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #7b2cbf);
  border-radius: 4px;
  transition: width 0.5s ease;
}

.progress-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  white-space: nowrap;
}

.section-title {
  font-size: 18px;
  margin-bottom: 15px;
  color: #fff;
}

.game-modules {
  margin-bottom: 20px;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.module-card {
  cursor: pointer;
  text-align: center;
  padding: 25px;
  transition: all 0.3s;
}

.module-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.5);
}

.module-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.module-card h4 {
  font-size: 18px;
  margin-bottom: 10px;
}

.module-card p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.module-stats {
  font-size: 12px;
  color: #00d4ff;
  background: rgba(0, 212, 255, 0.1);
  padding: 5px 10px;
  border-radius: 10px;
  display: inline-block;
}

.quick-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.link-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.link-card:hover {
  transform: scale(1.05);
}

.link-icon {
  font-size: 32px;
}

.daily-tasks {
  margin-bottom: 80px;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s;
}

.task-item.completed {
  opacity: 0.6;
}

.task-check {
  font-size: 18px;
}

.task-name {
  flex: 1;
}

.task-reward {
  color: #ffd700;
  font-size: 14px;
}
</style>
