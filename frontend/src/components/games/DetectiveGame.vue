<template>
  <div class="detective-game">
    <div class="game-header">
      <button class="btn btn-secondary" @click="router.back()">← 返回</button>
      <h2>侦探推理</h2>
      <span class="progress">{{ completedCases.length }}/6</span>
    </div>
    
    <!-- 案件列表 -->
    <div v-if="!currentCase" class="case-list">
      <div 
        v-for="caseItem in detectiveCases" 
        :key="caseItem.id"
        class="case-card card"
        :class="{ completed: isCompleted(caseItem.id) }"
        @click="selectCase(caseItem)"
      >
        <div class="case-header">
          <span class="case-id">案件 {{ caseItem.id.split('_')[1] }}</span>
          <span class="difficulty">
            {{ '⭐'.repeat(caseItem.difficulty) }}
          </span>
        </div>
        <h3>{{ caseItem.title }}</h3>
        <p class="case-desc">{{ caseItem.background.substring(0, 80) }}...</p>
        <div class="case-footer">
          <span class="score">{{ caseItem.score }}分</span>
          <span v-if="isCompleted(caseItem.id)" class="completed-badge">✓ 已通关</span>
          <span v-else class="pending-badge">待挑战</span>
        </div>
      </div>
    </div>
    
    <!-- 案件详情 -->
    <div v-else class="case-detail">
      <div class="detail-header">
        <button class="btn btn-secondary" @click="currentCase = null">← 返回列表</button>
        <h3>{{ currentCase.title }}</h3>
      </div>
      
      <div class="case-content card">
        <div class="section">
          <h4>📖 案件背景</h4>
          <p>{{ currentCase.background }}</p>
        </div>
        
        <div class="section">
          <h4>🔍 线索证据</h4>
          <div class="clues">
            <div 
              v-for="clue in currentCase.clues" 
              :key="clue.id"
              class="clue-item"
              :class="{ expanded: expandedClues.includes(clue.id) }"
              @click="toggleClue(clue.id)"
            >
              <div class="clue-title">{{ clue.title }}</div>
              <div v-if="expandedClues.includes(clue.id)" class="clue-content">
                {{ clue.content }}
              </div>
            </div>
          </div>
        </div>
        
        <div class="section">
          <h4>👤 嫌疑人</h4>
          <div class="suspects">
            <div 
              v-for="suspect in currentCase.suspects" 
              :key="suspect.id"
              class="suspect-item"
            >
              <div class="suspect-name">{{ suspect.name }}</div>
              <div class="suspect-desc">{{ suspect.description }}</div>
            </div>
          </div>
        </div>
        
        <div class="section question-section">
          <h4>❓ {{ currentCase.question }}</h4>
          <div class="options">
            <button
              v-for="(option, index) in currentCase.options"
              :key="index"
              class="option-btn"
              :class="{ 
                selected: selectedAnswer === index,
                correct: showResult && index === currentCase.answer,
                wrong: showResult && selectedAnswer === index && index !== currentCase.answer
              }"
              :disabled="showResult"
              @click="selectedAnswer = index"
            >
              {{ ['A', 'B', 'C', 'D'][index] }}. {{ option }}
            </button>
          </div>
          
          <button 
            v-if="!showResult"
            class="btn btn-primary submit-btn"
            :disabled="selectedAnswer === null"
            @click="submitAnswer"
          >
            提交答案
          </button>
          
          <div v-if="showResult" class="result-section">
            <div :class="['result-badge', isCorrect ? 'correct' : 'wrong']">
              {{ isCorrect ? '✓ 回答正确！' : '✗ 回答错误' }}
            </div>
            <div class="analysis">
              <h5>案件解析</h5>
              <p>{{ currentCase.analysis }}</p>
            </div>
            <button class="btn btn-primary" @click="currentCase = null">
              返回案件列表
            </button>
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
import { detectiveCases } from '@/data/detectiveCases'

const router = useRouter()
const gameStore = useGameStore()

const currentCase = ref(null)
const expandedClues = ref([])
const selectedAnswer = ref(null)
const showResult = ref(false)
const isCorrect = ref(false)

const completedCases = computed(() => gameStore.gameProgress.completedCases || [])

const isCompleted = (caseId) => completedCases.value.includes(caseId)

const selectCase = (caseItem) => {
  currentCase.value = caseItem
  expandedClues.value = []
  selectedAnswer.value = null
  showResult.value = false
}

const toggleClue = (clueId) => {
  if (expandedClues.value.includes(clueId)) {
    expandedClues.value = expandedClues.value.filter(id => id !== clueId)
  } else {
    expandedClues.value.push(clueId)
  }
}

const submitAnswer = async () => {
  if (selectedAnswer.value === null) return
  
  isCorrect.value = selectedAnswer.value === currentCase.value.answer
  showResult.value = true
  
  await gameStore.completeDetectiveCase(
    currentCase.value.id,
    isCorrect.value,
    isCorrect.value ? currentCase.value.score : 0
  )
}
</script>

<style scoped>
.detective-game {
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

.case-list {
  display: grid;
  gap: 15px;
}

.case-card {
  cursor: pointer;
  transition: all 0.3s;
}

.case-card:hover {
  transform: translateX(5px);
  border-color: rgba(0, 212, 255, 0.5);
}

.case-card.completed {
  border-color: #27ae60;
  opacity: 0.8;
}

.case-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.case-id {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.case-card h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.case-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 15px;
}

.case-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.score {
  color: #ffd700;
  font-weight: 600;
}

.completed-badge {
  color: #27ae60;
  font-size: 14px;
}

.pending-badge {
  color: #f39c12;
  font-size: 14px;
}

/* 案件详情 */
.detail-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.case-content {
  padding: 25px;
}

.section {
  margin-bottom: 25px;
}

.section h4 {
  margin-bottom: 15px;
  color: #00d4ff;
}

.clues {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clue-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.clue-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.clue-item.expanded {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
}

.clue-title {
  font-weight: 600;
}

.clue-content {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.suspects {
  display: grid;
  gap: 10px;
}

.suspect-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 15px;
  border-radius: 8px;
}

.suspect-name {
  font-weight: 600;
  margin-bottom: 5px;
}

.suspect-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.question-section {
  background: rgba(0, 212, 255, 0.05);
  padding: 20px;
  border-radius: 12px;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 20px 0;
}

.option-btn {
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent;
  border-radius: 10px;
  color: #fff;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s;
}

.option-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(0, 212, 255, 0.3);
}

.option-btn.selected {
  border-color: #00d4ff;
  background: rgba(0, 212, 255, 0.2);
}

.option-btn.correct {
  border-color: #27ae60;
  background: rgba(39, 174, 96, 0.2);
}

.option-btn.wrong {
  border-color: #e74c3c;
  background: rgba(231, 76, 60, 0.2);
}

.submit-btn {
  width: 100%;
  margin-top: 10px;
}

.result-section {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.result-badge {
  display: inline-block;
  padding: 10px 20px;
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
  background: rgba(255, 255, 255, 0.05);
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
}

.analysis h5 {
  margin-bottom: 10px;
  color: #00d4ff;
}

.analysis p {
  font-size: 14px;
  line-height: 1.6;
}
</style>
