<script setup>
import { reactive } from 'vue'
import { debounce, isNull, isEmpty } from 'lodash-es'
import { useUserStore } from '@/stores/user'
import NavBar from '@/components/NavBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import { useRouter } from 'vue-router'
import GoBack from '@/components/Text/GoBack.vue'
import CustomInput from '@/components/CustomInput.vue'
import { useCartStore } from '@/stores/cart'

const userStore = useUserStore()
const router = useRouter()
let cartStore = useCartStore()

const validate = (item) => {
  if (isNull(item.value) || isEmpty(item.value)) return false
  return true
}

const form = reactive({
  account: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.account.checked = validate(form.account)
      return form.account.checked
    },
  },
  password: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.password.checked = validate(form.password)
      return form.password.checked
    },
  },
})

const errorResponse = reactive({
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

    const body = {}
    for (const item of Object.entries(form)) {
      body[item[0]] = item[1].value
    }

    await userStore.userLoginAsync(body)

    cartStore.$dispose() // **清除 store**
    cartStore = useCartStore()
    cartStore.cart.memberId = userStore.user.id
    cartStore.merge(JSON.parse(localStorage.getItem('cart')))
    localStorage.removeItem('cart')

    errorResponse.isSuccess = true

    return router.push({ name: 'home' })
  } catch (ex) {
    console.log(ex)
    errorResponse.isSuccess = ex.isSuccess
    errorResponse.error = ex.error
    return false
  }
})
</script>

<template>
  <NavBar></NavBar>
  <main>
    <GoBack></GoBack>
    <div class="login-container">
      <span class="h3-manrope-bold register-container-title">登入</span>
      <div class="field">
        <CustomInput
          class="account"
          :class="{ error: !form.account.checked }"
          :ref="(el) => (form.account.element = el)"
          :validate="form.account.validate"
          v-model:value="form.account.value"
          :placeholder="'請輸入手機'"
        >
          <template v-slot:title> Account* </template>
          <template v-slot:error-message> {{ form.account.erroMessage }} </template>
        </CustomInput>
        <CustomInput
          class="account"
          :class="{ error: !form.password.checked }"
          :ref="(el) => (form.password.element = el)"
          :validate="form.password.validate"
          v-model:value="form.password.value"
          :placeholder="'請輸入密碼'"
          :type="'password'"
        >
          <template v-slot:title> Password* </template>
          <template v-slot:error-message> {{ form.password.erroMessage }} </template>
        </CustomInput>
        <span class="error" v-if="!errorResponse.isSuccess">
          {{ errorResponse.error.message }}
        </span>
      </div>
      <button @click="submitAsync">確認</button>
      <span class="register" @click="router.push({ name: 'register' })">這邊註冊</span>
    </div>
  </main>

  <FooterComponent></FooterComponent>
</template>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.error {
  color: red;
}

.register {
  cursor: pointer;
}
</style>
