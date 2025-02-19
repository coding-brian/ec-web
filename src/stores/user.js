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
      expireDateTimeStamp: null,
    })

    let timeoutId = null
    const refreshTokenApiController = new AbortController()

    const tokenStore = useTokenStore()
    const { token } = storeToRefs(tokenStore)

    const userLoginAsync = async ({ account, password }) => {
      token.value = await loginAsync({ account, password })
      setUser(token.value.accessToken)
      autoRefresh(token.value)
      return true
    }

    const refreshUserAsync = async () => {
      token.value = await refreshTokenAsync({
        refreshToken: token.value.refreshToken,
        signal: refreshTokenApiController.signal,
      })

      setUser(token.value.accessToken)
      autoRefresh(token.value.expiresIn)
      return true
    }

    const setUser = (accessToken) => {
      const { name, email, exp, sub } = jwtDecode(accessToken)

      user.expireDateTimeStamp = exp
      user.email = email
      user.id = sub
      user.name = name
    }

    const resetUser = () => {
      user.id = null
      user.expireDateTimeStamp = null
      user.email = null
      user.name = null
    }

    const IsAuthorizated = () => {
      if (!token.value || !token.value.accessToken || !user.expireDateTimeStamp) return false

      if (new Date() > fromUnixTime(user.expireDateTimeStamp)) return false

      return true
    }

    const autoRefresh = (expiresIn) => {
      const bufferTime = 10 * 60
      timeoutId = setTimeout(
        async () => {
          await refreshUserAsync()
          clearTimeout(timeoutId)
        },
        (expiresIn - bufferTime) * 1000,
      )
    }

    const userLogout = () => {
      refreshTokenApiController.abort()
      clearTimeout(timeoutId)
      tokenStore.resetToken()
      resetUser()

      location.reload(true)
    }

    return { user, userLoginAsync, refreshUserAsync, IsAuthorizated, userLogout }
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
