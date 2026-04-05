import axios from 'axios'
import { useUserStore } from '@/store/userStore'
import router from '@/router'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从localStorage获取token
    const token = localStorage.getItem('logic_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { data } = response
    
    // 业务错误处理
    if (!data.success) {
      // 显示错误提示
      console.error('请求失败:', data.message)
    }
    
    return data
  },
  (error) => {
    // HTTP错误处理
    if (error.response) {
      const { status } = error.response
      
      if (status === 401) {
        // Token过期，清除登录态并跳转登录页
        const userStore = useUserStore()
        userStore.logout()
        router.push('/login')
        console.error('登录已过期，请重新登录')
      } else {
        console.error('服务器错误:', error.response.data?.message || '未知错误')
      }
    } else {
      console.error('网络错误:', error.message)
    }
    
    return Promise.reject(error)
  }
)

export default request
