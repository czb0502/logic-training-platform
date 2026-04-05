<template>
  <div class="achievement-modal" v-if="show">
    <div class="modal-content">
      <div class="achievement-icon">🏆</div>
      <h3>解锁新成就！</h3>
      <p class="achievement-name">{{ achievement?.title }}</p>
      <p class="achievement-desc">{{ achievement?.desc }}</p>
      <p class="achievement-reward">+{{ achievement?.reward }}💰</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useGameStore } from '@/store/gameStore'
import { achievements } from '@/data/achievements'

const gameStore = useGameStore()
const show = ref(false)
const achievement = ref(null)

// 监听新成就
watch(() => gameStore.gameProgress.achievements, (newVal, oldVal) => {
  if (newVal && oldVal && newVal.length > oldVal.length) {
    const newAchievementId = newVal.find(id => !oldVal.includes(id))
    if (newAchievementId) {
      achievement.value = achievements.find(a => a.id === newAchievementId)
      show.value = true
      setTimeout(() => {
        show.value = false
      }, 3000)
    }
  }
}, { deep: true })
</script>

<style scoped>
.achievement-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2000;
  animation: popup 0.5s ease;
}

@keyframes popup {
  0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  50% { transform: translate(-50%, -50%) scale(1.1); }
  100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}

.modal-content {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid #ffd700;
  border-radius: 20px;
  padding: 40px 60px;
  text-align: center;
  box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
}

.achievement-icon {
  font-size: 64px;
  margin-bottom: 20px;
  animation: bounce 1s ease infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.modal-content h3 {
  font-family: 'Orbitron', sans-serif;
  font-size: 24px;
  color: #ffd700;
  margin-bottom: 15px;
}

.achievement-name {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 10px;
}

.achievement-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.achievement-reward {
  font-size: 24px;
  color: #ffd700;
  font-weight: 700;
}
</style>
