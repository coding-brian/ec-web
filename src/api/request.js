import axios from 'axios'
import { useToken } from '@/composables/token'

const { getToken } = useToken()

const createAxiosInstance = ({ baseURL }) => {
  const instance = axios.create({ baseURL })
  instance.interceptors.request.use(
    function (config) {
      const { accessToken } = getToken()
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`
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
