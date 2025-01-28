import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProduct = defineStore('product', () => {
  const products = ref(null)
  return { products }
})
