import { createAxiosInstance } from './request'

const request = createAxiosInstance({ baseURL: import.meta.env.VITE_APP_API_URL })

export const loginAsync = async (loginDto) => await request.post(`/login`, loginDto)

export const createAsync = async (params) => await request.post('/member', params)

export const createCaptchaAsync = async (params) => await request.post('/member/captcha', params)

export const refreshTokenAsync = async (params, signal) =>
  await request.post('/token/refresh', params, { signal })

export const getNewsAsync = async () => await request.get('/news')

export const getProductsAsync = async (params) => await request.get('/products', { params })

export const getProductAsync = async (id) => await request.get(`/products/${id}`)

export const getStoreAsync = async () => await request.get('/store')

export const getProductCategoriesAsync = async () => await request.get('/productCategories')

export const getProductCategoryAsync = async (id) => await request.get(`/productCategories/${id}`)

export const getPaymentMethodsAsync = async () => await request.get(`/paymentMethods`)

export const craeteOrderAsync = async (params) => await request.post('/orders', params)
