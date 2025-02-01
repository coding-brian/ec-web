<script setup>
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { getProductCategoryAsync } from '@/api/ecapi'
import { onMounted, watch } from 'vue'
import { useDeviceSize } from '@/composables/deviceSize'
import { storeToRefs } from 'pinia'
import { useProductCategory } from '@/stores/productCategory'
import ProductContent from '@/components/ProductContent.vue'

const route = useRoute()
const { objectProperty } = useDeviceSize()
const { productCategory } = storeToRefs(useProductCategory())

onBeforeRouteLeave(() => {
  productCategory.value = null
})

onMounted(async () => {
  productCategory.value = await getProductCategoryAsync(route.params.id)
})

watch(
  () => route.params.id,
  async (newId) => {
    productCategory.value = await getProductCategoryAsync(newId)
  },
)
</script>

<template>
  <ul v-if="productCategory">
    <li v-for="product in productCategory.products" :key="product.id">
      <img
        :src="product.images.filter((item) => !item.isBanner && item[objectProperty])[0].url"
        alt=""
      />
      <ProductContent :product="product" />
    </li>
  </ul>
</template>

<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none; /* 移除項目符號 */
}

ul {
  display: flex;
  flex-direction: column;
  gap: 160px;
  max-width: 1110px;
  padding-bottom: 160px;
}

li {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 125px;
  align-items: center;
}

li:nth-child(2) {
  grid-template-areas: 'content img';
}

li:nth-child(2) img {
  grid-area: img;
}

li:nth-child(2) .product-content {
  grid-area: content;
}

li img {
  max-width: 100%;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  ul {
    max-width: 689px;
    padding-bottom: 120px;
    gap: 120px;
    text-align: center;
  }

  li {
    display: grid;
    grid-template-columns: 1fr;
    gap: 52px;
  }

  li:nth-child(2) {
    grid-template-areas:
      'img'
      'content';
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  ul {
    max-width: 327px;
    padding-bottom: 64px;
    gap: 120px;
    text-align: center;
  }
}
</style>

<style>
main {
  grid-template-areas:
    'main-content'
    'product-category-group'
    'news';
}
</style>
