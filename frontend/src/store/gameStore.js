import { defineStore } from 'pinia'
import { ref } from 'vue'
import { gameApi } from '@/api/gameApi'

export const useGameStore = defineStore('game', () => {
  // State
  const gameProgress = ref({
    completedCases: [],
    completedEngineering: [],
    completedExpression: [],
    scores: { detective: 0, engineering: 0, expression: 0 },
    totalScore: 0,
    achievements: []
  })
  const currentCase = ref(null)
  const currentLevel = ref(null)

  // Actions
  const fetchGameProgress = async () => {
    try {
      const res = await gameApi.getGameProgress()
      if (res.success) {
        gameProgress.value = res.data
      }
    } catch (error) {
      console.error('获取游戏进度失败:', error)
    }
  }

  const completeDetectiveCase = async (caseId, correct, score) => {
    try {
      const res = await gameApi.completeDetectiveCase({ caseId, score, correct })
      if (res.success) {
        await fetchGameProgress()
      }
      return res
    } catch (error) {
      return { success: false, message: '提交失败' }
    }
  }

  const completeEngineeringLevel = async (levelId, score, isOptimal) => {
    try {
      const res = await gameApi.completeEngineeringLevel({ levelId, score, isOptimal })
      if (res.success) {
        await fetchGameProgress()
      }
      return res
    } catch (error) {
      return { success: false, message: '提交失败' }
    }
  }

  const completeExpressionLevel = async (levelId, score, analysis) => {
    try {
      const res = await gameApi.completeExpressionLevel({ levelId, score, analysis })
      if (res.success) {
        await fetchGameProgress()
      }
      return res
    } catch (error) {
      return { success: false, message: '提交失败' }
    }
  }

  const setCurrentCase = (caseData) => {
    currentCase.value = caseData
  }

  const setCurrentLevel = (levelData) => {
    currentLevel.value = levelData
  }

  return {
    gameProgress,
    currentCase,
    currentLevel,
    fetchGameProgress,
    completeDetectiveCase,
    completeEngineeringLevel,
    completeExpressionLevel,
    setCurrentCase,
    setCurrentLevel
  }
})
