<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <span class="body-manrope-medium opacity-50" @click="router.back()">Go Back</span>
</template>

<style scoped>
span {
  cursor: pointer;
  margin-bottom: 32px;
}
</style>
