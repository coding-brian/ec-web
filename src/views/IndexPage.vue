<script setup>
import { getProductsAsync, getProductCategoriesAsync } from '@/api/ecapi'
import { computed, onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user'
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
    let objectProperty = 'isDesktopSize'
    switch (getDeviceType()) {
      case deviceType.mobile:
        objectProperty = 'isMobileSize'
        break
      case deviceType.tablet:
        objectProperty = 'isTabletSize'
        break
      case deviceType.desktop:
        objectProperty = 'isDesktopSize'
        break
    }

    const { url } = productInBanner.value.images.filter(
      (item) => item.isBanner && item[objectProperty],
    )[0]
    setDivSizeToImage(url)
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
  <main>
    <div class="product-category-group">
      <div class="product-category">
        <img src="https://i.imgur.com/puiG6CP.png" alt="" srcset="" />
        <div class="product-categoey-content">
          <span class="product-categoey-name">HEADPHONES</span>
          <div class="product-categoey-shop">
            <span>SHOP</span>
            <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
          </div>
        </div>
      </div>
      <div class="product-category">
        <img src="https://i.imgur.com/puiG6CP.png" alt="" srcset="" />
        <div class="product-categoey-content">
          <span class="product-categoey-name">HEADPHONES</span>
          <div class="product-categoey-shop">
            <span>SHOP</span>
            <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
          </div>
        </div>
      </div>
      <div class="product-category">
        <img src="https://i.imgur.com/puiG6CP.png" alt="" srcset="" />
        <div class="product-categoey-content">
          <span class="product-categoey-name">HEADPHONES</span>
          <div class="product-categoey-shop">
            <span>SHOP</span>
            <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
          </div>
        </div>
      </div>
    </div>
    <div class="product-group">
      <div class="prorduct">product-4</div>
      <div class="prorduct">product-5</div>
      <div class="prorduct">product-6</div>
    </div>
    <div class="news">
      <div class="news-content">news-1</div>
      <img src="" alt="" />
    </div>
  </main>
  <footer></footer>
</template>
