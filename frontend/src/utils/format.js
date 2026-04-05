// 格式化工具

// 格式化数字（添加千分位）
export function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// 格式化日期
export function formatDate(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 格式化时间
export function formatTime(timestamp) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 等级名称映射
const LEVELS = ['新人入门', '初级探员', '推理高手', '逻辑新星', '逻辑专家', '逻辑大师']

export function getLevelName(levelIndex) {
  return LEVELS[levelIndex] || LEVELS[0]
}

export function calculateLevel(totalScore) {
  if (totalScore >= 2000) return { name: LEVELS[5], index: 5 }
  if (totalScore >= 1500) return { name: LEVELS[4], index: 4 }
  if (totalScore >= 1000) return { name: LEVELS[3], index: 3 }
  if (totalScore >= 500) return { name: LEVELS[2], index: 2 }
  if (totalScore >= 200) return { name: LEVELS[1], index: 1 }
  return { name: LEVELS[0], index: 0 }
}

// 计算等级进度
export function calculateLevelProgress(totalScore) {
  const thresholds = [0, 200, 500, 1000, 1500, 2000]
  
  for (let i = 0; i < thresholds.length - 1; i++) {
    if (totalScore < thresholds[i + 1]) {
      const current = totalScore - thresholds[i]
      const needed = thresholds[i + 1] - thresholds[i]
      return Math.min(100, Math.round((current / needed) * 100))
    }
  }
  return 100
}
