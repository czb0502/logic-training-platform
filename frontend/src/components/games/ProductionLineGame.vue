<template>
  <div class="production-line-game">
    <!-- 宠物伴侣 -->
    <div class="pet-companion" :style="petStyle" @click="petClick">
      <span class="pet-emoji">{{ currentPetAvatar }}</span>
      <div class="pet-thought" v-if="petMessage">{{ petMessage }}</div>
    </div>
    
    <!-- 关卡选择界面 -->
    <div v-if="!currentLevel" class="level-select">
      <div class="header">
        <button class="btn-back" @click="router.back()">← 返回首页</button>
        <div class="title-area">
          <h1>🏭 虚拟产线沙盘</h1>
          <p>搭积木式流程搭建 · 零门槛逻辑训练</p>
        </div>
      </div>
      
      <div class="intro-card">
        <h2>🎯 你是产线调度师</h2>
        <p>拖放动作块 → 设置规则 → 启动仿真 → 看产线跑起来！</p>
        <p class="highlight">全程无专业术语，像搭乐高一样玩逻辑</p>
      </div>
      
      <div class="level-grid">
        <div
          v-for="(level, index) in engineeringLevels"
          :key="level.id"
          class="level-card"
          :class="{ locked: isLocked(level, index), completed: isCompleted(level.id) }"
          @click="selectLevel(level, index)"
        >
          <div class="level-number">{{ index + 1 }}</div>
          <div class="level-info">
            <h3>{{ level.title }}</h3>
            <p>{{ level.description }}</p>
          </div>
          <div class="level-meta">
            <span class="stars">{{ '⭐'.repeat(level.stars) }}</span>
            <span v-if="isLocked(level, index)" class="lock-icon">🔒</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 游戏界面 -->
    <div v-else class="game-screen">
      <div class="game-header">
        <button class="btn-back" @click="exitLevel">← 返回首页</button>
        <div class="level-title">
          <h2>关卡{{ currentLevelIndex + 1 }}：{{ currentLevel.title }}</h2>
          <p>{{ currentLevel.description }}</p>
        </div>
        <div class="status-badge" :class="statusClass">{{ statusText }}</div>
      </div>
      
      <div class="game-main">
        <div class="simulation-area">
          <div class="sim-header">
            <h3>📺 产线仿真</h3>
            <div class="sim-controls">
              <button class="btn-debug" @click="startDebug" :disabled="isRunning">🔧 调试</button>
              <button class="btn-submit" @click="submitFlow" :disabled="!canSubmit">✅ 提交</button>
              <button class="btn-stop" @click="stopSimulation" :disabled="!isRunning">⏹ 停止</button>
              <button class="btn-reset" @click="resetSimulation">🏠 重置</button>
              <button class="btn-clear" @click="clearFlow">🗑 清空</button>
            </div>
          </div>
          
          <div class="production-layout">
            <div class="top-row">
              <div class="device conveyor" :class="{ active: devices.conveyor.active }">
                <div class="device-label">传送带</div>
                <div class="device-content">
                  <span v-if="devices.conveyor.hasMaterial">📦</span>
                  <span v-else>─</span>
                </div>
              </div>
              
              <div class="device arm" :class="{ holding: devices.arm.holding }">
                <div class="device-label">机械手</div>
                <div class="device-content">
                  <span>{{ devices.arm.holding ? '✊📦' : '🖐' }}</span>
                </div>
              </div>
              
              <div class="device output">
                <div class="device-label">下料区</div>
                <div class="device-content">✅ {{ completedCount }}</div>
              </div>
            </div>
            
            <div class="middle-row">
              <div class="turntable" :class="{ rotating: devices.turntable.rotating }">
                <div class="station s1" :class="{ has: devices.turntable.stations[0].hasMaterial }">
                  上料<span v-if="devices.turntable.stations[0].hasMaterial">📦</span>
                </div>
                <div class="station s2" :class="{ has: devices.turntable.stations[1].hasMaterial }">
                  加工<span v-if="devices.turntable.stations[1].hasMaterial">📦</span>
                </div>
                <div class="station s3" :class="{ has: devices.turntable.stations[2].hasMaterial }">
                  下料<span v-if="devices.turntable.stations[2].hasMaterial">📦</span>
                </div>
                <div class="station s4" :class="{ has: devices.turntable.stations[3].hasMaterial }">
                  空位<span v-if="devices.turntable.stations[3].hasMaterial">📦</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="sidebar">
          <div class="actions-panel">
            <h4>🧩 动作库</h4>
            <div class="action-blocks">
              <div v-for="action in availableActions" :key="action.id" 
                   class="action-block" @dblclick="addAction(action)">
                {{ action.icon }} {{ action.name }}
              </div>
            </div>
          </div>
          
          <div class="flow-panel">
            <h4>📝 流程</h4>
            <div v-if="userFlow.length > 0" class="flow-list">
              <div v-for="(step, idx) in userFlow" :key="idx" 
                   class="flow-step" :class="{ active: currentStep === idx }">
                {{ idx + 1 }}. {{ step.icon }} {{ step.name }}
                <button @click="removeStep(idx)">×</button>
              </div>
            </div>
            <div v-else class="flow-empty">双击添加动作</div>
          </div>
          
          <div class="goal-panel">
            <h4>🎯 目标</h4>
            <p>{{ currentLevel.goal }}</p>
            <p>完成: {{ completedCount }}/{{ currentLevel.targetCount }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import { usePetStore } from '@/store/petStore'
import { engineeringLevels, actionBlocks } from '@/data/engineeringLevels'

const router = useRouter()
const gameStore = useGameStore()
const petStore = usePetStore()

// 宠物系统
const currentPetAvatar = computed(() => {
  const pet = petStore.activePet
  return pet?.avatar || '🐱'
})

const petDialogues = computed(() => {
  const pet = petStore.activePet
  return pet?.dialogues || ['加油！', '你可以的！']
})

const petMessage = ref('')
const petX = ref(100)
const petY = ref(100)
const petDir = ref(1)
let petTimer = null

const petStyle = computed(() => ({
  left: petX.value + 'px',
  top: petY.value + 'px'
}))

const movePet = () => {
  const maxX = window.innerWidth - 80
  const maxY = window.innerHeight - 80
  petX.value += petDir.value * (2 + Math.random() * 2)
  petY.value += (Math.random() - 0.5) * 3
  if (petX.value < 50) { petX.value = 50; petDir.value = 1 }
  if (petX.value > maxX) { petX.value = maxX; petDir.value = -1 }
  if (petY.value < 50) petY.value = 50
  if (petY.value > maxY) petY.value = maxY
}

const petClick = () => {
  const arr = petDialogues.value
  petMessage.value = arr[Math.floor(Math.random() * arr.length)]
  setTimeout(() => petMessage.value = '', 2500)
}

// 游戏状态
const currentLevel = ref(null)
const currentLevelIndex = ref(0)
const userFlow = ref([])
const isRunning = ref(false)
const currentStep = ref(-1)
const completedCount = ref(0)
const statusText = ref('待机')
const statusClass = ref('idle')

const devices = reactive({
  conveyor: { active: false, hasMaterial: false },
  arm: { holding: false },
  turntable: { rotating: false, stations: [{ hasMaterial: false }, { hasMaterial: false }, { hasMaterial: false }, { hasMaterial: false }] },
  output: { active: false }
})

const turntableRotation = ref(0)

const availableActions = computed(() => {
  if (!currentLevel.value) return []
  return actionBlocks.filter(a => currentLevel.value.availableActions?.includes(a.id))
})

const canSubmit = computed(() => userFlow.value.length > 0 && !isRunning.value)

const isLocked = (level, idx) => {
  if (idx === 0) return false
  const prev = engineeringLevels[idx - 1]
  return !gameStore.isLevelCompleted('engineering', prev.id)
}

const isCompleted = (id) => gameStore.isLevelCompleted('engineering', id)

const selectLevel = (level, idx) => {
  if (isLocked(level, idx)) return
  currentLevel.value = level
  currentLevelIndex.value = idx
  resetSimulation()
}

const exitLevel = () => {
  currentLevel.value = null
  stopSimulation()
}

const addAction = (action) => {
  if (!isRunning.value) userFlow.value.push({ ...action, completed: false })
}

const removeStep = (idx) => {
  if (!isRunning.value) userFlow.value.splice(idx, 1)
}

const clearFlow = () => {
  if (!isRunning.value) userFlow.value = []
}

const resetSimulation = () => {
  stopSimulation()
  userFlow.value = []
  completedCount.value = 0
  devices.conveyor.active = false
  devices.conveyor.hasMaterial = false
  devices.arm.holding = false
  devices.turntable.rotating = false
  devices.turntable.stations.forEach(s => s.hasMaterial = false)
  turntableRotation.value = 0
}

const startDebug = async () => {
  if (userFlow.value.length === 0) return
  isRunning.value = true
  statusText.value = '运行'
  statusClass.value = 'running'
  
  for (let i = 0; i < userFlow.value.length; i++) {
    if (!isRunning.value) break
    currentStep.value = i
    await executeAction(userFlow.value[i])
    userFlow.value[i].completed = true
    await new Promise(r => setTimeout(r, 300))
  }
  
  isRunning.value = false
  statusText.value = '待机'
  statusClass.value = 'idle'
  currentStep.value = -1
}

const executeAction = async (action) => {
  const wait = (ms) => new Promise(r => setTimeout(r, ms))
  
  switch (action.id) {
    case 'conveyor_feed':
      devices.conveyor.active = true
      await wait(500)
      devices.conveyor.hasMaterial = true
      devices.conveyor.active = false
      break
    case 'arm_down':
    case 'arm_up':
      await wait(300)
      break
    case 'arm_grab':
      if (devices.conveyor.hasMaterial) {
        devices.arm.holding = true
        devices.conveyor.hasMaterial = false
      }
      await wait(300)
      break
    case 'arm_move_turntable':
      await wait(400)
      break
    case 'arm_place':
      if (devices.arm.holding) {
        devices.turntable.stations[0].hasMaterial = true
        devices.arm.holding = false
      }
      await wait(300)
      break
    case 'turntable_rotate':
      devices.turntable.rotating = true
      await wait(800)
      const temp = devices.turntable.stations[3].hasMaterial
      for (let i = 3; i > 0; i--) {
        devices.turntable.stations[i].hasMaterial = devices.turntable.stations[i-1].hasMaterial
      }
      devices.turntable.stations[0].hasMaterial = temp
      devices.turntable.rotating = false
      break
    case 'arm_move_output':
      await wait(400)
      break
    case 'arm_grab_output':
      if (devices.turntable.stations[1].hasMaterial) {
        devices.arm.holding = true
        devices.turntable.stations[1].hasMaterial = false
      }
      await wait(300)
      break
    case 'output_conveyor':
      devices.output.active = true
      await wait(500)
      completedCount.value++
      devices.output.active = false
      break
    case 'arm_home':
      await wait(300)
      break
  }
}

const stopSimulation = () => {
  isRunning.value = false
  statusText.value = '待机'
  statusClass.value = 'idle'
  currentStep.value = -1
}

const submitFlow = async () => {
  if (userFlow.value.length === 0) return
  const required = currentLevel.value.requiredActions || []
  const userActions = userFlow.value.map(s => s.id)
  const valid = required.every(a => userActions.includes(a))
  
  if (valid) {
    await gameStore.completeLevel('engineering', currentLevel.value.id, { score: 100 })
    alert('🎉 通关成功！')
    exitLevel()
  } else {
    alert('❌ 流程有误，请检查')
  }
}

onMounted(() => {
  petStore.fetchPets()
  petTimer = setInterval(movePet, 50)
})

onUnmounted(() => {
  if (petTimer) clearInterval(petTimer)
})
</script>

<style scoped>
.production-line-game {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #fff;
  padding: 20px;
}

/* 宠物 */
.pet-companion {
  position: fixed;
  z-index: 1000;
  cursor: pointer;
  transition: left 0.05s, top 0.05s;
}
.pet-emoji {
  font-size: 36px;
  animation: bounce 0.6s infinite;
}
@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.pet-thought {
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  color: #333;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 12px;
  white-space: nowrap;
}

/* 关卡选择 */
.level-select {
  max-width: 1000px;
  margin: 0 auto;
}
.header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}
.btn-back {
  background: rgba(255,255,255,0.1);
  border: none;
  color: #fff;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.title-area h1 { margin: 0; font-size: 24px; }
.title-area p { margin: 5px 0 0; opacity: 0.7; }

.intro-card {
  background: rgba(255,255,255,0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}
.intro-card h2 { margin: 0 0 10px; color: #ffd700; }
.intro-card .highlight { color: #4ecdc4; font-weight: bold; }

.level-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 15px;
}
.level-card {
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 15px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}
.level-card:hover:not(.locked) {
  border-color: #4ecdc4;
  transform: translateY(-2px);
}
.level-card.locked { opacity: 0.5; cursor: not-allowed; }
.level-card.completed { border-color: #4ecdc4; }
.level-number { font-size: 20px; font-weight: bold; color: #4ecdc4; }
.level-info h3 { margin: 8px 0 5px; }
.level-info p { margin: 0; opacity: 0.7; font-size: 13px; }
.level-meta { display: flex; justify-content: space-between; margin-top: 10px; }

/* 游戏界面 */
.game-screen {}
.game-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.level-title h2 { margin: 0; }
.level-title p { margin: 3px 0 0; opacity: 0.7; }
.status-badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-weight: bold;
}
.status-badge.idle { background: rgba(255,255,255,0.1); }
.status-badge.running { background: #4ecdc4; color: #000; }

.game-main {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 15px;
}

/* 仿真区 */
.simulation-area {
  background: rgba(0,0,0,0.3);
  border-radius: 12px;
  padding: 15px;
}
.sim-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.sim-controls { display: flex; gap: 8px; }
.sim-controls button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.sim-controls button:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-debug { background: #3498db; color: #fff; }
.btn-submit { background: #27ae60; color: #fff; }
.btn-stop { background: #e74c3c; color: #fff; }
.btn-reset, .btn-clear { background: rgba(255,255,255,0.1); color: #fff; }

.production-layout {}
.top-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}
.device {
  background: rgba(255,255,255,0.05);
  border-radius: 8px;
  padding: 10px;
  text-align: center;
  min-width: 100px;
}
.device-label { font-size: 12px; opacity: 0.8; margin-bottom: 5px; }
.device-content { font-size: 20px; }
.device.active { border: 2px solid #4ecdc4; }

.middle-row { display: flex; justify-content: center; }
.turntable {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: #2a2a4a;
  border: 3px solid #4ecdc4;
  position: relative;
}
.turntable.rotating { border-color: #ffd700; }
.station {
  position: absolute;
  font-size: 11px;
  padding: 5px;
  background: rgba(255,255,255,0.1);
  border-radius: 5px;
}
.station.has { background: rgba(78,205,196,0.3); }
.s1 { top: 5px; left: 50%; transform: translateX(-50%); }
.s2 { top: 50%; right: 5px; transform: translateY(-50%); }
.s3 { bottom: 5px; left: 50%; transform: translateX(-50%); }
.s4 { top: 50%; left: 5px; transform: translateY(-50%); }

/* 侧边栏 */
.sidebar { display: flex; flex-direction: column; gap: 15px; }
.sidebar > div {
  background: rgba(255,255,255,0.05);
  border-radius: 10px;
  padding: 12px;
}
.sidebar h4 { margin: 0 0 10px; color: #4ecdc4; }

.action-blocks { display: flex; flex-wrap: wrap; gap: 6px; }
.action-block {
  background: rgba(255,255,255,0.1);
  border-radius: 6px;
  padding: 6px 10px;
  cursor: pointer;
  font-size: 13px;
}
.action-block:hover { background: rgba(255,255,255,0.2); }

.flow-list {}
.flow-step {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
  margin: 3px 0;
  background: rgba(255,255,255,0.05);
  border-radius: 4px;
}
.flow-step.active { background: rgba(78,205,196,0.3); }
.flow-step button {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
}
.flow-empty { opacity: 0.6; font-size: 13px; }

.goal-panel p { margin: 5px 0; font-size: 13px; }
</style>