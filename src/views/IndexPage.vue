<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <RouterLink :to="'/register'">register</RouterLink><br />
  <RouterLink :to="'/login'">login</RouterLink>
</template>
