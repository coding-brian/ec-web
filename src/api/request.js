import axios from 'axios'
import { useToken } from '@/composables/token'

const { getToken } = useToken()

const instance = axios.create()

instance.interceptors.request.use(
  function (config) {
    const { accessToken } = getToken()
    config.headers['Authorization'] = `Bearer ${accessToken}`
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
    return Promise.reject(error)
  },
)

export { instance }
