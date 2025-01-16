import { axios } from './request'

const request = axios.create({ baseURL: process.env.VITE_APP_API_URL })

export const loginAsync = async (loginDto) => await request.post('/login', loginDto)

export const createAsync = async (params) => await request.post('/member', params)

export const createCaptchaAsync = async (params) => await request.post('/member/captcha', params)
