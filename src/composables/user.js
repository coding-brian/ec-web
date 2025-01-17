import { useToken } from '@/composables/token'
import { fromUnixTime } from 'date-fns'
import { jwtDecode } from 'jwt-decode'
import { loginAsync, refreshTokenAsync } from '@/api/ecapi'

const { setToken, getToken } = useToken()

const user = {
  id: null,
  name: null,
  email: null,
  expireDateTime: null,
}

export function useUser() {
  const userLoginAsync = async ({ account, password }) => {
    try {
      const token = await loginAsync({ account, password })
      setToken(token)
      setUser(token)
      autoRefresh(token)
      return true
    } catch (ex) {
      throw ex
    }
  }

  const freshUserAsync = async () => {
    try {
      const token = getToken()
      setToken(await refreshTokenAsync({ refreshToken: token.refreshToken }))
      setUser(token)
      autoRefresh(token)
      return true
    } catch (ex) {
      throw ex
    }
  }

  const setUser = (token) => {
    const { email, exp } = jwtDecode(token.accessToken)
    user.expireDateTime = fromUnixTime(exp)
    user.email = email
  }

  const IsAuthorizated = () => {
    if (!getToken() || new Date() > user.expireDateTime) return false
    return true
  }

  const autoRefresh = (token) => {
    const bufferTime = 10 * 60
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
}
