import { createAxiosInstance } from './request'

const request = createAxiosInstance({ baseURL: process.env.VITE_APP_API_URL })

export const loginAsync = async (loginDto) => await request.post(`/login`, loginDto)

export const createAsync = async (params) => await request.post('/member', params)

export const createCaptchaAsync = async (params) => await request.post('/member/captcha', params)

export const refreshTokenAsync = async (params) => await request.post('/token/refresh', params)
