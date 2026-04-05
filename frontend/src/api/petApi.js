import request from './request'

export const petApi = {
  // 获取宠物列表
  getPetList: () => request.get('/api/pet/list'),
  
  // 解锁宠物
  unlockPet: (data) => request.post('/api/pet/unlock', data),
  
  // 喂食宠物
  feedPet: (data) => request.post('/api/pet/feed', data),
  
  // 升级宠物
  upgradePet: (data) => request.post('/api/pet/upgrade', data),
  
  // 设置当前宠物
  setActivePet: (data) => request.put('/api/pet/active', data),
  
  // 宠物互动
  interactPet: (data) => request.post('/api/pet/interact', data)
}
