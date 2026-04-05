import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { petApi } from '@/api/petApi'

export const usePetStore = defineStore('pet', () => {
  // State
  const pets = ref([])
  const foods = ref({})
  const activePetId = ref(null)
  const isLoading = ref(false)

  // Getters
  const activePet = computed(() => {
    return pets.value.find(p => p.id === activePetId.value)
  })

  const unlockedPets = computed(() => {
    return pets.value.filter(p => p.isUnlocked)
  })

  // Actions
  const fetchPets = async () => {
    isLoading.value = true
    try {
      const res = await petApi.getPetList()
      if (res.success) {
        pets.value = res.data.pets
        foods.value = res.data.foods
        activePetId.value = res.data.pets.find(p => p.isActive)?.id || null
      }
    } catch (error) {
      console.error('获取宠物列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  const unlockPet = async (petId, unlockCode) => {
    try {
      const res = await petApi.unlockPet({ petId, unlockCode })
      if (res.success) {
        await fetchPets()
      }
      return res
    } catch (error) {
      return { success: false, message: '解锁失败' }
    }
  }

  const feedPet = async (petId, foodId) => {
    try {
      const res = await petApi.feedPet({ petId, foodId })
      if (res.success) {
        await fetchPets()
      }
      return res
    } catch (error) {
      return { success: false, message: '喂食失败' }
    }
  }

  const upgradePet = async (petId) => {
    try {
      const res = await petApi.upgradePet({ petId })
      if (res.success) {
        await fetchPets()
      }
      return res
    } catch (error) {
      return { success: false, message: '升级失败' }
    }
  }

  const setActivePet = async (petId) => {
    try {
      const res = await petApi.setActivePet({ petId })
      if (res.success) {
        activePetId.value = petId
        await fetchPets()
      }
      return res
    } catch (error) {
      return { success: false, message: '设置失败' }
    }
  }

  const interactPet = async (petId, type) => {
    try {
      const res = await petApi.interactPet({ petId, type })
      if (res.success) {
        await fetchPets()
      }
      return res
    } catch (error) {
      return { success: false, message: '互动失败' }
    }
  }

  return {
    pets,
    foods,
    activePetId,
    isLoading,
    activePet,
    unlockedPets,
    fetchPets,
    unlockPet,
    feedPet,
    upgradePet,
    setActivePet,
    interactPet
  }
})
