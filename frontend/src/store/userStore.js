import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userApi } from '@/api/userApi'

export const useUserStore = defineStore('user', () => {
  // State
  const token = ref(localStorage.getItem('logic_token') || '')
  const userInfo = ref(null)
  const isLoading = ref(false)

  // Getters
  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)
  
  const levelProgress = computed(() => {
    if (!userInfo.value) return 0
    const score = userInfo.value.totalScore
    if (score >= 2000) return 100
    if (score >= 1500) return (score - 1500) / 5
    if (score >= 1000) return (score - 1000) / 5
    if (score >= 500) return (score - 500) / 5
    if (score >= 200) return (score - 200) / 3
    return score / 2
  })

  // Actions
  const setToken = (newToken) => {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('logic_token', newToken)
    } else {
      localStorage.removeItem('logic_token')
    }
  }

  const setUserInfo = (info) => {
    userInfo.value = info
  }

  const login = async (credentials) => {
    isLoading.value = true
    try {
      const res = await userApi.login(credentials)
      if (res.success) {
        setToken(res.data.token)
        setUserInfo(res.data.user)
        return { success: true }
      }
      return { success: false, message: res.message }
    } catch (error) {
      return { success: false, message: '登录失败' }
    } finally {
      isLoading.value = false
    }
  }

  const register = async (data) => {
    isLoading.value = true
    try {
      const res = await userApi.register(data)
      if (res.success) {
        setToken(res.data.token)
        setUserInfo(res.data.user)
        return { success: true }
      }
      return { success: false, message: res.message }
    } catch (error) {
      return { success: false, message: '注册失败' }
    } finally {
      isLoading.value = false
    }
  }

  const fetchUserInfo = async () => {
    if (!token.value) return
    try {
      const res = await userApi.getProfile()
      if (res.success) {
        setUserInfo(res.data)
      }
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }

  const updateUserInfo = async (data) => {
    try {
      const res = await userApi.updateProfile(data)
      if (res.success) {
        await fetchUserInfo()
        return { success: true }
      }
      return { success: false, message: res.message }
    } catch (error) {
      return { success: false, message: '更新失败' }
    }
  }

  const logout = () => {
    setToken('')
    setUserInfo(null)
    userApi.logout()
  }

  const checkin = async () => {
    try {
      const res = await userApi.checkin()
      if (res.success) {
        await fetchUserInfo()
      }
      return res
    } catch (error) {
      return { success: false, message: '签到失败' }
    }
  }

  // 初始化时获取用户信息
  if (token.value) {
    fetchUserInfo()
  }

  return {
    token,
    userInfo,
    isLoading,
    isLoggedIn,
    levelProgress,
    login,
    register,
    fetchUserInfo,
    updateUserInfo,
    logout,
    checkin
  }
})
