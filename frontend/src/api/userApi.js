import request from './request'

export const userApi = {
  // 注册
  register: (data) => request.post('/api/user/register', data),
  
  // 登录
  login: (data) => request.post('/api/user/login', data),
  
  // 获取用户信息
  getProfile: () => request.get('/api/user/profile'),
  
  // 更新用户信息
  updateProfile: (data) => request.put('/api/user/profile', data),
  
  // 修改密码
  changePassword: (data) => request.put('/api/user/password', data),
  
  // 退出登录
  logout: () => request.post('/api/user/logout'),
  
  // 注销账号
  deleteAccount: (data) => request.delete('/api/user/account', { data }),
  
  // 每日签到
  checkin: () => request.post('/api/user/checkin'),
  
  // 获取今日任务
  getTasks: () => request.get('/api/user/tasks'),
  
  // 完成任务
  completeTask: (data) => request.post('/api/user/task/complete', data)
}
