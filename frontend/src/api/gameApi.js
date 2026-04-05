import request from './request'

export const gameApi = {
  // 完成侦探案件
  completeDetectiveCase: (data) => request.post('/api/game/detective/complete', data),
  
  // 完成工程关卡
  completeEngineeringLevel: (data) => request.post('/api/game/engineering/complete', data),
  
  // 完成表达关卡
  completeExpressionLevel: (data) => request.post('/api/game/expression/complete', data),
  
  // 获取游戏进度
  getGameProgress: () => request.get('/api/game/progress')
}
