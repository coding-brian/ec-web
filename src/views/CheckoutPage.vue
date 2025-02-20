<script setup>
import CustomInput from '@/components/CustomInput.vue'
import NavBar from '@/components/NavBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import RadioComponent from '@/components/RadioComponent.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useShopStore } from '@/stores/shop'
import { isNull, isEmpty, debounce } from 'lodash-es'
import { getPaymentMethodsAsync, craeteOrderAsync } from '@/api/ecapi'
import PaymentMethodType from '@/const/paymentMethodType.json'
import GoBack from '@/components/Text/GoBack.vue'
import { useEmail } from '@/composables/email'
import PopupComponent from '@/components/PopupComponent.vue'

const store = useCartStore()
const shopStore = useShopStore()
const { checkEmail } = useEmail()

const paymentMethods = ref(null)
const orderId = ref(null)
const total = computed(() =>
  store.cart.products.reduce((sum, item) => sum + item.price.salePrice * item.quantity, 0),
)

const grandTotal = computed(() => {
  if (shopStore.shop) {
    return total.value + shopStore.shop.shippingFee
  }

  return total.value
})

const validate = (item) => {
  if (isNull(item.value) || isEmpty(item.value)) {
    return false
  }
  return true
}

const form = reactive({
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
  address: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.address.checked = validate(form.address)
      return form.address.checked
    },
  },
  zipCode: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.zipCode.checked = validate(form.zipCode)
      return form.zipCode.checked
    },
  },
  city: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
  },
  country: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
  },
  selectedPayment: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      form.selectedPayment.checked = validate(form.selectedPayment)
      return form.selectedPayment.checked
    },
  },
  eMoneyNumber: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      if (form.selectedPayment.value.type === PaymentMethodType.creditCard) {
        form.eMoneyNumber.checked = validate(form.eMoneyNumber)
        return form.eMoneyNumber.checked
      }

      form.eMoneyNumber.checked = true
      return form.eMoneyNumber.checked
    },
  },
  eMoneyPin: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
    validate: () => {
      if (form.selectedPayment.value.type === PaymentMethodType.creditCard) {
        form.eMoneyPin.checked = validate(form.eMoneyPin)
        return form.eMoneyPin.checked
      }

      form.eMoneyPin.checked = true
      return form.eMoneyPin.checked
    },
  },
})

const check = () => {
  const result = []
  for (const item of Object.entries(form)) {
    if (item[1].validate) item[1].validate()
    result.push(item[1].checked)
  }

  return result.every((item) => item)
}

const createOrder = debounce(async () => {
  try {
    if (!check()) return false

    const details = []

    for (let product of store.cart.products) {
      details.push({
        productId: product.id,
        skuId: product.skuId,
        quantity: product.quantity,
        salePrice: product.price.salePrice,
      })
    }

    const body = {
      shippingFee: shopStore.shop.shippingFee,
      total: total.value,
      vat: vat.value,
      grandTotal: grandTotal.value,
      paymentMethodId: form.selectedPayment.value.id,
      paymentMethodType: form.selectedPayment.value.type,
      shipment: {
        address: form.address.value,
        zipCode: form.zipCode.value,
        city: form.city.value,
        country: form.country.value,
      },
      creditCart: {
        number: form.eMoneyNumber.value,
        pin: form.eMoneyPin.value,
      },
      details,
    }

    const { id } = await craeteOrderAsync(body)
    orderId.value = id
  } catch (e) {
    console.log(e)
  }
}, 500)

const vat = computed(() => {
  if (shopStore.shop) {
    return total.value - Math.floor(total.value / (1 + shopStore.shop.taxRate / 100))
  }

  return total.value - total.value
})

onMounted(async () => {
  document.body.style.backgroundColor = 'var(--anti-flash-white)'
  paymentMethods.value = await getPaymentMethodsAsync()
  form.selectedPayment.value = paymentMethods.value[0]
})
</script>

