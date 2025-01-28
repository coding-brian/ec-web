<script setup>
import { onMounted, ref, watch } from 'vue'
import { useDeviceType } from '@/composables/deviceType'
import deviceType from '@/const/deviceType.json'
import { useDeviceSize } from '@/composables/deviceSize'
import { storeToRefs } from 'pinia'
import { useProductCategory } from '@/stores/productCategory'
import { getProductCategoriesAsync } from '@/api/ecapi'

const { product } = defineProps({ product: Object })
const { getDeviceType } = useDeviceType()
const { objectProperty } = useDeviceSize()
const { productCategories } = storeToRefs(useProductCategory())

const isNavbarShow = ref(false)

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

onMounted(async () => {
  productCategories.value = await getProductCategoriesAsync()

  if (getDeviceType() === deviceType.desktop) isNavbarShow.value = true
})

watch(
  () => product,
  () => {
    setDivSizeToImage(product.images.filter((item) => item.isBanner && item[objectProperty])[0].url)
  },
)
</script>

<template>
  <div class="banner">
    <header>
      <div class="header-container">
        <div class="logo-container">
          <div
            class="hamburger"
            v-if="getDeviceType() !== deviceType.desktop"
            @click="() => (isNavbarShow = !isNavbarShow)"
          ></div>
          <img class="logo" src="/images/logo.svg" alt="" />
        </div>
        <div class="navbar" v-if="isNavbarShow">
          <template v-if="getDeviceType() === deviceType.desktop">
            <span class="sub-title-manrope-bold white">HOME</span>
            <span
              class="sub-title-manrope-bold white"
              v-for="productCategory in productCategories"
              :key="productCategory.id"
              >{{ productCategory.name }}</span
            >
          </template>
          <template v-else>
            <div>
              <div class="product-category-group" v-if="productCategories">
                <div
                  class="product-category"
                  v-for="productCategory in productCategories"
                  :key="productCategory.id"
                >
                  <img
                    :src="productCategory.image.url"
                    alt=""
                    srcset=""
                    v-if="productCategory.image"
                  />
                  <div class="product-categoey-content">
                    <span class="product-categoey-name white">{{ productCategory.name }}</span>
                    <div class="product-categoey-shop">
                      <span>SHOP</span>
                      <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <img src="/images/icon-cart.svg" alt="" class="cart" />
      </div>
      <div class="content-container" v-if="product">
        <div class="content">
          <span class="new-product-text" v-if="product.isNewProduct">NEW PRODUCT</span>
          <span class="h1-manrope-bold white">{{ product.name }}</span>
          <span class="content-description">{{ product.description }}</span>
        </div>
        <button class="button-1-default">SEE PRODUCT</button>
      </div>
    </header>
  </div>
</template>
