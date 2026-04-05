<template>
  <div class="expression-game">
    <div class="game-header">
      <button class="btn btn-secondary" @click="router.back()">← 返回</button>
      <h2>逻辑表达</h2>
      <span class="progress">{{ completedLevels.length }}/12</span>
    </div>
    
    <!-- 关卡列表 -->
    <div v-if="!currentLevel" class="level-list">
      <div 
        v-for="level in expressionLevels" 
        :key="level.id"
        class="level-card card"
        :class="{ completed: isCompleted(level.id) }"
        @click="selectLevel(level)"
      >
        <div class="level-header">
          <span class="level-num">关卡 {{ level.id.split('_')[1] }}</span>
          <span class="type-badge" :class="level.type">{{ level.type === 'drag' ? '拖放' : '输入' }}</span>
        </div>
        <h3>{{ level.title }}</h3>
        <p class="level-desc">{{ level.description }}</p>
        <div class="level-footer">
          <span class="difficulty">难度: {{ '🔥'.repeat(level.difficulty) }}</span>
          <span class="score">{{ level.score }}分</span>
        </div>
      </div>
    </div>
    
    <!-- 关卡详情 - 拖放式 -->
    <div v-else-if="currentLevel.type === 'drag'" class="level-detail">
      <div class="detail-header">
        <button class="btn btn-secondary" @click="currentLevel = null">← 返回</button>
        <h3>{{ currentLevel.title }}</h3>
      </div>
      
      <div class="drag-game card">
        <p class="content">{{ currentLevel.content }}</p>
        
        <div class="modules-pool">
          <div
            v-for="(module, index) in shuffledModules"
            :key="index"
            class="module-item"
            :class="{ selected: selectedModules.includes(index) }"
            @click="toggleModule(index)"
          >
            {{ module }}
          </div>
        </div>
        
        <div class="answer-area">
          <h4>你的答案顺序：</h4>
          <div class="answer-slots">
            <div 
              v-for="(slot, index) in selectedModules" 
              :key="index"
              class="answer-slot"
            >
              {{ index + 1 }}. {{ shuffledModules[slot] }}
            </div>
          </div>
        </div>
        
        <button 
          class="btn btn-primary submit-btn"
          :disabled="selectedModules.length !== currentLevel.modules.length"
          @click="submitDragAnswer"
        >
          提交答案
        </button>
        
        <div v-if="showResult" class="result">
          <div :class="['result-badge', isCorrect ? 'correct' : 'wrong']">
            {{ isCorrect ? '✓ 回答正确！' : '✗ 顺序有误' }}
          </div>
          <p class="analysis">{{ currentLevel.analysis }}</p>
        </div>
      </div>
    </div>
    
    <!-- 关卡详情 - 输入式 -->
    <div v-else class="level-detail">
      <div class="detail-header">
        <button class="btn btn-secondary" @click="currentLevel = null">← 返回</button>
        <h3>{{ currentLevel.title }}</h3>
      </div>
      
      <div class="input-game card">
        <div class="scenario">
          <h4>场景</h4>
          <p>{{ currentLevel.scenario }}</p>
        </div>
        
        <div class="target">
          <h4>任务</h4>
          <p>{{ currentLevel.target }}</p>
        </div>
        
        <textarea 
          v-model="userAnswer"
          class="input answer-input"
          rows="8"
          placeholder="请输入你的回答..."
        ></textarea>
        
        <div class="keywords">
          <span>关键词参考：</span>
          <span v-for="word in currentLevel.keywords" :key="word" class="keyword">{{ word }}</span>
        </div>
        
        <button 
          class="btn btn-primary submit-btn"
          :disabled="!userAnswer.trim()"
          @click="submitInputAnswer"
        >
          提交答案
        </button>
        
        <div v-if="showResult" class="result">
          <div class="score-display">
            得分: <span class="score-num">{{ score }}</span>/100
          </div>
          <div class="dimensions">
            <div class="dimension">
              <span>结论清晰度</span>
              <div class="dim-bar"><div class="fill" :style="{ width: dimensions.clarity + '%' }"></div></div>
            </div>
            <div class="dimension">
              <span>论据充分性</span>
              <div class="dim-bar"><div class="fill" :style="{ width: dimensions.evidence + '%' }"></div></div>
            </div>
            <div class="dimension">
              <span>逻辑连贯性</span>
              <div class="dim-bar"><div class="fill" :style="{ width: dimensions.logic + '%' }"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/store/gameStore'
import { expressionLevels } from '@/data/expressionLevels'

const router = useRouter()
const gameStore = useGameStore()

const currentLevel = ref(null)
const shuffledModules = ref([])
const selectedModules = ref([])
const userAnswer = ref('')
const showResult = ref(false)
const isCorrect = ref(false)
const score = ref(0)
const dimensions = ref({ clarity: 0, evidence: 0, logic: 0 })

const completedLevels = computed(() => gameStore.gameProgress.completedExpression || [])

const isCompleted = (levelId) => completedLevels.value.includes(levelId)

