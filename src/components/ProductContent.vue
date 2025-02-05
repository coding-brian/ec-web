<script setup>
import ProductButton from '@/components/Button/ProductButton.vue'
import NewProductComponet from '@/components/NewProduct.vue'

defineProps({ product: Object })
</script>

<template>
  <div class="product-content">
    <NewProductComponet class="peru" v-if="product.isNewProduct" />
    <span class="h2-manrope-bold black">{{ product.name }}</span>
    <span class="body-manrope-medium black opacity-50">{{ product.description }}</span>
    <slot>
      <ProductButton class="button-1-default" :id="product.id"></ProductButton>
    </slot>
  </div>
</template>

<style scoped>
.product-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  .product-content {
    align-items: center;
  }
}
</style>
