<script setup>
import CustomInput from '@/components/CustomInput.vue'
</script>

<template>
  <div>
    <span>Go Back</span>
    <div class="checkout-conatiner">
      <div class="checkout">
        <CustomInput class="" :placeholder="'Alex'">
          <template v-slot:title> Name </template>
          <template v-slot:error-message> Wrong Format </template>
        </CustomInput>
      </div>
      <div class="summary"></div>
    </div>
  </div>
</template>

<style scoped></style>
