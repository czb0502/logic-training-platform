<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <h1 class="title">逻辑思维训练平台</h1>
        <p class="subtitle">提升你的逻辑推理能力</p>
      </div>
      
      <div class="login-form card">
        <h2 class="form-title">用户登录</h2>
        
        <div class="form-group">
          <label>账号</label>
          <input 
            v-model="form.account" 
            type="text" 
            class="input" 
            placeholder="请输入账号"
            @keyup.enter="handleLogin"
          />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="input" 
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          />
        </div>
        
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        
        <button 
          class="btn btn-primary login-btn" 
          :disabled="isLoading"
          @click="handleLogin"
        >
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
        
        <div class="form-footer">
          <span>还没有账号？</span>
          <router-link to="/register" class="link">立即注册</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const userStore = useUserStore()

const form = reactive({
  account: '',
  password: ''
})

const isLoading = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!form.account || !form.password) {
    errorMsg.value = '请输入账号和密码'
    return
  }
  
  isLoading.value = true
  errorMsg.value = ''
  
  const result = await userStore.login({
    account: form.account,
    password: form.password
  })
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/')
  } else {
    errorMsg.value = result.message || '登录失败'
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-family: 'Orbitron', sans-serif;
  font-size: 28px;
  font-weight: 700;
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 10px;
}

.subtitle {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.login-form {
  padding: 30px;
}

.form-title {
  text-align: center;
  margin-bottom: 25px;
  font-size: 20px;
  color: #fff;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.error-msg {
  color: #e74c3c;
  font-size: 14px;
  margin-bottom: 15px;
  text-align: center;
}

.login-btn {
  width: 100%;
  margin-top: 10px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.link {
  color: #00d4ff;
  text-decoration: none;
  margin-left: 5px;
}

.link:hover {
  text-decoration: underline;
}
</style>
