<template>
  <div class="pet-house">
    <div class="header">
      <button class="btn btn-secondary" @click="router.push('/')">← 返回</button>
      <h2>宠物屋</h2>
    </div>
    
    <div class="pet-grid">
      <div 
        v-for="pet in petStore.pets" 
        :key="pet.id"
        class="pet-card card"
        :class="[pet.rarity, { unlocked: pet.isUnlocked, active: pet.isActive }]"
      >
        <div class="pet-avatar" :class="[`rarity-${pet.rarity}`, { locked: !pet.isUnlocked }]">
          <div v-if="pet.isUnlocked" class="pet-preview" :class="`pet-${pet.id}`">
            <!-- 月亮玉兔 -->
            <template v-if="pet.id === 'pet_moon'">
              <div class="mini-moon-rabbit">
                <div class="mini-moon"></div>
                <div class="mini-rabbit">🐰</div>
              </div>
            </template>
            <!-- 机甲猎豹 -->
            <template v-else-if="pet.id === 'pet_cheetah'">
              <div class="mini-mecha">🤖</div>
            </template>
            <!-- 其他宠物 -->
            <template v-else>
              <span class="pet-emoji">{{ pet.avatar }}</span>
            </template>
          </div>
          <span v-else class="locked-icon">🔒</span>
          
          <!-- 稀有度光效 -->
          <div v-if="pet.rarity === 'legend' && pet.isUnlocked" class="legend-glow"></div>
          <div v-if="pet.rarity === 'epic' && pet.isUnlocked" class="epic-glow"></div>
        </div>
        
        <div class="pet-info">
          <h3>{{ pet.isUnlocked ? pet.name : '???' }}</h3>
          <p class="rarity-badge" :class="pet.rarity">{{ rarityText(pet.rarity) }}</p>
          <p class="unlock-condition">{{ pet.unlockCondition }}</p>
        </div>
        
        <div v-if="pet.isUnlocked && pet.data" class="pet-stats">
          <div class="stat">
            <span>Lv.{{ pet.data.level }}</span>
          </div>
          <div class="stat-bar">
            <div class="bar-label">饱食度</div>
            <div class="bar">
              <div class="fill" :style="{ width: pet.data.satiety + '%' }"></div>
            </div>
          </div>
          <div class="stat-bar">
            <div class="bar-label">亲密度</div>
            <div class="bar">
              <div class="fill intimacy" :style="{ width: pet.data.intimacy + '%' }"></div>
            </div>
          </div>
        </div>
        
        <div class="pet-actions">
          <button 
            v-if="!pet.isUnlocked"
            class="btn btn-primary"
            @click="unlock(pet)"
          >
            解锁
          </button>
          <template v-else>
            <button 
              v-if="!pet.isActive"
              class="btn btn-secondary"
              @click="petStore.setActivePet(pet.id)"
            >
              跟随
            </button>
            <span v-else class="active-badge">当前跟随</span>
          </template>
        </div>
      </div>
    </div>
    
    <!-- 解锁弹窗 -->
    <div v-if="showUnlockModal" class="modal" @click="showUnlockModal = false">
      <div class="modal-content card" @click.stop>
        <h3>解锁 {{ unlockTarget?.name }}</h3>
        <p>{{ unlockTarget?.unlockCondition }}</p>
        <div v-if="unlockTarget?.unlockCode" class="code-input">
          <input v-model="unlockCode" class="input" placeholder="请输入解锁码" />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showUnlockModal = false">取消</button>
          <button class="btn btn-primary" @click="confirmUnlock">确认解锁</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePetStore } from '@/store/petStore'

const router = useRouter()
const petStore = usePetStore()

const showUnlockModal = ref(false)
const unlockTarget = ref(null)
const unlockCode = ref('')

const rarityText = (rarity) => {
  const map = { common: '普通', rare: '稀有', epic: '史诗', legend: '传说' }
  return map[rarity] || rarity
}

