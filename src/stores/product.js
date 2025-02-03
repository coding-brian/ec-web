import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductStore = defineStore('product', () => {
  const products = ref(null)
  const product = ref(null)
  return { products, product }
})
