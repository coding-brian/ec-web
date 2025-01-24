<script setup>
import { getProductsAsync, getProductCategoriesAsync } from '@/api/ecapi'
import { computed, onMounted, ref } from 'vue'

const products = ref()
const productCategories = ref()
let objectProperty = 'isDesktopSize'

const socialMedias = ref([
  {
    url: '/images/icon-facebook.svg',
    hoverUrl: '/images/icon-facebook-peru.svg',
  },
  {
    url: '/images/icon-twitter.svg',
    hoverUrl: '/images/icon-twitter-peru.svg',
  },
  {
    url: '/images/icon-instagram.svg',
    hoverUrl: '/images/icon-instagram-peru.svg',
  },
])

const productInBanner = computed(() => {
  if (!products.value || products.value.length === 0) return null

  const result = products.value.filter((product) => product.isInBanner && product.isInHomepage)[0]

  const { url } = result.images.filter((item) => item.isBanner && item[objectProperty])[0]

  setDivSizeToImage(url)

  return result
})

const productInHomepage = computed(() => {
  if (!products.value || products.value.length === 0) return null

  const result = products.value
    .filter((product) => product.isInHomepage && product.isInMainSection)
    .sort((a, b) => a.priority - b.priority)

  return result
})

const productCategoryInHomepage = computed(() => {
  if (!productCategories.value || productCategories.value.length <= 0) return null

  const result = productCategories.value.filter((item) => item.isInHomepage)

  for (let productCategory of result) {
    if (productCategory.images && productCategory.images.length > 0) {
      productCategory.image = productCategory.images.filter(
        (item) => item.isInBanner && item[objectProperty],
      )[0]
      delete productCategory.images
    }
  }

  return result
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
    const element = div[0]
    element.style.backgroundImage = `url('${imageUrl}')`
  }

  // 加載圖片
  img.src = imageUrl
}

const mouseenter = (e, socialMedia) => {
  e.target.src = socialMedia.hoverUrl
}

const mouseleave = (e, socialMedia) => {
  e.target.src = socialMedia.url
}

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

onMounted(async () => {
  products.value = await getProductsAsync({
    isInBanner: true,
    isNewProduct: true,
    isInHomepage: true,
    operator: 0,
  })

  productCategories.value = await getProductCategoriesAsync()
})
</script>

<template>
  <div class="banner">
    <div class="header-container">
      <div class="header">
        <img src="/images/logo.svg" alt="" class="logo" />
        <div class="navbar white sub-title-manrope-bold">
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
    <div class="product-category-group" v-if="productCategoryInHomepage">
      <div
        class="product-category"
        v-for="productCategory in productCategoryInHomepage"
        :key="productCategory.id"
      >
        <img :src="productCategory.image.url" alt="" srcset="" v-if="productCategory.image" />
        <div class="product-categoey-content">
          <span class="product-categoey-name">{{ productCategory.name }}</span>
          <div class="product-categoey-shop">
            <span>SHOP</span>
            <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
          </div>
        </div>
      </div>
    </div>
    <div class="product-group" v-if="productInHomepage">
      <div class="product">
        <div>
          <img
            :src="productInHomepage[0].images.filter((item) => item[objectProperty])[0].url"
            alt=""
            srcset=""
          />
          <div class="product-content">
            <span class="product-content-name h1-manrope-bold white">{{
              productInHomepage[0].name
            }}</span>
            <span class="product-content-description body-manrope-medium white">{{
              productInHomepage[0].description
            }}</span>
            <button class="button-2-default">SEE PRODUCT</button>
          </div>
        </div>
      </div>
      <div class="product">
        <img
          :src="productInHomepage[1].images.filter((item) => item[objectProperty])[0].url"
          alt=""
          srcset=""
        />
        <div class="product-content">
          <span>{{ productInHomepage[1].name }}</span>
          <button class="button-2-default">SEE PRODUCT</button>
        </div>
      </div>
      <div class="product">
        <img
          :src="productInHomepage[2].images.filter((item) => item[objectProperty])[0].url"
          alt=""
          srcset=""
        />
        <div class="product-content">
          <span>{{ productInHomepage[2].name }}</span>
          <button class="button-2-default">SEE PRODUCT</button>
        </div>
      </div>
    </div>
    <div class="news">
      <div class="news-content">news-1</div>
      <img src="" alt="" />
    </div>
  </main>
  <footer>
    <div class="footer-content">
      <img src="/images/logo.svg" alt="" class="logo" />
      <div class="navbar-footer white sub-title-manrope-bold">
        <span>HOME</span>
        <span>HEADPHONES</span>
        <span>SPEAKS</span>
        <span>EARPHONES</span>
      </div>
      <div class="description">
        <span class="body-manrope-medium white"
          >Audiophile is an all in one stop to fulfill your audio needs. We're a small team of music
          lovers and sound specialists who are devoted to helping you get the most out of personal
          audio. Come and visit our demo facility - we’re open 7 days a week.</span
        >
      </div>
      <div class="social-media">
        <img
          v-for="socialMedia in socialMedias"
          :key="socialMedia.url"
          :src="socialMedia.url"
          alt=""
          srcset=""
          @mouseenter="mouseenter($event, socialMedia)"
          @mouseleave="mouseleave($event, socialMedia)"
        />
      </div>
      <div class="copyright">
        <span class="white body-manrope-medium">Copyright 2021. All Rights Reserved</span>
      </div>
    </div>
  </footer>
</template>
