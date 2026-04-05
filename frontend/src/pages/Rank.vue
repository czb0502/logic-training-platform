<template>
  <div class="rank-page">
    <div class="header">
      <button class="btn btn-secondary" @click="router.push('/')">← 返回</button>
      <h2>排行榜</h2>
    </div>
    
    <div class="rank-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        class="tab-btn"
        :class="{ active: currentTab === tab.key }"
        @click="currentTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <div class="rank-list card">
      <div class="rank-header">
        <span>排名</span>
        <span>用户</span>
        <span>积分</span>
      </div>
      
      <div 
        v-for="(item, index) in currentList" 
        :key="item.userId"
        class="rank-item"
        :class="{ 'is-me': item.userId === userStore.userInfo?.userId, 'top3': index < 3 }"
      >
        <span class="rank-num">
          <span v-if="index < 3" class="medal">{{ ['🥇', '🥈', '🥉'][index] }}</span>
          <span v-else>{{ item.rank }}</span>
        </span>
        <span class="user-name">{{ item.username }}</span>
        <span class="score">{{ item.score }}</span>
      </div>
      
      <div v-if="currentList.length === 0" class="empty">
        暂无数据
      </div>
    </div>
    
    <div v-if="myRank" class="my-rank card">
      <span>我的排名</span>
      <span class="rank">第 {{ myRank.rank }} 名</span>
      <span class="score">{{ myRank.score }} 分</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/userStore'
import request from '@/api/request'

const router = useRouter()
const userStore = useUserStore()

const tabs = [
  { key: 'total', label: '总榜' },
  { key: 'detective', label: '侦探榜' },
  { key: 'engineering', label: '工程榜' },
  { key: 'expression', label: '表达榜' }
]

const currentTab = ref('total')
const rankings = ref({
  total: [],
  detective: [],
  engineering: [],
  expression: []
})
const myRanks = ref({})

const currentList = computed(() => rankings.value[currentTab.value] || [])
const myRank = computed(() => myRanks.value[currentTab.value])

const fetchRankings = async () => {
  const endpoints = {
    total: '/api/rank/total',
    detective: '/api/rank/detective',
    engineering: '/api/rank/engineering',
    expression: '/api/rank/expression'
  }
  
  const res = await request.get(endpoints[currentTab.value])
  if (res.success) {
    rankings.value[currentTab.value] = res.data.rankings
    myRanks.value[currentTab.value] = res.data.myRank
  }
}

watch(currentTab, fetchRankings, { immediate: true })
</script>

<style scoped>
.rank-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.header h2 {
  font-family: 'Orbitron', sans-serif;
}

.rank-tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  flex: 1;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 10px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn.active {
  background: linear-gradient(135deg, #00d4ff, #7b2cbf);
}

.rank-list {
  padding: 0;
  overflow: hidden;
}

.rank-header {
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.rank-item {
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  padding: 15px 20px;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s;
}

.rank-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.rank-item.is-me {
  background: rgba(0, 212, 255, 0.1);
}

.rank-num {
  font-size: 18px;
  font-weight: 600;
}

.medal {
  font-size: 24px;
}

.user-name {
  font-weight: 500;
}

.score {
  color: #00d4ff;
  font-weight: 600;
}

.empty {
  padding: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.my-rank {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  margin-top: 15px;
}

.my-rank .rank {
  font-size: 20px;
  font-weight: 600;
  color: #00d4ff;
}

.my-rank .score {
  color: #ffd700;
}
</style>
