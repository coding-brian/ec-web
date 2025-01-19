import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTokenStore = defineStore(
  'token',
  () => {
    let token = ref({
      accessToken: null,
      refreshToken: null,
      expiresIn: null,
      tokenType: null,
    })

    const resetToken = () => {
      token.value = {
        accessToken: null,
        refreshToken: null,
        expiresIn: null,
        tokenType: null,
      }
    }

    return { token, resetToken }
  },
  {
    persist: {
      storage: {
        getItem: (key) => {
          const data = JSON.parse(localStorage.getItem(key))
          return { token: data || {} }
        },
        setItem: (key, value) => {
          const { token } = JSON.parse(value)
          localStorage.setItem(key, JSON.stringify(token))
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    },
  },
)
