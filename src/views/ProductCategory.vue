<script setup>
import NavbarComponent from '@/components/NavbarComponent.vue'
import { useRoute } from 'vue-router'
import { getProductCategoryAsync } from '@/api/ecapi'
import { onMounted, ref } from 'vue'
import NewProductComponet from '@/components/NewProductComponet.vue'
import { useDeviceSize } from '@/composables/deviceSize'

const route = useRoute()
const productCategory = ref(null)
const { objectProperty } = useDeviceSize()

onMounted(async () => {
  productCategory.value = await getProductCategoryAsync(route.params.id)
})
</script>

<template>
  <NavbarComponent />
  <ul v-if="productCategory">
    <li v-for="product in productCategory.products" :key="product.id">
      <img
        :src="product.images.filter((item) => !item.isBanner && item[objectProperty])[0].url"
        alt=""
      />
      <div class="product-content">
        <NewProductComponet class="peru" v-if="product.isNewProduct" />
        <span class="h2-manrope-bold black">{{ product.name }}</span>
        <span class="body-manrope-medium black">{{ product.description }}</span>
        <button class="button-1-default">SEE PPRODUCT</button>
      </div>
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
}

li {
  display: flex;
  align-items: center;
  gap: 125px;
}

li:nth-child(2) {
  flex-direction: row-reverse;
}

li img {
  width: 540px;
  height: 560px;
}

.product-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
