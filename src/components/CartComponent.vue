<script setup>
import { useCartStore } from '@/stores/cart'
import { computed } from 'vue'
import MaskComponent from './MaskComponent.vue'

const props = defineProps({ isShow: { type: Boolean, default: false } })
const emit = defineEmits(['update:isShow'])

const store = useCartStore()
const total = computed(() => {
  let result = 0
  store.cart.products.forEach((product) => {
    result += product.price.salePrice * product.count
  })

  return result
})

const add = (product) => product.count++

const minus = (product) => {
  product.count--
  if (product.count === 0) {
    store.removeProduct(product)
  }
}

const removeAll = () => {
  store.removeAllProduct()
}

const close = () => {
  emit('update:isShow', false)
}
</script>

<template>
  <MaskComponent @click.stop="close" v-if="props.isShow">
    <div class="cart-conatiner">
      <div class="cart" @click.stop>
        <div>
          <span class="h6-manrope-bold">CART ({{ store.cart.products.length }})</span>
          <span class="opacity-50 body-manrope-medium" @click="removeAll">Remove all</span>
        </div>
        <ul>
          <template v-if="store.cart.products && store.cart.products.length > 0">
            <li v-for="product in store.cart.products" :key="product.id">
              <div>
                <img :src="product.images[0].url" alt="" />
                <div>
                  <div>
                    <span class="body-manrope-medium">{{ product.name }}</span>
                  </div>
                  <div>
                    <span class="opacity-50 overline-manrope-regula"
                      >${{ product.price.salePrice }}</span
                    >
                  </div>
                </div>
              </div>
              <div class="quantity-container">
                <div class="quantity-selector">
                  <button class="black opacity-25" @click="minus(product)">-</button>
                  <span>{{ product.count }}</span>
                  <button class="black opacity-25" @click="add(product)">+</button>
                </div>
              </div>
            </li>
          </template>
        </ul>
        <div>
          <span class="body-manrope-medium opacity-50">TOTAL</span>
          <span class="h6-manrope-bold">${{ total }}</span>
        </div>
        <button class="button-1-default">CHECKOUT</button>
      </div>
    </div>
  </MaskComponent>
</template>

<style scoped>
.mask {
  display: flex;
  justify-content: center;
  padding-top: 32px;
}

button {
  width: 100%;
}
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none; /* 移除項目符號 */
}

ul {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

li {
  display: flex;
  justify-content: space-between;
}

li > div:first-child {
  display: flex;
  align-items: center;
  gap: 16px;
}

li img {
  max-width: 64px;
  max-height: 64px;
  border-radius: 8px;
}

.cart-conatiner {
  width: 1110px;
  display: flex;
  flex-direction: column;
  align-items: end;
}

.cart {
  display: flex;
  flex-direction: column;
  background-color: white;
  gap: 32px;
  padding: 30px;
  border-radius: 8px;
  max-width: 377px;
}

.cart > div {
  display: flex;
  justify-content: space-between;
}

.cart > div:first-child span:nth-child(2) {
  border-bottom: 1px rgb(0, 0, 0, 0.5) solid;
}

.cart > div:first-child span:nth-child(2):hover {
  color: var(--peru);
  border-bottom: 1px var(--peru) solid;
  cursor: pointer;
}

.quantity-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--anti-flash-white);
  height: 32px;
  padding-left: 10px;
  padding-right: 10px;
  width: 96px;
}

.quantity-selector button {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  width: 20px;
}

.quantity-selector span {
  font-size: 16px;
  font-weight: bold;
}

.quantity-selector button:hover {
  color: var(--peru);
  opacity: 100%;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  .cart-conatiner {
    width: 689px;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .cart-conatiner {
    width: 327px;
    display: flex;
    align-items: center;
  }

  .cart {
    width: 100%;
  }

  li > div:first-child > div {
    word-wrap: break-word;
    max-width: 76px;
  }
}
</style>