const unlock = (pet) => {
  unlockTarget.value = pet
  unlockCode.value = ''
  showUnlockModal.value = true
}

const confirmUnlock = async () => {
  const res = await petStore.unlockPet(unlockTarget.value.id, unlockCode.value)
  if (res.success) {
    showUnlockModal.value = false
  } else {
    alert(res.message)
  }
}

petStore.fetchPets()
</script>

<style scoped>
.pet-house {
  padding: 20px;
  max-width: 1000px;
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

.pet-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.pet-card {
  padding: 20px;
  text-align: center;
  transition: all 0.3s;
}

.pet-card:not(.unlocked) {
  opacity: 0.7;
}

.pet-card.active {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.pet-avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.3);
  border: 3px solid;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  margin: 0 auto 15px;
  position: relative;
  overflow: visible;
}

.pet-avatar.rarity-common { border-color: #27ae60; }
.pet-avatar.rarity-rare { border-color: #3498db; }
.pet-avatar.rarity-epic { border-color: #9b59b6; }
.pet-avatar.rarity-legend { border-color: #ffd700; }

.pet-avatar.locked {
  opacity: 0.5;
  border-color: #666;
}

.locked-icon {
  font-size: 32px;
  opacity: 0.5;
}

.pet-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pet-emoji {
  font-size: 45px;
}

/* 迷你月亮玉兔 */
.mini-moon-rabbit {
  position: relative;
  width: 60px;
  height: 60px;
}

.mini-moon {
  position: absolute;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0f0f0, #c0c0d0);
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(200,200,255,0.5);
  animation: mini-moon-glow 2s ease-in-out infinite;
}

@keyframes mini-moon-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(200,200,255,0.5); }
  50% { box-shadow: 0 0 30px rgba(200,200,255,0.8); }
}

.mini-rabbit {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 28px;
  animation: mini-bounce 1.5s ease-in-out infinite;
}

@keyframes mini-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

/* 迷你机甲 */
.mini-mecha {
  font-size: 45px;
  animation: mecha-pulse 1.5s ease-in-out infinite;
}

@keyframes mecha-pulse {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px #00d4ff); }
  50% { transform: scale(1.1); filter: drop-shadow(0 0 15px #00d4ff); }
}

/* 光效 */
.legend-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
  animation: legend-pulse 2s ease-in-out infinite;
}

.epic-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(155,89,182,0.3) 0%, transparent 70%);
  animation: epic-pulse 2s ease-in-out infinite;
}

@keyframes legend-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.2); opacity: 1; }
}

@keyframes epic-pulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.15); opacity: 1; }
}

.pet-info h3 {
  font-size: 18px;
  margin-bottom: 8px;
}

.rarity-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
  margin-bottom: 8px;
}

.rarity-badge.common { background: #27ae60; }
.rarity-badge.rare { background: #3498db; }
.rarity-badge.epic { background: #9b59b6; }
.rarity-badge.legend { background: linear-gradient(135deg, #ffd700, #ff8c00); }

.unlock-condition {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.pet-stats {
  margin: 15px 0;
}

.stat {
  font-size: 20px;
  font-weight: 600;
  color: #00d4ff;
  margin-bottom: 10px;
}

.stat-bar {
  margin-bottom: 8px;
}

.bar-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 3px;
}

.bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.fill {
  height: 100%;
  background: #27ae60;
  border-radius: 4px;
  transition: width 0.3s;
}

.fill.intimacy {
  background: #f72585;
}

.pet-actions {
  margin-top: 15px;
}

.active-badge {
  color: #ffd700;
  font-size: 14px;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 400px;
  padding: 25px;
  text-align: center;
}

.code-input {
  margin: 20px 0;
}

.modal-actions {
  display: flex;
  gap: 10px;
}

.modal-actions .btn {
  flex: 1;
}
</style>
