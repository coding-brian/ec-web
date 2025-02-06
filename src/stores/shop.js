import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStoreAsync } from '@/api/ecapi'

export const useShopStore = defineStore('shop', () => {
  const shop = ref(null)

  const fetchData = async () => {
    try {
      shop.value = await getStoreAsync()
    } catch (error) {
      console.error('Failed to fetch data:', error)
    }
  }

  fetchData()
  return { shop }
})
