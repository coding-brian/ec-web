<script setup>
import { getNewsAsync } from '@/api/ecapi'
import { computed, onMounted, ref } from 'vue'
import NavBar from '@/components/NavBar.vue'
import { useDeviceSize } from '@/composables/deviceSize'
import { useProductCategory } from '@/stores/productCategory'
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'

const router = useRouter()
const { productCategories } = storeToRefs(useProductCategory())

const news = ref()
const { objectProperty } = useDeviceSize()

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

const productCategoryInHomepage = computed(() => {
  if (!productCategories.value || productCategories.value.length <= 0) return null

  const result = JSON.parse(
    JSON.stringify(productCategories.value.filter((item) => item.isInHomepage)),
  )

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

const mouseenter = (e, socialMedia) => {
  e.target.src = socialMedia.hoverUrl
}

const mouseleave = (e, socialMedia) => {
  e.target.src = socialMedia.url
}

onMounted(async () => {
  news.value = await getNewsAsync()
  for (let item of news.value) {
    item.images = item.images.filter((image) => image[objectProperty])
  }
})
</script>

<template>
  <NavBar />
  <main>
    <div class="product-category-group" v-if="productCategoryInHomepage">
      <div
        class="product-category"
        v-for="productCategory in productCategoryInHomepage"
        :key="productCategory.id"
      >
        <img :src="productCategory.image.url" alt="" srcset="" v-if="productCategory.image" />
        <div class="product-categoey-content">
          <span class="product-categoey-name black">{{ productCategory.name }}</span>
          <div
            class="product-categoey-shop"
            @click="router.push({ name: 'productCategory', params: { id: productCategory.id } })"
          >
            <span>SHOP</span>
            <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
          </div>
        </div>
      </div>
    </div>
    <RouterView class="main-content" />
    <div class="news" v-for="item in news" :key="item.id">
      <div class="news-container">
        <div class="news-title h2-manrope-bold">{{ item.title }}</div>
        <div class="news-content sub-title-manrope-bold">{{ item.content }}</div>
      </div>
      <img :src="image.url" alt="" v-for="image in item.images" :key="image.id" />
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
