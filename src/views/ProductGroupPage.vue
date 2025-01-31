<script setup>
import { storeToRefs } from 'pinia'
import { useProduct } from '@/stores/product'
import { computed } from 'vue'
import { useDeviceSize } from '@/composables/deviceSize'
import ProductButton from '@/components/ProductButton.vue'

const { products } = storeToRefs(useProduct())
const { objectProperty } = useDeviceSize()

const productInHomepage = computed(() => {
  if (!products.value || products.value.length === 0) return null

  const result = products.value
    .filter((product) => product.isInHomepage && product.isInMainSection)
    .sort((a, b) => a.priority - b.priority)

  return result
})
</script>

<template>
  <div class="product-group" v-if="productInHomepage">
    <div class="product">
      <div>
        <img
          :src="productInHomepage[0].images.filter((item) => item[objectProperty])[0].url"
          alt=""
          srcset=""
        />
        <div class="product-content">
          <span class="product-content-name h1-manrope-bold white">{{
            productInHomepage[0].name
          }}</span>
          <span class="product-content-description body-manrope-medium white">{{
            productInHomepage[0].description
          }}</span>
          <ProductButton class="button-2-default" :id="productInHomepage[0].id"></ProductButton>
        </div>
      </div>
    </div>
    <div class="product">
      <img
        :src="productInHomepage[1].images.filter((item) => item[objectProperty])[0].url"
        alt=""
        srcset=""
      />
      <div class="product-content">
        <span>{{ productInHomepage[1].name }}</span>
        <ProductButton class="button-2-default" :id="productInHomepage[1].id"></ProductButton>
      </div>
    </div>
    <div class="product">
      <img
        :src="productInHomepage[2].images.filter((item) => item[objectProperty])[0].url"
        alt=""
        srcset=""
      />
      <div class="product-content">
        <span>{{ productInHomepage[2].name }}</span>
        <ProductButton class="button-2-default" :id="productInHomepage[2].id"></ProductButton>
      </div>
    </div>
  </div>
</template>

<style scoped></style>

<style>
main {
  grid-template-areas:
    'product-category-group'
    'main-content'
    'news';
}
</style>
