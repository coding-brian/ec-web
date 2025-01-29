<script setup>
import { onMounted, ref, computed } from 'vue'
import { useDeviceType } from '@/composables/deviceType'
import deviceType from '@/const/deviceType.json'
import { useDeviceSize } from '@/composables/deviceSize'
import { storeToRefs } from 'pinia'
import { useProductCategory } from '@/stores/productCategory'
import { useProduct } from '@/stores/product'
import { getProductCategoriesAsync, getProductsAsync } from '@/api/ecapi'
import { useRouter } from 'vue-router'
import NewProductComponet from '@/components/NewProductComponet.vue'

const router = useRouter()

const { getDeviceType } = useDeviceType()
const { objectProperty } = useDeviceSize()
const { productCategories } = storeToRefs(useProductCategory())
const { products } = storeToRefs(useProduct())

const isNavbarShow = ref(false)

const productInBanner = computed(() => {
  if (!products.value || products.value.length === 0) return null

  const result = products.value.filter((product) => product.isInBanner && product.isInHomepage)[0]

  setDivSizeToImage(result.images.filter((item) => item.isBanner && item[objectProperty])[0].url)

  return result
})

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
  products.value = await getProductsAsync({
    isInBanner: true,
    isNewProduct: true,
    isInHomepage: true,
    operator: 0,
  })

  productCategories.value = await getProductCategoriesAsync()

  if (getDeviceType() === deviceType.desktop) isNavbarShow.value = true
})
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
            <span class="sub-title-manrope-bold white" @click="router.push({ path: '/' })"
              >HOME</span
            >
            <span
              class="sub-title-manrope-bold white"
              v-for="productCategory in productCategories"
              :key="productCategory.id"
              @click="router.push({ path: `/productCategory/${productCategory.id}` })"
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
                  @click="router.push({ path: `/productCategory/${productCategory.id}` })"
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
      <div class="content-container" v-if="productInBanner">
        <div class="content">
          <NewProductComponet class="white" v-if="productInBanner.isNewProduct" />
          <span class="h1-manrope-bold white">{{ productInBanner.name }}</span>
          <span class="content-description">{{ productInBanner.description }}</span>
        </div>
        <button class="button-1-default">SEE PRODUCT</button>
      </div>
    </header>
  </div>
</template>
