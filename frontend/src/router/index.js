import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/userStore'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/games',
    name: 'GameHall',
    component: () => import('@/pages/GameHall.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/games/detective',
    name: 'DetectiveGame',
    component: () => import('@/components/games/DetectiveGame.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/games/engineering',
    name: 'ProductionLineGame',
    component: () => import('@/components/games/ProductionLineGame.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/games/expression',
    name: 'ExpressionGame',
    component: () => import('@/components/games/ExpressionGame.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'UserCenter',
    component: () => import('@/pages/UserCenter.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/achievements',
    name: 'Achievement',
    component: () => import('@/pages/Achievement.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/rank',
    name: 'Rank',
    component: () => import('@/pages/Rank.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pets',
    name: 'PetHouse',
    component: () => import('@/pages/PetHouse.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  
  // 如果有token但没有userInfo，先获取用户信息
  if (userStore.token && !userStore.userInfo) {
    await userStore.fetchUserInfo()
  }
  
  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
    return
  }
  
  // 游客专属页面（登录后不能访问）
  if (to.meta.guestOnly && userStore.isLoggedIn) {
    next('/')
    return
  }
  
  next()
})

export default router
