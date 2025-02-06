<script setup>
import AddToCartButton from '@/components/Button/AddToCartButton.vue'
import { useCartStore } from '@/stores/cart'
import { ref } from 'vue'

defineProps({ product: Object })

const count = ref(1)
const cartStore = useCartStore()

const add = () => {
  count.value++
}

const minus = () => {
  count.value--
  if (count.value === 0) count.value = 1
}
</script>

<template>
  <div class="quantity-container">
    <div class="quantity-selector">
      <button class="black opacity-25" @click="minus">-</button>
      <span>{{ count }}</span>
      <button class="black opacity-25" @click="add">+</button>
    </div>
    <slot>
      <AddToCartButton @click="() => cartStore.addToCart(product, count)"></AddToCartButton>
    </slot>
  </div>
</template>

<style scoped>
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
  height: 48px;
  padding-left: 16px;
  padding-right: 16px;
  width: 130px;
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
  margin: 0 10px;
}
</style>
