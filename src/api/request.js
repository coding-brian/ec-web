import axios from 'axios'
import { useTokenStore } from '@/stores/token'

const createAxiosInstance = ({ baseURL }) => {
  const instance = axios.create({ baseURL })
  instance.interceptors.request.use(
    function (config) {
      const tokenStore = useTokenStore()
      if (tokenStore.token && tokenStore.token.accessToken) {
        config.headers['Authorization'] = `Bearer ${tokenStore.token.accessToken}`
      }
      return config
    },
    function (error) {
      return Promise.reject(error)
    },
  )

  instance.interceptors.response.use(
    function (response) {
      return response.data
    },
    function (error) {
      return Promise.reject(error.response.data)
    },
  )

  return instance
}

export { createAxiosInstance }
