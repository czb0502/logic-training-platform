<template>
  <div class="user-center">
    <div class="header">
      <button class="btn btn-secondary" @click="router.push('/')">← 返回</button>
      <h2>用户中心</h2>
      <button class="btn btn-secondary" @click="logout">退出登录</button>
    </div>
    
    <div class="user-card card">
      <div class="avatar-section">
        <div class="avatar">{{ userStore.userInfo?.username?.[0] }}</div>
        <div class="user-info">
          <h3>{{ userStore.userInfo?.username }}</h3>
          <p class="level">{{ userStore.userInfo?.level }}</p>
          <p class="account">账号: {{ userStore.userInfo?.account }}</p>
        </div>
      </div>
      
      <div class="stats-grid">
        <div class="stat-box">
          <span class="value">{{ userStore.userInfo?.totalScore }}</span>
          <span class="label">总积分</span>
        </div>
        <div class="stat-box">
          <span class="value">{{ userStore.userInfo?.coins }}</span>
          <span class="label">金币</span>
        </div>
        <div class="stat-box">
          <span class="value">{{ userStore.userInfo?.scores?.detective }}</span>
          <span class="label">侦探</span>
        </div>
        <div class="stat-box">
          <span class="value">{{ userStore.userInfo?.scores?.engineering }}</span>
          <span class="label">工程</span>
        </div>
        <div class="stat-box">
          <span class="value">{{ userStore.userInfo?.scores?.expression }}</span>
          <span class="label">表达</span>
        </div>
      </div>
    </div>
    
    <div class="actions card">
      <h3>账号设置</h3>
      <div class="action-list">
        <div class="action-item" @click="showEditName = true">
          <span>修改昵称</span>
          <span>→</span>
        </div>
        <div class="action-item" @click="showChangePassword = true">
          <span>修改密码</span>
          <span>→</span>
        </div>
        <div class="action-item danger" @click="showDeleteAccount = true">
          <span>注销账号</span>
          <span>→</span>
        </div>
      </div>
    </div>
    
    <!-- 修改昵称弹窗 -->
    <div v-if="showEditName" class="modal" @click="showEditName = false">
      <div class="modal-content card" @click.stop>
        <h3>修改昵称</h3>
        <input v-model="newName" class="input" placeholder="请输入新昵称" />
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showEditName = false">取消</button>
          <button class="btn btn-primary" @click="updateName">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const router = useRouter()
const userStore = useUserStore()

const showEditName = ref(false)
const showChangePassword = ref(false)
const showDeleteAccount = ref(false)
const newName = ref('')

const logout = () => {
  userStore.logout()
  router.push('/login')
}

const updateName = async () => {
  if (!newName.value.trim()) return
  const res = await userStore.updateUserInfo({ username: newName.value })
  if (res.success) {
    showEditName.value = false
    newName.value = ''
  }
}
</script>

<style scoped>
.user-center {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.header h2 {
  font-family: 'Orbitron', sans-serif;
}

.user-card {
  padding: 25px;
  margin-bottom: 20px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
}

.user-info h3 {
  font-size: 22px;
  margin-bottom: 5px;
}

.level {
  color: #00d4ff;
  margin-bottom: 5px;
}

.account {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 15px;
}

.stat-box {
  text-align: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.stat-box .value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 5px;
}

.stat-box .label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.actions {
  padding: 20px;
}

.actions h3 {
  margin-bottom: 15px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s;
}

.action-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.action-item.danger {
  color: #e74c3c;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 400px;
  padding: 25px;
}

.modal-content h3 {
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.modal-actions .btn {
  flex: 1;
}
</style>
