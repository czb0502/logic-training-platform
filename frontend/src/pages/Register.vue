<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-header">
        <h1 class="title">逻辑思维训练平台</h1>
        <p class="subtitle">开启你的逻辑训练之旅</p>
      </div>
      
      <div class="register-form card">
        <h2 class="form-title">用户注册</h2>
        
        <div class="form-group">
          <label>账号</label>
          <input 
            v-model="form.account" 
            type="text" 
            class="input" 
            placeholder="4-20位字母数字"
          />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            class="input" 
            placeholder="6-20位密码"
          />
        </div>
        
        <div class="form-group">
          <label>确认密码</label>
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            class="input" 
            placeholder="再次输入密码"
          />
        </div>
        
        <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
        
        <button 
          class="btn btn-primary register-btn" 
          :disabled="isLoading"
          @click="handleRegister"
        >
          {{ isLoading ? '注册中...' : '注册' }}
        </button>
        
        <div class="form-footer">
          <span>已有账号？</span>
          <router-link to="/login" class="link">立即登录</router-link>
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
  password: '',
  confirmPassword: ''
})

const isLoading = ref(false)
const errorMsg = ref('')

const handleRegister = async () => {
  // 表单验证
  if (!form.account || !form.password) {
    errorMsg.value = '请填写完整信息'
    return
  }
  
  if (form.account.length < 4 || form.account.length > 20) {
    errorMsg.value = '账号长度应为4-20位'
    return
  }
  
  if (!/^[a-zA-Z0-9]+$/.test(form.account)) {
    errorMsg.value = '账号只能包含字母和数字'
    return
  }
  
  if (form.password.length < 6 || form.password.length > 20) {
    errorMsg.value = '密码长度应为6-20位'
    return
  }
  
  if (form.password !== form.confirmPassword) {
    errorMsg.value = '两次输入的密码不一致'
    return
  }
  
  isLoading.value = true
  errorMsg.value = ''
  
  const result = await userStore.register({
    account: form.account,
    password: form.password
  })
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/')
  } else {
    errorMsg.value = result.message || '注册失败'
  }
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 400px;
}

.register-header {
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

.register-form {
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

.register-btn {
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
