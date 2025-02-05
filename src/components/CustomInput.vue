<script setup>
defineProps({ placeholder: String })
</script>

<template>
  <div class="input-container">
    <div class="title-container">
      <span class="title"><slot name="title">title</slot></span>
      <span class="error-message"><slot name="error-message">erro-message</slot></span>
    </div>
    <input class="" type="text" name="" id="" :placeholder="placeholder" />
  </div>
</template>

<style scoped>
.input-container {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.title-container {
  display: flex;
  justify-content: space-between;
}

.title-container .title {
  font-size: 12px;
  letter-spacing: -0.12px;
  font-weight: bold;
}

.error-message {
  display: none;
}

input {
  width: 100%;
  border: 2px #cfcfcf solid;
  border-radius: 8px;
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 24px;
  caret-color: var(--peru);
  font-size: 14px;
  font-weight: bold;
  letter-spacing: -0.25px;
}

input:hover {
  cursor: pointer;
}

input:focus {
  outline: none;
  border: 2px var(--peru) solid;
}

input::placeholder {
  opacity: 40%;
  color: black;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: -0.25px;
}

.input-container.error .title-container {
  color: var(--rersian-red);
}

.input-container.error input {
  border: 2px var(--rersian-red) solid;
}

.input-container.error .error-message {
  display: block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.21px;
}
</style>
