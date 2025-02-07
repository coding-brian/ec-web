<script setup>
const props = defineProps({
  radioValue: {},
  radioTitle: { type: String },
  checked: {},
})

const emit = defineEmits(['update:checked'])

const click = () => {
  emit('update:checked', props.radioValue)
}
</script>

<template>
  <div class="radio-container" @click="click">
    <input
      type="radio"
      name="radio"
      :id="radioTitle"
      :value="props.radioValue"
      :checked="props.radioValue === props.checked"
    />
    <label :for="radioTitle" @click.stop>{{ radioTitle }}</label>
  </div>
</template>

<style scoped>
label {
  font-size: 14px;
  font-weight: bold;
  letter-spacing: -0.25px;
  cursor: pointer;
}

.radio-container {
  display: flex;
  gap: 16px;
  border: 1px var(--american-silver) solid;
  border-radius: 8px;
  padding-top: 16px;
  padding-bottom: 16px;
  padding-left: 16px;
  cursor: pointer;
}

.radio-container:has(input:checked) {
  border: 1px var(--peru) solid;
}

input {
  appearance: none;
  border: 1px var(--american-silver) solid;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

input:checked {
  outline: none;
}

input:checked::before {
  content: '';
  background-color: var(--peru);
  border-radius: 100%;
  width: 10px;
  height: 10px;
}
</style>
