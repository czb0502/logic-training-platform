<template>
  <div id="app">
    <!-- 全局背景粒子效果 -->
    <div class="particles-bg">
      <div v-for="n in 20" :key="n" class="particle"></div>
    </div>
    
    <!-- 路由视图 -->
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
    
    <!-- 全局宠物悬浮窗 -->
    <PetCompanion v-if="isLoggedIn" />
    
    <!-- 成就弹窗 -->
    <AchievementModal />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserStore } from '@/store/userStore'
import PetCompanion from '@/components/PetCompanion.vue'
import AchievementModal from '@/components/AchievementModal.vue'

const userStore = useUserStore()
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 初始化加载状态
const isInitialized = ref(false)

onMounted(async () => {
  // 等待用户信息加载完成
  if (userStore.token && !userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
  isInitialized.value = true
})
</script>

<style>
/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Rajdhani', -apple-system, BlinkMacSystemFont, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
  color: #fff;
  overflow-x: hidden;
}

/* Google Fonts - 已移到 index.html */

/* 页面过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 粒子背景 */
.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(0, 212, 255, 0.3);
  border-radius: 50%;
  animation: float 15s infinite;
}

.particle:nth-child(1) { left: 10%; animation-delay: 0s; }
.particle:nth-child(2) { left: 20%; animation-delay: 1s; }
.particle:nth-child(3) { left: 30%; animation-delay: 2s; }
.particle:nth-child(4) { left: 40%; animation-delay: 3s; }
.particle:nth-child(5) { left: 50%; animation-delay: 4s; }
.particle:nth-child(6) { left: 60%; animation-delay: 5s; }
.particle:nth-child(7) { left: 70%; animation-delay: 6s; }
.particle:nth-child(8) { left: 80%; animation-delay: 7s; }
.particle:nth-child(9) { left: 90%; animation-delay: 8s; }
.particle:nth-child(10) { left: 15%; animation-delay: 9s; }
.particle:nth-child(11) { left: 25%; animation-delay: 10s; }
.particle:nth-child(12) { left: 35%; animation-delay: 11s; }
.particle:nth-child(13) { left: 45%; animation-delay: 12s; }
.particle:nth-child(14) { left: 55%; animation-delay: 13s; }
.particle:nth-child(15) { left: 65%; animation-delay: 14s; }
.particle:nth-child(16) { left: 75%; animation-delay: 0.5s; }
.particle:nth-child(17) { left: 85%; animation-delay: 1.5s; }
.particle:nth-child(18) { left: 5%; animation-delay: 2.5s; }
.particle:nth-child(19) { left: 95%; animation-delay: 3.5s; }
.particle:nth-child(20) { left: 50%; animation-delay: 4.5s; }

@keyframes float {
  0%, 100% {
    transform: translateY(100vh) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(1);
    opacity: 0;
  }
}

/* 通用按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-primary {
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 212, 255, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 卡片样式 */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: rgba(0, 212, 255, 0.3);
  box-shadow: 0 0 30px rgba(0, 212, 255, 0.1);
}

/* 输入框样式 */
.input {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #00d4ff;
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* 霓虹发光效果 */
.neon-text {
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.5),
               0 0 20px rgba(0, 212, 255, 0.3),
               0 0 30px rgba(0, 212, 255, 0.2);
}

.neon-border {
  box-shadow: 0 0 10px rgba(0, 212, 255, 0.3),
              inset 0 0 10px rgba(0, 212, 255, 0.1);
}
</style>
