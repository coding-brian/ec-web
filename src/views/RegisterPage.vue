<script setup>
import { reactive } from 'vue'
import { createAsync, createCaptchaAsync } from '@/api/ecapi'
import { debounce, flatMap } from 'lodash-es'

const form = reactive({
  phone: null,
  captcha: null,
  password: null,
  confirmedPassword: null,
  name: null,
  email: null,
  birth: null,
  gender: null,
})

const checkPassword = () => {
  if (!form.password) return false
  if (!form.confirmedPassword) return false
  if (form.confirmedPassword !== form.password) return false

  return true
}

const checkEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(form.email)) {
    return false
  }

  return true
}

const checkPhone = () => {
  if (!form.phone) return false
  return true
}

const isNull = (value) => {
  if (!value) return true
  return false
}

const check = () => {
  const result = true

  if (!checkPassword() || !checkEmail()) {
    result = false
  }

  Object.keys(form).forEach((key) => {
    if (isNull(form[key])) result = false
  })

  return result
}
const sendCaptchaAsync = debounce(async () => {
  if (!checkPhone()) return false
  const { phone } = form
  await createCaptchaAsync({ phone })
})

const submitAsync = debounce(async () => {
  if (check()) {
    await createAsync(form)
  }
})
</script>

<template>
  <span>註冊</span>
  <div>
    <div>
      <span>手機*</span>
      <div>
        <input type="text" v-model="form.phone" />
        <button @click="sendCaptchaAsync">發送驗證碼</button>
      </div>
      <span>請輸入驗證碼:</span>
      <div>
        <input type="text" v-model="form.captcha" />
      </div>
    </div>
    <div>
      <div>
        <span>姓名*</span>
        <div>
          <input type="text" v-model="form.name" />
        </div>
      </div>
      <div>
        <span>密碼*</span>
        <div>
          <input type="text" v-model="form.password" />
        </div>
      </div>
      <div>
        <span>確認密碼*</span>
        <div>
          <input type="text" v-model="form.confirmedPassword" />
        </div>
      </div>
      <div>
        <span>信箱*</span>
        <div>
          <input type="text" v-model="form.email" />
        </div>
      </div>
      <div>
        <span>生日*</span>
        <div>
          <input type="date" name="" id="" v-model="form.birth" />
        </div>
      </div>
      <div>
        <span>性別*</span>
        <div>
          <select name="" id="" v-model="form.gender">
            <option disabled selected value="null">請選擇</option>
            <option value="0">男</option>
            <option value="1">女</option>
            <option value="2">非二元</option>
          </select>
        </div>
      </div>
      <div>
        <button @click="submitAsync">註冊</button>
      </div>
    </div>
  </div>
</template>
