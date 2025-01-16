import axios from 'axios'
import { useToken } from '@/composables/token'

const { getToken } = useToken()

axios.interceptors.request.use(
  function (config) {
    const { accessToken } = getToken()
    config.headers['Authorization'] = `Bearer ${accessToken}`
    return config
  },
  function (error) {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  function (response) {
    return response.data
  },
  function (error) {
    return Promise.reject(error)
  },
)

export { axios }