const selectLevel = (level) => {
  currentLevel.value = level
  showResult.value = false
  
  if (level.type === 'drag') {
    // 打乱模块顺序
    shuffledModules.value = [...level.modules].sort(() => Math.random() - 0.5)
    selectedModules.value = []
  } else {
    userAnswer.value = ''
  }
}

const toggleModule = (index) => {
  const pos = selectedModules.value.indexOf(index)
  if (pos > -1) {
    selectedModules.value.splice(pos, 1)
  } else {
    selectedModules.value.push(index)
  }
}

const submitDragAnswer = async () => {
  // 验证答案
  const userOrder = selectedModules.value.map(i => currentLevel.value.modules.indexOf(shuffledModules.value[i]))
  isCorrect.value = JSON.stringify(userOrder) === JSON.stringify(currentLevel.value.correctOrder)
  showResult.value = true
  
  if (isCorrect.value) {
    await gameStore.completeExpressionLevel(
      currentLevel.value.id,
      currentLevel.value.score,
      currentLevel.value.analysis
    )
  }
}

const submitInputAnswer = async () => {
  // 模拟评分
  const wordCount = userAnswer.value.length
  const hasKeywords = currentLevel.value.keywords.some(k => userAnswer.value.includes(k))
  
  dimensions.value.clarity = Math.min(100, 60 + Math.random() * 30)
  dimensions.value.evidence = Math.min(100, hasKeywords ? 70 + Math.random() * 20 : 40 + Math.random() * 20)
  dimensions.value.logic = Math.min(100, 50 + Math.random() * 40)
  
  score.value = Math.round((dimensions.value.clarity + dimensions.value.evidence + dimensions.value.logic) / 3)
  showResult.value = true
  
  await gameStore.completeExpressionLevel(
    currentLevel.value.id,
    score.value,
    '表达结构完整，逻辑清晰'
  )
}
</script>

<style scoped>
.expression-game {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.game-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.game-header h2 {
  flex: 1;
  font-family: 'Orbitron', sans-serif;
}

.progress {
  background: rgba(0, 212, 255, 0.2);
  padding: 5px 15px;
  border-radius: 15px;
  font-size: 14px;
}

.level-list {
  display: grid;
  gap: 15px;
}

.level-card {
  cursor: pointer;
  transition: all 0.3s;
}

.level-card:hover {
  transform: translateX(5px);
  border-color: rgba(0, 212, 255, 0.5);
}

.level-card.completed {
  border-color: #27ae60;
}

.level-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.level-num {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.type-badge {
  padding: 2px 10px;
  border-radius: 10px;
  font-size: 12px;
}

.type-badge.drag {
  background: #3498db;
}

.type-badge.input {
  background: #9b59b6;
}

.level-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.level-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.level-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score {
  color: #ffd700;
  font-weight: 600;
}

/* 关卡详情 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.drag-game, .input-game {
  padding: 25px;
}

.content {
  font-size: 16px;
  margin-bottom: 20px;
}

.modules-pool {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.module-item {
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.module-item:hover {
  background: rgba(255, 255, 255, 0.15);
}

.module-item.selected {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.2);
}

.answer-area {
  margin-bottom: 20px;
}

.answer-area h4 {
  margin-bottom: 10px;
}

.answer-slots {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.answer-slot {
  padding: 12px;
  background: rgba(0, 212, 255, 0.1);
  border-radius: 8px;
  border-left: 3px solid #00d4ff;
}

.submit-btn {
  width: 100%;
  margin-bottom: 20px;
}

.result {
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.result-badge {
  display: inline-block;
  padding: 10px 30px;
  border-radius: 20px;
  font-weight: 600;
  margin-bottom: 15px;
}

.result-badge.correct {
  background: rgba(39, 174, 96, 0.3);
  color: #27ae60;
}

.result-badge.wrong {
  background: rgba(231, 76, 60, 0.3);
  color: #e74c3c;
}

.analysis {
  font-size: 14px;
  line-height: 1.6;
}

/* 输入式关卡 */
.scenario, .target {
  margin-bottom: 20px;
}

.scenario h4, .target h4 {
  color: #00d4ff;
  margin-bottom: 8px;
}

.answer-input {
  margin-bottom: 15px;
  resize: vertical;
}

.keywords {
  margin-bottom: 20px;
  font-size: 14px;
}

.keyword {
  display: inline-block;
  padding: 3px 10px;
  background: rgba(0, 212, 255, 0.2);
  border-radius: 10px;
  margin: 0 5px;
  font-size: 12px;
}

.score-display {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
}

.score-num {
  color: #00d4ff;
  font-size: 36px;
  font-weight: 700;
}

.dimensions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.dimension {
  display: flex;
  align-items: center;
  gap: 15px;
}

.dimension span {
  width: 100px;
  font-size: 14px;
}

.dim-bar {
  flex: 1;
  height: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  overflow: hidden;
}

.dim-bar .fill {
  height: 100%;
  background: linear-gradient(90deg, #00d4ff, #7b2cbf);
  border-radius: 5px;
  transition: width 0.5s ease;
}
</style>
