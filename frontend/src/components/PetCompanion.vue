<template>
  <div class="pet-companion" v-if="activePet">
    <div class="pet-float" :class="{ expanded: isExpanded, 'pet-legend': activePet.rarity === 'legend', 'pet-epic': activePet.rarity === 'epic', 'pet-rare': activePet.rarity === 'rare' }" @click="toggleExpand">
      <div v-if="activePet.id === 'pet_moon'" class="moon-rabbit-container">
        <div class="moon-bg">🌕</div>
        <div class="rabbit-glow"></div>
        <div class="rabbit">🐰</div>
        <div class="stars"><span v-for="n in 5" :key="n" class="star" :style="{ animationDelay: n * 0.5 + 's' }">✨</span></div>
      </div>
      <div v-else class="pet-avatar-wrapper">
        <div class="pet-glow" :style="{ background: activePet.borderColor }"></div>
        <div class="pet-avatar">{{ activePet.avatar }}</div>
      </div>
      <div v-if="!isExpanded" class="pet-mini-stats">
        <div class="mini-bar"><div class="mini-fill satiety" :style="{ width: petData.satiety + '%' }"></div></div>
        <div class="mini-bar"><div class="mini-fill intimacy" :style="{ width: petData.intimacy + '%' }"></div></div>
      </div>
    </div>
    <Transition name="slide-up">
      <div v-if="isExpanded" class="pet-panel" @click.stop>
        <div class="pet-showcase">
          <div v-if="activePet.id === 'pet_moon'" class="showcase-moon">
            <div class="big-moon">🌕</div><div class="big-rabbit">🐰</div><div class="moon-glow"></div>
            <div class="floating-stars"><span class="star-s">⭐</span><span class="star-m">✨</span><span class="star-l">🌟</span></div>
          </div>
          <div v-else class="showcase-normal"><div class="big-avatar" :style="{ borderColor: activePet.borderColor }">{{ activePet.avatar }}</div></div>
          <div class="pet-info">
            <h3 class="pet-name">{{ activePet.name }}<span class="rarity-badge" :class="activePet.rarity">{{ rarityText }}</span></h3>
            <p class="pet-desc">{{ petDescription }}</p>
          </div>
        </div>
        <div class="level-section">
          <div class="level-header"><span class="level-text">等级 {{ petData.level }}</span><span class="exp-text">{{ petData.exp || 0 }}/{{ (petData.level || 1) * 100 }} EXP</span></div>
          <div class="exp-bar"><div class="exp-fill" :style="{ width: ((petData.exp || 0) % 100) + '%' }"></div></div>
        </div>
        <div class="stats-section">
          <div class="stat-item"><span class="stat-icon">🍖</span><div class="stat-bar-wrapper"><div class="stat-bar-bg"><div class="stat-bar-fill satiety" :style="{ width: petData.satiety + '%' }"></div></div><span class="stat-value">{{ petData.satiety }}/100</span></div></div>
          <div class="stat-item"><span class="stat-icon">❤️</span><div class="stat-bar-wrapper"><div class="stat-bar-bg"><div class="stat-bar-fill intimacy" :style="{ width: petData.intimacy + '%' }"></div></div><span class="stat-value">{{ petData.intimacy }}/100</span></div></div>
        </div>
        <div class="action-section">
          <button class="action-btn feed" @click="showFeedPanel = true"><span class="btn-icon">🥣</span><span class="btn-text">喂食</span></button>
          <button class="action-btn perform" @click="perform"><span class="btn-icon">🎭</span><span class="btn-text">才艺</span></button>
          <button class="action-btn talk" @click="talk"><span class="btn-icon">💬</span><span class="btn-text">对话</span></button>
        </div>
        <Transition name="fade"><div v-if="dialogue" class="dialogue-bubble"><p>{{ dialogue }}</p><div class="bubble-tail"></div></div></Transition>
        <button class="close-btn" @click.stop="isExpanded = false">×</button>
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="showFeedPanel" class="feed-panel" @click.stop>
        <h4 class="feed-title">🍽️ 选择食物</h4>
        <div class="food-grid">
          <div v-for="food in foodsList" :key="food.id" class="food-card" :class="{ disabled: userStore.userInfo?.coins < food.price, selected: selectedFood === food.id }" @click="selectFood(food.id)">
            <div class="food-emoji">{{ food.name.split('')[0] }}</div>
            <div class="food-info"><span class="food-name">{{ food.name.slice(1) }}</span><span class="food-effect">+{{ food.satiety }}饱食 +{{ food.intimacy }}亲密</span></div>
            <div class="food-price"><span class="coin-icon">💰</span><span :class="{ 'price-high': userStore.userInfo?.coins < food.price }">{{ food.price }}</span></div>
          </div>
        </div>
        <div class="feed-actions">
          <button class="btn-confirm" :disabled="!selectedFood || userStore.userInfo?.coins < (foods[selectedFood]?.price || 0)" @click="confirmFeed">确认喂食</button>
          <button class="btn-cancel" @click="showFeedPanel = false">取消</button>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/userStore'
