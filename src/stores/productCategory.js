import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useProductCategoryStore = defineStore('productCategory', () => {
  const productCategories = ref(null)
  const productCategory = ref(null)
  return { productCategories, productCategory }
})
