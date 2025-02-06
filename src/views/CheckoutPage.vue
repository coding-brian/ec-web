<script setup>
import CustomInput from '@/components/CustomInput.vue'
import NavBar from '@/components/NavBar.vue'
import FooterComponent from '@/components/FooterComponent.vue'
import RadioComponent from '@/components/RadioComponent.vue'
import { computed, onMounted, reactive, ref } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'

const selectedPayment = ref(0)
const store = useCartStore()

const router = useRouter()

const shopStore = useShopStore()

const total = computed(() =>
  store.cart.products.reduce((sum, item) => sum + item.price.salePrice * item.count, 0),
)

const grandTotal = computed(() => total.value + shopStore.shop.shippingFee)

const form = reactive({
  name: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
  },
  email: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
  },
  phone: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
  },
  address: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
  },
  zipCode: {
    value: null,
    element: null,
    checked: true,
    erroMessage: 'Incorrect Format',
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
})

const vat = computed(
  () => total.value - Math.floor(total.value / (1 + shopStore.shop.taxRate / 100)),
)

const blur = (item) => {
  item.checked = item.element.validate()
}

onMounted(() => {
  document.body.style.backgroundColor = 'var(--anti-flash-white)'
})
</script>

<template>
  <NavBar></NavBar>
  <main>
    <span class="body-manrope-medium opacity-50" @click="router.back()">Go Back</span>
    <div class="checkout-conatiner">
      <div class="checkout">
        <span class="h3-manrope-bold">CHECKOUT</span>
        <div class="form">
          <div class="form-container">
            <span class="sub-title-manrope-bold peru">Billing Details</span>
            <div class="billing-detail">
              <CustomInput
                class="name"
                :class="{ error: !form.name.checked }"
                :ref="(el) => (form.name.element = el)"
                @blur="blur(form.name)"
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
              >
                <template v-slot:title> Phone Number* </template>
                <template v-slot:error-message> {{ form.phone.erroMessage }} </template>
              </CustomInput>
            </div>
          </div>
          <div class="form-container">
            <span class="sub-title-manrope-bold peru">SHIPPING-INFO</span>
            <div class="shipping-info">
              <CustomInput
                class="address"
                :placeholder="'1137 Williams Avenue'"
                :class="{ error: !form.address.checked }"
                :ref="(el) => (form.address.element = el)"
                @blur="blur(form.address)"
                v-model:value="form.address.value"
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
          <div class="form-container">
            <span class="sub-title-manrope-bold peru">PAYMENT DETAILS</span>
            <div class="payment-method">
              <span class="payment-method-title">Payment Method*</span>
              <RadioComponent
                :radioTitle="'e-Money'"
                :radioValue="0"
                v-model:checked="selectedPayment"
              ></RadioComponent>
              <RadioComponent
                :radioTitle="'Cash on Delivery'"
                :radioValue="1"
                v-model:checked="selectedPayment"
              ></RadioComponent>
            </div>
            <div class="payment-method-info">
              <CustomInput class="e-money-number" :placeholder="'238521993'">
                <template v-slot:title> e-Money Number* </template>
                <template v-slot:error-message> Wrong Format </template>
              </CustomInput>
              <CustomInput class="e-money-pin" :placeholder="'6891'">
                <template v-slot:title> e-Money PIN* </template>
                <template v-slot:error-message> Wrong Format </template>
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
            <span class="amount opacity-50">x{{ product.count }}</span>
          </div>
        </div>
        <div class="summary-container">
          <div class="summary-info">
            <span class="body-manrope-medium opacity-50">TOTAL</span>
            <span>${{ total }}</span>
          </div>
          <div class="summary-info">
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
        <button class="button-1-default">CONTINUE & PAY</button>
      </div>
    </div>
  </main>
  <FooterComponent></FooterComponent>
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

.form-container > span {
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
