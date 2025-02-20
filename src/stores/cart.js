import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useUserStore } from './user'

const userStore = useUserStore()

export const useCartStore = defineStore(
  'cart',
  () => {
    const cart = reactive({
      memberId: null,
      products: [],
    })

    const addToCart = (product, quantity) => {
      const products = cart.products.filter((item) => item.id === product.id)
      if (products && products.length > 0) {
        products[0].quantity = products[0].quantity + quantity
      } else {
        cart.products.push({
          ...product,
          quantity,
        })
      }
    }

    const merge = (source) => {
      if (!source) return true
      if (source.products.length > 0) cart.products = source.products

      return true
    }

    const removeProduct = (product) => {
      const index = cart.products.findIndex((item) => item.id === product.id)
      if (index >= 0) {
        cart.products.splice(index, 1)
      }
    }

    const removeAllProduct = () => {
      cart.products = []
    }
    return { cart, addToCart, removeProduct, removeAllProduct, merge }
  },
  {
    persist: {
      key: userStore.IsAuthorizated() ? `cart_${userStore.user.id}` : 'cart',
      storage: {
        getItem: (key) => {
          const userStore = useUserStore()
          const storageKey = userStore.IsAuthorizated() ? `cart_${userStore.user.id}` : key
          const data = JSON.parse(localStorage.getItem(storageKey))
          return { cart: data || {} }
        },
        setItem: (key, value) => {
          const userStore = useUserStore()
          const storageKey = userStore.IsAuthorizated() ? `cart_${userStore.user.id}` : key

          const { cart } = JSON.parse(value)
          localStorage.setItem(storageKey, JSON.stringify(cart))
        },
        removeItem: (key) => {
          const userStore = useUserStore()
          const storageKey = userStore.IsAuthorizated() ? `cart_${userStore.user.id}` : key
          localStorage.removeItem(storageKey)
        },
      },
    },
  },
)