import { usePetStore } from '@/store/petStore'
import { foods } from '@/data/pets'
const userStore = useUserStore()
const petStore = usePetStore()
const isExpanded = ref(false)
const showFeedPanel = ref(false)
const dialogue = ref('')
const selectedFood = ref('')
const activePet = computed(() => { const pet = petStore.activePet; if (!pet || !pet.isUnlocked) return null; return pet })
const petData = computed(() => activePet.value?.data || { level: 1, satiety: 100, intimacy: 0, exp: 0 })
const foodsList = computed(() => Object.values(foods))
const rarityText = computed(() => { const map = { common: '普通', rare: '稀有', epic: '史诗', legend: '传说' }; return map[activePet.value?.rarity] || '普通' })
const petDescription = computed(() => { const desc = { pet_detective: '敏锐的侦探直觉，帮你发现逻辑漏洞', pet_engineering: '精通工程优化，提升产线效率', pet_expression: '温柔可爱，增强你的表达能力', pet_fox: '狡黠的智慧，洞察逻辑本质', pet_cheetah: '闪电般的速度，思维快人一步', pet_moon: '传说级的智慧，月光指引你的道路' }; return desc[activePet.value?.id] || '你的忠实伙伴' })
const toggleExpand = () => { isExpanded.value = !isExpanded.value; if (isExpanded.value) dialogue.value = '' }
const selectFood = (foodId) => { selectedFood.value = foodId }
const confirmFeed = async () => { if (!selectedFood.value) return; const food = foods[selectedFood.value]; if (userStore.userInfo?.coins < food.price) return; const res = await petStore.feedPet(activePet.value.id, selectedFood.value); if (res.success) { showFeedPanel.value = false; selectedFood.value = ''; dialogue.value = `好吃！饱食度+${food.satiety}，亲密度+${food.intimacy} ❤️`; setTimeout(() => dialogue.value = '', 3000) } }
const perform = async () => { const res = await petStore.interactPet(activePet.value.id, 'perform'); dialogue.value = res.success ? res.dialogue : res.message; setTimeout(() => dialogue.value = '', 4000) }
const talk = async () => { const res = await petStore.interactPet(activePet.value.id, 'talk'); if (res.success) { dialogue.value = res.dialogue; setTimeout(() => dialogue.value = '', 4000) } }
</script>
<style scoped>
.pet-companion { position: fixed; bottom: 30px; right: 30px; z-index: 1000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
.pet-float { display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.3s ease; padding: 8px; border-radius: 50px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); }
.pet-float:hover { transform: scale(1.05); background: rgba(255, 255, 255, 0.15); }
.moon-rabbit-container { position: relative; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; }
.moon-bg { position: absolute; font-size: 60px; opacity: 0.9; animation: moonPulse 4s ease-in-out infinite; filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)); }
@keyframes moonPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.6)); } 50% { transform: scale(1.05); filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.9)); } }
.rabbit-glow { position: absolute; width: 40px; height: 40px; background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 70%); border-radius: 50%; animation: glowPulse 2s ease-in-out infinite; }
@keyframes glowPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.2); } }
.rabbit { position: relative; font-size: 32px; z-index: 2; animation: rabbitFloat 3s ease-in-out infinite; filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3)); }
@keyframes rabbitFloat { 0%, 100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-8px) rotate(5deg); } }
.stars { position: absolute; width: 100%; height: 100%; pointer-events: none; }
.star { position: absolute; font-size: 12px; animation: starTwinkle 2s ease-in-out infinite; opacity: 0; }
.star:nth-child(1) { top: 0; left: 10%; }
.star:nth-child(2) { top: 20%; right: 5%; animation-delay: 0.3s; }
.star:nth-child(3) { bottom: 20%; left: 0; animation-delay: 0.6s; }
.star:nth-child(4) { bottom: 10%; right: 15%; animation-delay: 0.9s; }
.star:nth-child(5) { top: 50%; left: -10%; animation-delay: 1.2s; }
@keyframes starTwinkle { 0%, 100% { opacity: 0; transform: scale(0.5); } 50% { opacity: 1; transform: scale(1.2); } }
.pet-avatar-wrapper { position: relative; width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; }
.pet-glow { position: absolute; width: 100%; height: 100%; border-radius: 50%; opacity: 0.3; filter: blur(10px); animation: glowRotate 4s linear infinite; }
@keyframes glowRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.pet-avatar { position: relative; width: 50px; height: 50px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)); border: 2px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; font-size: 28px; z-index: 2; animation: avatarBounce 2s ease-in-out infinite; }
@keyframes avatarBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.pet-mini-stats { display: flex; flex-direction: column; gap: 6px; padding-right: 8px; }
.mini-bar { width: 60px; height: 6px; background: rgba(0, 0, 0, 0.3); border-radius: 3px; overflow: hidden; }
.mini-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
.mini-fill.satiety { background: linear-gradient(90deg, #f39c12, #e74c3c); }
.mini-fill.intimacy { background: linear-gradient(90deg, #3498db, #9b59b6); }
.pet-panel { position: absolute; bottom: 90px; right: 0; width: 320px; background: linear-gradient(145deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 40, 0.98)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(100, 100, 255, 0.1); backdrop-filter: blur(20px); }
.pet-showcase { display: flex; flex-direction: column; align-items: center; margin-bottom: 20px; padding: 20px; background: rgba(255, 255, 255, 0.03); border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05); }
.showcase-moon { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
.big-moon { position: absolute; font-size: 100px; opacity: 0.9; animation: bigMoonPulse 3s ease-in-out infinite; filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)); }
@keyframes bigMoonPulse { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 30px rgba(255, 215, 0, 0.8)); } 50% { transform: scale(1.08); filter: drop-shadow(0 0 50px rgba(255, 215, 0, 1)); } }
.big-rabbit { position: relative; font-size: 50px; z-index: 2; animation: bigRabbitFloat 2.5s ease-in-out infinite; filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)); }
@keyframes bigRabbitFloat { 0%, 100% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-12px) rotate(3deg); } }
.moon-glow { position: absolute; width: 150px; height: 150px; background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%); border-radius: 50%; animation: moonGlowPulse 3s ease-in-out infinite; }
@keyframes moonGlowPulse { 0%, 100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.1); } }
.floating-stars { position: absolute; width: 100%; height: 100%; pointer-events: none; }
.star-s, .star-m, .star-l { position: absolute; animation: starFloat 3s ease-in-out infinite; }
.star-s { font-size: 16px; top: 10%; left: 5%; animation-delay: 0s; }
.star-m { font-size: 20px; top: 60%; right: 5%; animation-delay: 1s; }
.star-l { font-size: 24px; bottom: 10%; left: 10%; animation-delay: 2s; }
@keyframes starFloat { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; } 50% { transform: translateY(-15px) scale(1.2); opacity: 1; } }
.showcase-normal { margin-bottom: 15px; }
.big-avatar { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05)); border: 3px solid; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3); animation: bigAvatarPulse 2s ease-in-out infinite; }
@keyframes bigAvatarPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
.pet-info { text-align: center; }
.pet-name { font-size: 20px; font-weight: 700; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 10px; }
.rarity-badge { font-size: 11px; padding: 3px 10px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
.rarity-badge.common { background: linear-gradient(135deg, #95a5a6, #7f8c8d); color: white; }
.rarity-badge.rare { background: linear-gradient(135deg, #3498db, #2980b9); color: white; }
.rarity-badge.epic { background: linear-gradient(135deg, #9b59b6, #8e44ad); color: white; }
.rarity-badge.legend { background: linear-gradient(135deg, #f1c40f, #f39c12, #e74c3c); color: white; animation: legendShine 2s linear infinite; background-size: 200% 200%; }
@keyframes legendShine { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.pet-desc { font-size: 13px; color: rgba(255, 255, 255, 0.6); line-height: 1.5; }
.level-section { margin-bottom: 20px; padding: 15px; background: rgba(255, 255, 255, 0.03); border-radius: 12px; }
.level-header { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
.level-text { font-weight: 600; color: #f1c40f; }
.exp-text { color: rgba(255, 255, 255, 0.5); }
.exp-bar { height: 8px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; overflow: hidden; }
.exp-fill { height: 100%; background: linear-gradient(90deg, #f1c40f, #f39c12); border-radius: 4px; transition: width 0.5s ease; box-shadow: 0 0 10px rgba(241, 196, 15, 0.5); }
.stats-section { margin-bottom: 20px; display: flex; flex-direction: column; gap: 12px; }
.stat-item { display: flex; align-items: center; gap: 10px; }
.stat-icon { font-size: 18px; width: 24px; text-align: center; }
.stat-bar-wrapper { flex: 1; display: flex; align-items: center; gap: 10px; }
.stat-bar-bg { flex: 1; height: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 5px; overflow: hidden; }
.stat-bar-fill { height: 100%; border-radius: 5px; transition: width 0.5s ease; }
.stat-bar-fill.satiety { background: linear-gradient(90deg, #f39c12, #e74c3c); box-shadow: 0 0 8px rgba(243, 156, 18, 0.4); }
.stat-bar-fill.intimacy { background: linear-gradient(90deg, #3498db, #9b59b6); box-shadow: 0 0 8px rgba(52, 152, 219, 0.4); }
.stat-value { font-size: 12px; color: rgba(255, 255, 255, 0.7); min-width: 50px; text-align: right; }
.action-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.action-btn { display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 8px; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; color: white; cursor: pointer; transition: all 0.3s ease; }
.action-btn:hover { transform: translateY(-3px); background: rgba(255, 255, 255, 0.1); }
.action-btn.feed:hover { border-color: #f39c12; box-shadow: 0 5px 20px rgba(243, 156, 18, 0.3); }
.action-btn.perform:hover { border-color: #9b59b6; box-shadow: 0 5px 20px rgba(155, 89, 182, 0.3); }
.action-btn.talk:hover { border-color: #3498db; box-shadow: 0 5px 20px rgba(52, 152, 219, 0.3); }
.btn-icon { font-size: 22px; }
.btn-text { font-size: 12px; font-weight: 500; }
.dialogue-bubble { position: relative; margin-top: 15px; padding: 15px; background: linear-gradient(135deg, rgba(100, 100, 255, 0.2), rgba(150, 100, 200, 0.2)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; text-align: center; font-size: 14px; line-height: 1.6; animation: bubblePop 0.3s ease; }
@keyframes bubblePop { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
.bubble-tail { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid rgba(100, 100, 255, 0.2); }
.close-btn { position: absolute; top: 15px; right: 15px; width: 28px; height: 28px; background: rgba(255, 255, 255, 0.1); border: none; border-radius: 50%; color: rgba(255, 255, 255, 0.6); font-size: 18px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
.close-btn:hover { background: rgba(231, 76, 60, 0.3); color: white; }
.feed-panel { position: absolute; bottom: 90px; right: 0; width: 320px; background: linear-gradient(145deg, rgba(30, 30, 50, 0.98), rgba(20, 20, 40, 0.98)); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 20px; padding: 20px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5); backdrop-filter: blur(20px); }
.feed-title { text-align: center; font-size: 18px; margin-bottom: 20px; font-weight: 600; }
.food-grid { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
.food-card { display: flex; align-items: center; gap: 12px; padding: 12px; background: rgba(255, 255, 255, 0.05); border: 2px solid transparent; border-radius: 12px; cursor: pointer; transition: all 0.3s; }
.food-card:hover:not(.disabled) { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); transform: translateX(5px); }
.food-card.selected { border-color: #f1c40f; background: rgba(241, 196, 15, 0.1); }
.food-card.disabled { opacity: 0.4; cursor: not-allowed; }
.food-emoji { font-size: 28px; width: 40px; text-align: center; }
.food-info { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.food-name { font-size: 14px; font-weight: 600; }
.food-effect { font-size: 11px; color: rgba(255, 255, 255, 0.5); }
.food-price { display: flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 600; color: #f1c40f; }
.food-price .price-high { color: #e74c3c; }
.coin-icon { font-size: 14px; }
.feed-actions { display: flex; gap: 10px; }
.btn-confirm, .btn-cancel { flex: 1; padding: 12px; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s; }
.btn-confirm { background: linear-gradient(135deg, #27ae60, #2ecc71); color: white; }
.btn-confirm:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(39, 174, 96, 0.4); }
.btn-confirm:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-cancel { background: rgba(255, 255, 255, 0.1); color: white; }
.btn-cancel:hover { background: rgba(255, 255, 255, 0.2); }
</style>
