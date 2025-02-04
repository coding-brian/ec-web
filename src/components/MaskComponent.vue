<template>
  <div class="mask">
    <slot></slot>
  </div>
</template>

<style scoped>
.mask {
  display: block;
  position: absolute;
  top: 94px;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 100%;
  z-index: 2;
}
</style>
