<script setup>
import { useRouter } from 'vue-router'

defineProps({ id: String })

const router = useRouter()
</script>

<template>
  <button @click="router.push({ name: 'product', params: { id } })">
    <slot>SEE PRODUCT</slot>
  </button>
</template>
