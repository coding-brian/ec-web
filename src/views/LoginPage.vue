<script setup>
import { reactive } from 'vue'
import { debounce, isNull } from 'lodash-es'
import { useUser } from '@/composables/user'

const { userLoginAsync, user } = useUser()

const form = reactive({
  account: null,
  password: null,
})

let errorResponse = reactive({
  isSuccess: null,
  error: {
    code: null,
    message: null,
    detail: null,
  },
})

const check = () => {
  if (isNull(form.account) || isNull(form.password)) return false

  return true
}

const submitAsync = debounce(async () => {
  try {
    if (!check()) return false
    await userLoginAsync(form)
    errorResponse.isSuccess = true

    // TODO: 這邊要實作去登入後的頁面
    return true
  } catch (ex) {
    errorResponse.isSuccess = ex.isSuccess
    errorResponse.error = ex.error
    return false
  }
})
</script>

<template>
  <div>
    <div>
      <span>帳號:</span>
      <div>
        <input type="text" v-model="form.account" />
      </div>
    </div>
    <div>
      <span>密碼:</span>
      <div>
        <input type="password" v-model="form.password" />
      </div>
    </div>
    <div v-if="!errorResponse.isSuccess">
      <span>
        {{ errorResponse.error.message }}
      </span>
    </div>
    <button @click="submitAsync">確認</button>
  </div>
</template>
