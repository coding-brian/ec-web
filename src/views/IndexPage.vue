<script setup>
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const logout = () => userStore.userLogout()
</script>

<template>
  <RouterLink :to="'/register'">register</RouterLink><br />
  <RouterLink :to="'/login'">login</RouterLink>
  <button @click="logout">logout</button>
</template>