<template>
  <NavBar></NavBar>
  <main>
    <GoBack></GoBack>
    <div class="checkout-conatiner">
      <div class="checkout">
        <span class="h3-manrope-bold">CHECKOUT</span>
        <div class="form">
          <div class="field">
            <span class="sub-title-manrope-bold peru">Billing Details</span>
            <div class="billing-detail">
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
                class="email-address"
                :placeholder="'alexei@mail.com'"
                :class="{ error: !form.email.checked }"
                :ref="(el) => (form.email.element = el)"
                :validate="form.email.validate"
                @blur="blur(form.email)"
                v-model:value="form.email.value"
              >
                <template v-slot:title> Email Address* </template>
                <template v-slot:error-message> {{ form.email.erroMessage }} </template>
              </CustomInput>
              <CustomInput
                class="phone-number"
                :placeholder="'+1 202-555-0136'"
                :class="{ error: !form.phone.checked }"
                :ref="(el) => (form.phone.element = el)"
                @blur="blur(form.phone)"
                v-model:value="form.phone.value"
                :validate="form.phone.validate"
              >
                <template v-slot:title> Phone Number* </template>
                <template v-slot:error-message> {{ form.phone.erroMessage }} </template>
              </CustomInput>
            </div>
          </div>
          <div class="field">
            <span class="sub-title-manrope-bold peru">SHIPPING-INFO</span>
            <div class="shipping-info">
              <CustomInput
                class="address"
                :placeholder="'1137 Williams Avenue'"
                :class="{ error: !form.address.checked }"
                :ref="(el) => (form.address.element = el)"
                @blur="blur(form.address)"
                v-model:value="form.address.value"
                :validate="form.address.validate"
              >
                <template v-slot:title> Address* </template>
                <template v-slot:error-message> {{ form.address.erroMessage }} </template>
              </CustomInput>
              <CustomInput
                class="zip-code"
                :placeholder="'10001'"
                :class="{ error: !form.zipCode.checked }"
                :ref="(el) => (form.zipCode.element = el)"
                @blur="blur(form.zipCode)"
                v-model:value="form.zipCode.value"
                :validate="form.zipCode.validate"
              >
                <template v-slot:title> ZIP Code* </template>
                <template v-slot:error-message> {{ form.zipCode.erroMessage }} </template>
              </CustomInput>
              <CustomInput class="city" :placeholder="'New York'" v-model:value="form.city.value">
                <template v-slot:title> City </template>
              </CustomInput>
              <CustomInput
                class="country"
                :placeholder="'United States'"
                v-model:value="form.country.value"
              >
                <template v-slot:title> Countrty </template>
              </CustomInput>
            </div>
          </div>
          <div class="field">
            <span class="sub-title-manrope-bold peru">PAYMENT DETAILS</span>
            <div class="payment-method" v-if="paymentMethods && paymentMethods.length > 0">
              <span class="payment-method-title">Payment Method*</span>
              <RadioComponent
                v-for="paymentMethod in paymentMethods"
                :key="paymentMethod.id"
                :radioTitle="paymentMethod.name"
                :radioValue="paymentMethod"
                v-model:checked="form.selectedPayment.value"
              >
              </RadioComponent>
            </div>
            <div
              class="payment-method-info"
              v-if="
                form.selectedPayment.value &&
                form.selectedPayment.value.type === PaymentMethodType.creditCard
              "
            >
              <CustomInput
                class="e-money-number"
                :placeholder="'238521993'"
                :class="{ error: !form.eMoneyNumber.checked }"
                :ref="(el) => (form.eMoneyNumber.element = el)"
                @blur="blur(form.eMoneyNumber)"
                v-model:value="form.eMoneyNumber.value"
                :validate="form.eMoneyNumber.validate"
              >
                <template v-slot:title> e-Money Number* </template>
                <template v-slot:error-message> {{ form.eMoneyNumber.erroMessage }} </template>
              </CustomInput>
              <CustomInput
                class="e-money-pin"
                :placeholder="'6891'"
                :class="{ error: !form.eMoneyPin.checked }"
                :ref="(el) => (form.eMoneyPin.element = el)"
                @blur="blur(form.eMoneyPin)"
                v-model:value="form.eMoneyPin.value"
                :validate="form.eMoneyPin.validate"
              >
                <template v-slot:title> e-Money PIN* </template>
                <template v-slot:error-message> {{ form.eMoneyPin.erroMessage }} </template>
              </CustomInput>
            </div>
          </div>
        </div>
      </div>
      <div class="summary">
        <span>SUMMARY</span>
        <div>
          <div class="item" v-for="product in store.cart.products" :key="product.id">
            <div class="item-container">
              <img :src="product.images[0].url" alt="" />
              <div class="item-detail">
                <span class="body-manrope-medium">{{ product.shortName }}</span>
                <span class="opacity-50 overline-manrope-regula">
                  ${{ product.price.salePrice }}</span
                >
              </div>
            </div>
            <span class="amount opacity-50">x{{ product.quantity }}</span>
          </div>
        </div>
        <div class="summary-container">
          <div class="summary-info">
            <span class="body-manrope-medium opacity-50">TOTAL</span>
            <span>${{ total }}</span>
          </div>
          <div class="summary-info" v-if="shopStore.shop">
            <span class="body-manrope-medium opacity-50">SHIPPING</span>
            <span>${{ shopStore.shop.shippingFee }}</span>
          </div>
          <div class="summary-info">
            <span class="body-manrope-medium opacity-50">VAT(INCLUDED)</span>
            <span>${{ vat }}</span>
          </div>
          <div class="summary-info">
            <span class="body-manrope-medium opacity-50">GRAND TOTAL</span>
            <span class="peru">${{ grandTotal }}</span>
          </div>
        </div>
        <button class="button-1-default" @click="createOrder">CONTINUE & PAY</button>
      </div>
    </div>
  </main>

  <FooterComponent></FooterComponent>
  <PopupComponent :order-id="orderId" v-if="orderId"></PopupComponent>
