<script setup>
import { useProduct } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { onMounted, watch } from 'vue'
import { getProductAsync } from '@/api/ecapi'
import { useRoute, onBeforeRouteLeave } from 'vue-router'

const { product } = storeToRefs(useProduct())
const route = useRoute()

onBeforeRouteLeave(() => {
  product.value = null
})

onMounted(async () => {
  product.value = await getProductAsync(route.params.id)
})

watch(
  () => route.params.id,
  async (newId) => {
    product.value = await getProductAsync(newId)
  },
)
</script>

<template>{{ product }}</template>

<style>
main {
  grid-template-areas:
    'main-content'
    'product-category-group'
    'news';
}
</style>
