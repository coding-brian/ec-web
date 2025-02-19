<script setup>
import { reactive, ref } from 'vue'
import { createAsync, createCaptchaAsync } from '@/api/ecapi'
import { debounce, isNull, isEmpty } from 'lodash-es'
import FooterComponent from '@/components/FooterComponent.vue'
import NavBar from '@/components/NavBar.vue'
import { useRouter } from 'vue-router'
import CustomInput from '@/components/CustomInput.vue'
import GoBack from '@/components/Text/GoBack.vue'
import { useEmail } from '@/composables/email'

const router = useRouter()
const timeCounter = ref(0)
const captchaCode = ref('')
const { checkEmail } = useEmail()

const validate = (item) => {
  if (isNull(item.value) || isEmpty(item.value)) return false
  return true
}

const form = reactive({
  phone: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.phone.checked = validate(form.phone)
      return form.phone.checked
    },
  },
  captcha: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.captcha.checked = validate(form.captcha)
      return form.captcha.checked
    },
  },
  password: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.password.checked = validate(form.captcha)
      return form.password.checked
    },
  },
  confirmedPassword: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.confirmedPassword.checked = validate(form.confirmedPassword)
      return form.confirmedPassword.checked
    },
  },
  name: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.name.checked = validate(form.name)
      return form.name.checked
    },
  },
  email: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.email.checked = validate(form.email) && checkEmail(form.email.value)

      return form.email.checked
    },
  },
  birth: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.birth.checked = validate(form.birth)
      return form.birth.checked
    },
  },
  gender: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.gender.checked = validate(form.gender)
      return form.gender.checked
    },
  },
})

const checkPassword = () => {
  if (!form.password.value) return false
  if (!form.confirmedPassword.value) return false
  if (form.confirmedPassword.value !== form.password.value) return false

  return true
}

const check = () => {
  const result = []

  if (!checkPassword()) result.push(false)

  for (const item of Object.entries(form)) {
    if (item[1].validate) item[1].validate()
    result.push(item[1].checked)
  }

  return result.every((item) => item)
}

const sendCaptchaAsync = debounce(async () => {
  if (!form.phone.checked) return false
  captchaCode.value = await createCaptchaAsync({ phone: form.phone.value })

  timeCounter.value = 30000
  const intervalId = setInterval(() => {
    timeCounter.value -= 1000
    if (timeCounter.value === 0) clearInterval(intervalId)
  }, 1000)
})

const submitAsync = debounce(async () => {
  try {
    if (check()) {
      const body = {}
      for (const item of Object.entries(form)) {
        body[item[0]] = item[1].value
      }

      const result = await createAsync(body)
      if (result) router.push({ name: 'login' })
      else {
        console.log('Something wrong')
      }
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<template>
  <NavBar></NavBar>
  <main>
    <GoBack></GoBack>
    <div class="register-container">
      <span class="h3-manrope-bold register-container-title">註冊</span>
      <div class="form">
        <div class="field">
          <CustomInput
            class="phone"
            :class="{ error: !form.phone.checked }"
            :ref="(el) => (form.phone.element = el)"
            :validate="form.phone.validate"
            v-model:value="form.phone.value"
            :placeholder="'+1 202-555-0136'"
          >
            <template v-slot:title> Phone* </template>
            <template v-slot:error-message> {{ form.phone.erroMessage }} </template>
          </CustomInput>
          <div class="captcha-container">
            <CustomInput
              class="captcha"
              :class="{ error: !form.captcha.checked }"
              :ref="(el) => (form.captcha.element = el)"
              :validate="form.captcha.validate"
              v-model:value="form.captcha.value"
              :placeholder="'請輸入驗證碼'"
            >
              <template v-slot:title> 請輸入驗證碼* </template>
              <template v-slot:error-message> {{ form.captcha.erroMessage }} </template>
            </CustomInput>
            <span>{{ captchaCode }}</span>
            <template v-if="timeCounter === 0">
              <button @click="sendCaptchaAsync" :disabled="!validate(form.phone)">
                發送驗證碼
              </button>
            </template>
            <template v-else>
              <button disabled>{{ timeCounter / 1000 }}</button>
            </template>
          </div>
        </div>
        <div class="field">
          <CustomInput
            class="name"
            :class="{ error: !form.name.checked }"
            :ref="(el) => (form.name.element = el)"
            :validate="form.name.validate"
            v-model:value="form.name.value"
            :placeholder="'Alexei Ward'"
          >
            <template v-slot:title> Name* </template>
            <template v-slot:error-message> {{ form.name.erroMessage }} </template>
          </CustomInput>
          <CustomInput
            class="password"
            :class="{ error: !form.password.checked }"
            :ref="(el) => (form.password.element = el)"
            :validate="form.password.validate"
            v-model:value="form.password.value"
            :placeholder="''"
            :type="'password'"
          >
            <template v-slot:title> Password* </template>
            <template v-slot:error-message> {{ form.password.erroMessage }} </template>
          </CustomInput>
          <CustomInput
            class="confirmedPassword"
            :class="{ error: !form.confirmedPassword.checked }"
            :ref="(el) => (form.confirmedPassword.element = el)"
            :validate="form.confirmedPassword.validate"
            v-model:value="form.confirmedPassword.value"
            :placeholder="''"
          >
            <template v-slot:title> ConfirmedPassword* </template>
            <template v-slot:error-message> {{ form.confirmedPassword.erroMessage }} </template>
          </CustomInput>
          <CustomInput
            class="email"
            :class="{ error: !form.email.checked }"
            :ref="(el) => (form.email.element = el)"
            :validate="form.email.validate"
            v-model:value="form.email.value"
            :placeholder="''"
          >
            <template v-slot:title> Email* </template>
            <template v-slot:error-message> {{ form.email.erroMessage }} </template>
          </CustomInput>
          <CustomInput
            class="birth"
            :class="{ error: !form.birth.checked }"
            :ref="(el) => (form.birth.element = el)"
            :validate="form.birth.validate"
            v-model:value="form.birth.value"
            :placeholder="''"
          >
            <template v-slot:title>
              <span>Birth*</span>
              <div><span>(YYYY-MM-DD)</span></div>
            </template>
            <template v-slot:error-message> {{ form.birth.erroMessage }} </template>
          </CustomInput>
          <div class="gender-container">
            <span>性別*</span>
            <select v-model="form.gender.value">
              <option disabled selected value="null">Please Choose</option>
              <option value="0">男</option>
              <option value="1">女</option>
              <option value="2">非二元</option>
            </select>
          </div>
        </div>
        <button @click="submitAsync">註冊</button>
      </div>
    </div>
  </main>

  <FooterComponent></FooterComponent>
</template>

<style scoped>
.register-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.register-container-title {
  cursor: pointer;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.phone-container {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.gender-container {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.captcha-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