</template>

<style scoped>
main > span {
  margin-bottom: 24px;
  justify-self: start;
  cursor: pointer;
}

main > span:hover {
  color: var(--peru);
  opacity: 100%;
}

.checkout-conatiner {
  width: 1110px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

.checkout {
  border-radius: 8px;
  padding-top: 54px;
  padding-left: 48px;
  padding-right: 48px;
  padding-bottom: 48px;
  background-color: white;
}

.checkout .form {
  display: flex;
  flex-direction: column;
  gap: 53px;
}

.checkout > span {
  display: block;
  margin-bottom: 41px;
}

.field > span {
  display: block;
  margin-bottom: 16px;
}

.billing-detail {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  column-gap: 16px;
  row-gap: 24px;
}

.shipping-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  column-gap: 16px;
  row-gap: 24px;
}
.address {
  grid-column: span 2;
}

.payment-method {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  row-gap: 16px;
}

.payment-method-title {
  font-size: 12px;
  letter-spacing: -0.12px;
  font-weight: bold;
  grid-row: span 2;
}

.payment-method-info {
  margin-top: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 16px;
}

.summary {
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 30px;
  align-self: start;
}

.summary > span {
  font-size: 18px;
  letter-spacing: 1.29px;
  font-weight: bold;
}

.summary button {
  width: 100%;
}

.item {
  display: flex;
  justify-content: space-between;
}

.item img {
  max-width: 64px;
  max-height: 64px;
}

.item-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-detail {
  display: flex;
  flex-direction: column;
  word-wrap: break-word;
}

.summary-container {
  display: grid;
  row-gap: 8px;
}

.summary-container .summary-info:last-child {
  margin-top: 16px;
}

.summary-info {
  display: flex;
  justify-content: space-between;
}

.summary-info span:nth-child(2) {
  font-size: 18px;
  font-weight: bold;
}

.amount {
  font-size: 15px;
  line-height: 25px;
  font-weight: bold;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  .checkout-conatiner {
    width: 669px;
    gap: 24px;
    grid-template-columns: auto;
  }

  .checkout-info {
    display: grid;
    grid-template-columns: auto;
    gap: 32px;
  }

  .summary {
    height: auto;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .checkout-conatiner {
    width: 327px;
    gap: 24px;
  }

  .billing-detail,
  .shipping-info {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    row-gap: 24px;
  }

  .address {
    grid-column: span 1;
  }

  .payment-method {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto;
    row-gap: 16px;
  }

  .payment-method-info {
    margin-top: 32px;
    display: grid;
    grid-template-columns: auto;
    column-gap: 0;
    row-gap: 24px;
  }
}
</style>
