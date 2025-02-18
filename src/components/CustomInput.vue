<script setup>
import { ref } from 'vue'

const props = defineProps({
  placeholder: String,
  value: {},
  validate: { type: Function, default: null },
  type: { type: String, default: 'text' },
})

const emit = defineEmits(['update:value', 'blur'])

const element = ref(null)

const change = (e) => {
  element.value.classList.remove('error')
  emit('update:value', e.target.value)
}

const validate = () => {
  if (props.validate) {
    props.validate()
  }
  return true
}
</script>

<template>
  <div class="input-container" ref="element">
    <div class="title-container">
      <span class="title"><slot name="title"></slot></span>
      <span class="error-message"><slot name="error-message">erro-message</slot></span>
    </div>
    <input
      :type="props.type"
      :placeholder="placeholder"
      :value="props.value"
      @input="change"
      @blur="validate"
    />
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

.title {
  font-size: 12px;
  letter-spacing: -0.12px;
  font-weight: bold;
}

.error-message {
  display: none;
}

input {
  width: 100%;
  border: 1px var(--american-silver) solid;
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
  border: 1px var(--peru) solid;
}

input::placeholder {
  opacity: 40%;
}

.error .title-container {
  color: var(--rersian-red);
}

.error input {
  border: 2px var(--rersian-red) solid;
}

.error .error-message {
  display: block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.21px;
  align-self: flex-end;
}
</style>
