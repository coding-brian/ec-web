<script setup>
import { getProductsAsync, getProductCategoriesAsync } from '@/api/ecapi'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
// import { Autoplay, Navigation, Pagination } from 'swiper/modules'
// import { RouterLink } from 'vue-router'

const products = ref()
const productCategories = ref()
const userStore = useUserStore()

const productInBanner = computed(() => {
  if (!products.value || products.value.length === 0) return null

  return products.value.filter((product) => product.isInBanner)[0]
})

const deviceType = {
  mobile: 0,
  tablet: 1,
  desktop: 2,
}

const getDeviceType = () => {
  const width = window.innerWidth

  if (width <= 767) {
    return deviceType.mobile // 手機尺寸
  } else if (width >= 768 && width <= 1024) {
    return deviceType.tablet // 平板尺寸
  } else {
    return deviceType.desktop // 桌機尺寸
  }
}

const setDivSizeToImage = (imageUrl) => {
  const div = document.getElementsByClassName('banner')

  const img = new Image()

  img.onload = function () {
    const { width, height } = img

    const element = div[0]

    element.style.backgroundImage = `url('${imageUrl}')`
    element.style.width = `${width}px`
    element.style.height = `${height}px`
  }

  // 加載圖片
  img.src = imageUrl
}

onMounted(async () => {
  products.value = await getProductsAsync({
    isInBanner: true,
    isNewProduct: true,
    isInHomepage: true,
    operator: 0,
  })

  if (productInBanner.value) {
    setDivSizeToImage(productInBanner.value.images.filter((item) => item.isBanner)[0].url)
  }

  productCategories.value = await getProductCategoriesAsync()
})
</script>

<template>
  <div class="banner">
    <div class="header-container">
      <div class="header">
        <img src="/images/logo.svg" alt="" class="logo" />
        <div class="navbar white h4-manrope-bold">
          <span>HOME</span>
          <span>HEADPHONES</span>
          <span>SPEAKS</span>
          <span>EARPHONES</span>
        </div>
        <img src="/images/icon-cart.svg" alt="" class="cart" />
      </div>
      <div class="content-container" v-if="productInBanner">
        <div class="content">
          <span class="new-product-text" v-if="productInBanner.isNewProduct">NEW PRODUCT</span>
          <span class="h1-manrope-bold white">{{ productInBanner.name }}</span>
          <span class="content-description">{{ productInBanner.description }}</span>
        </div>
        <button type="button">SEE PRODUCT</button>
      </div>
    </div>
  </div>
  <main></main>
  <footer></footer>
  <!-- <RouterLink :to="'/register'">register</RouterLink><br />
  <RouterLink :to="'/login'">login</RouterLink>
  <button @click="logout">logout</button> -->
</template>
