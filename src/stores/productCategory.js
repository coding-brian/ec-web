import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductCategory = defineStore('productCategory', () => {
  const productCategories = ref(null)
  return { productCategories }
})
