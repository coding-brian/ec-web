import { useStorage } from '@vueuse/core'

const token = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  tokenType: null,
}
const storageName = 'token'

export function useToken() {
  const storage = useStorage(storageName, token)

  const getToken = () => {
    return storage.value
  }

  const setToken = (token) => {
    storage.value = token
  }

  const deleteToken = () => {
    storage.value = null
  }

  return { getToken, setToken, deleteToken }
}
