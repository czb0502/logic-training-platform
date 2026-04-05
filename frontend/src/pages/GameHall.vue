<template>
  <div class="game-hall">
    <div class="header">
      <button class="btn btn-secondary" @click="router.push('/')">← 返回</button>
      <h2>游戏大厅</h2>
    </div>
    
    <div class="modules">
      <div class="module-card card" @click="router.push('/games/detective')">
        <div class="module-icon">🕵️</div>
        <h3>侦探推理</h3>
        <p>通过案件分析提升逻辑推理能力</p>
        <div class="module-stats">
          <span>{{ completedCases.length }}/6 案件</span>
        </div>
      </div>
      
      <div class="module-card card" @click="router.push('/games/engineering')">
        <div class="module-icon">⚙️</div>
        <h3>产线沙盘</h3>
        <p>通过产线编排训练工程顺控思维</p>
        <div class="module-stats">
          <span>{{ completedEngineering.length }}/6 关卡</span>
        </div>
      </div>
      
      <div class="module-card card" @click="router.push('/games/expression')">
        <div class="module-icon">📝</div>
        <h3>逻辑表达</h3>
        <p>通过表达训练提升结构化表达能力</p>
        <div class="module-stats">
          <span>{{ completedExpression.length }}/12 关卡</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'

const router = useRouter()
const gameStore = useGameStore()

const completedCases = computed(() => gameStore.gameProgress.completedCases || [])
const completedEngineering = computed(() => gameStore.gameProgress.completedEngineering || [])
const completedExpression = computed(() => gameStore.gameProgress.completedExpression || [])

onMounted(() => {
  gameStore.fetchGameProgress()
})
</script>

<style scoped>
.game-hall {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.header h2 {
  font-family: 'Orbitron', sans-serif;
}

.modules {
  display: grid;
  gap: 20px;
}

.module-card {
  padding: 30px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
}

.module-card:hover {
  transform: translateY(-5px);
  border-color: rgba(0, 212, 255, 0.5);
}

.module-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.module-card h3 {
  font-size: 24px;
  margin-bottom: 10px;
}

.module-card p {
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.module-stats {
  display: inline-block;
  background: rgba(0, 212, 255, 0.1);
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
  color: #00d4ff;
}
</style>
