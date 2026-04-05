<template>
  <div class="achievement-page">
    <div class="header">
      <button class="btn btn-secondary" @click="router.push('/')">← 返回</button>
      <h2>成就墙</h2>
    </div>
    
    <div class="achievement-stats card">
      <div class="stat">
        <span class="value">{{ unlockedCount }}</span>
        <span class="label">已解锁</span>
      </div>
      <div class="stat">
        <span class="value">{{ totalCount }}</span>
        <span class="label">总成就</span>
      </div>
      <div class="stat">
        <span class="value">{{ progress }}%</span>
        <span class="label">完成度</span>
      </div>
    </div>
    
    <div class="achievement-list">
      <div 
        v-for="achievement in achievements" 
        :key="achievement.id"
        class="achievement-item card"
        :class="{ unlocked: isUnlocked(achievement.id) }"
      >
        <div class="achievement-icon">{{ achievement.icon }}</div>
        <div class="achievement-info">
          <h4>{{ achievement.title }}</h4>
          <p>{{ achievement.desc }}</p>
        </div>
        <div class="achievement-reward">
          <span v-if="isUnlocked(achievement.id)" class="unlocked-badge">✓ 已解锁</span>
          <span v-else>+{{ achievement.reward }}💰</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import { achievements } from '@/data/achievements'

const router = useRouter()
const gameStore = useGameStore()

const unlockedAchievements = computed(() => gameStore.gameProgress.achievements || [])
const unlockedCount = computed(() => unlockedAchievements.value.length)
const totalCount = computed(() => achievements.length)
const progress = computed(() => Math.round((unlockedCount.value / totalCount.value) * 100))

const isUnlocked = (id) => unlockedAchievements.value.includes(id)

onMounted(() => {
  gameStore.fetchGameProgress()
})
</script>

<style scoped>
.achievement-page {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.header h2 {
  font-family: 'Orbitron', sans-serif;
}

.achievement-stats {
  display: flex;
  justify-content: space-around;
  padding: 20px;
  margin-bottom: 20px;
}

.stat {
  text-align: center;
}

.stat .value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #00d4ff;
}

.stat .label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.achievement-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  opacity: 0.5;
  transition: all 0.3s;
}

.achievement-item.unlocked {
  opacity: 1;
  border-color: rgba(255, 215, 0, 0.3);
}

.achievement-icon {
  font-size: 32px;
  width: 50px;
  text-align: center;
}

.achievement-info {
  flex: 1;
}

.achievement-info h4 {
  font-size: 16px;
  margin-bottom: 5px;
}

.achievement-info p {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.achievement-reward {
  color: #ffd700;
  font-size: 14px;
}

.unlocked-badge {
  color: #27ae60;
}
</style>
