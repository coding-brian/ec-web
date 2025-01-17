import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { jwtDecode } from 'jwt-decode'
import { useTokenStore } from '@/stores/token'
import { loginAsync, refreshTokenAsync } from '@/api/ecapi'
import { fromUnixTime } from 'date-fns'
import { storeToRefs } from 'pinia'

export const useUserStore = defineStore(
  'user',
  () => {
    const user = reactive({
      id: null,
      name: null,
      email: null,
      expireDateTime: null,
    })

    const tokenStore = useTokenStore()
    const { token } = storeToRefs(tokenStore)

    const userLoginAsync = async ({ account, password }) => {
      try {
        token.value = await loginAsync({ account, password })
        setUser(token.value)
        autoRefresh(token.value)
        return true
      } catch (ex) {
        throw ex
      }
    }

    const freshUserAsync = async () => {
      try {
        token.value = await refreshTokenAsync({ refreshToken: token.value.refreshToken })
        setUser(token.value)
        autoRefresh(token.value)
        return true
      } catch (ex) {
        throw ex
      }
    }

    const setUser = (token) => {
      const { email, exp, sub } = jwtDecode(token.accessToken)
      user.expireDateTime = fromUnixTime(exp)
      user.email = email
      user.id = sub
    }

    const IsAuthorizated = () => {
      if (!token.value || new Date() > user.expireDateTime) return false
      return true
    }

    const autoRefresh = (token) => {
      const bufferTime = 10 * 60
      console.log()
      ;(function () {
        const timeoutId = setTimeout(
          async () => {
            await freshUserAsync()
            clearTimeout(timeoutId)
          },
          (token.expiresIn - bufferTime) * 1000,
        )
      })()
    }

    return { user, userLoginAsync, freshUserAsync, IsAuthorizated }
  },
  {
    persist: {
      storage: {
        getItem: (key) => {
          const data = JSON.parse(localStorage.getItem(key))
          return { user: data || {} }
        },
        setItem: (key, value) => {
          const { user } = JSON.parse(value)
          localStorage.setItem(key, JSON.stringify(user))
        },
        removeItem: (key) => localStorage.removeItem(key),
      },
    },
  },
)
