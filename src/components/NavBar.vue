<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useDeviceType } from '@/composables/deviceType'
import deviceType from '@/const/deviceType.json'
import { useDeviceSize } from '@/composables/deviceSize'
import { storeToRefs } from 'pinia'
import { useProductCategoryStore } from '@/stores/productCategory'
import { useProductStore } from '@/stores/product'
import { getProductCategoriesAsync, getProductsAsync } from '@/api/ecapi'
import { useRouter, useRoute } from 'vue-router'
import NewProductComponet from '@/components/NewProduct.vue'
import MaskComponent from './MaskComponent.vue'
import CartComponent from './CartComponent.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const { getDeviceType } = useDeviceType()
const { objectProperty } = useDeviceSize()
const { productCategories, productCategory } = storeToRefs(useProductCategoryStore())
const { products } = storeToRefs(useProductStore())

const isNavbarShow = ref(false)
const isShowCart = ref(false)

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

const getImage = (images) => {
  return images.filter((item) => item.isInBanner && item[objectProperty])[0]
}

const loginAsync = async () => {
  if (userStore.IsAuthorizated()) {
    //TODO: 會員中心
    console.log('去會員中心')
  } else {
    router.push({ name: 'login' })
  }
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

watch(
  () => route.name,
  () => {
    if (productInBanner.value && route.name === 'home') {
      setDivSizeToImage(
        productInBanner.value.images.filter((item) => item.isBanner && item[objectProperty])[0].url,
      )
    }
  },
)
</script>

<template>
  <header>
    <nav>
      <ul>
        <li>
          <div
            class="hamburger"
            v-if="getDeviceType() !== deviceType.desktop"
            @click="() => (isNavbarShow = !isNavbarShow)"
          ></div>
          <img class="logo" src="/images/logo.svg" alt="" />
        </li>
        <template v-if="getDeviceType() === deviceType.desktop">
          <li>
            <span class="sub-title-manrope-bold white" @click="router.push({ path: '/' })"
              >HOME</span
            >
          </li>
          <li
            v-for="productCategory in productCategories"
            :key="productCategory.id"
            @click="router.push({ path: `/productCategory/${productCategory.id}` })"
          >
            <span class="sub-title-manrope-bold white">{{ productCategory.name }}</span>
          </li>
        </template>
        <template v-else>
          <MaskComponent v-if="isNavbarShow">
            <div class="navbar">
              <div class="product-category-group" v-if="productCategories">
                <div
                  class="product-category"
                  v-for="productCategory in productCategories"
                  :key="productCategory.id"
                  @click="router.push({ path: `/productCategory/${productCategory.id}` })"
                >
                  <img
                    :src="getImage(productCategory.images).url"
                    alt=""
                    srcset=""
                    v-if="productCategory.images && productCategory.images.length > 0"
                  />
                  <div class="product-categoey-content">
                    <span class="product-categoey-name white">{{ productCategory.name }}</span>
                    <div
                      class="product-categoey-shop"
                      @click="
                        router.push({ name: 'productCategory', params: { id: productCategory.id } })
                      "
                    >
                      <span>SHOP</span>
                      <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </MaskComponent>
        </template>
        <CartComponent v-model:is-show="isShowCart"></CartComponent>
        <li class="menu">
          <span class="material-symbols-outlined white person" @click="loginAsync"> person </span>
          <img src="/images/icon-cart.svg" class="cart" @click="() => (isShowCart = !isShowCart)" />
        </li>
      </ul>
    </nav>
  </header>
  <div class="banner" v-if="route.name === 'home'">
    <div class="content-container" v-if="productInBanner">
      <div class="content">
        <NewProductComponet class="white" v-if="productInBanner.isNewProduct" />
        <span class="content-title h1-manrope-bold white">{{ productInBanner.name }}</span>
        <span class="content-description">{{ productInBanner.description }}</span>
      </div>
      <button class="button-1-default">SEE PRODUCT</button>
    </div>
  </div>
  <div v-if="route.name === 'productCategory' && productCategory" class="product-category-header">
    <span class="h2-manrope-bold white">{{ productCategory.name }}</span>
  </div>
</template>

<style scoped>
.product-category-header {
  background-color: black;
  width: 100%;
  height: 239px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.banner {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  width: 100%;
  height: 729px;
  display: flex;
  align-items: center;
}

.content-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 165px;
  max-width: 398px;
}

header {
  width: 100%;
  background-color: black;
}

header span:not(.person):hover {
  color: var(--peru);
  cursor: pointer;
}

nav {
  padding-top: 32px;
  padding-bottom: 36px;
  padding-left: 165px;
  padding-right: 165px;
  border-bottom: 1px rgba(255, 255, 255, 0.1) solid;
}

ul,
li {
  margin: 0;
  padding: 0;
  list-style: none;
}

ul {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
}

.content-container > button {
  margin-top: 40px;
}

.content-description {
  font-weight: 500;
  font-size: 15px;
  line-height: 25px;
  color: white;
  opacity: 75%;
}

.menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.person {
  font-size: 30px;
  cursor: pointer;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  .banner {
    justify-content: center;
  }
  nav {
    padding-left: 40px;
    padding-right: 40px;
  }

  ul {
    min-width: auto;
  }

  ul li:first-child {
    display: flex;
    gap: 42px;
  }

  .navbar > span:first-child {
    display: none;
  }

  .navbar span {
    color: black;
  }

  .navbar > div {
    height: auto;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding-top: 56px;
    padding-bottom: 67px;
  }

  .hamburger {
    width: 16px;
    height: 16px;
    background-image: url('/images/icon-hamburger.svg');
    background-position: center;
    background-repeat: no-repeat;
  }

  .content-container {
    padding-left: 0px;
    align-items: center;
    max-width: initial;
    min-width: 100%;
    padding-left: 24px;
    padding-right: 24px;
  }

  .content-container .content {
    text-align: center;
    min-width: 100%;
  }

  .content-title {
    font-size: 32px;
  }
}
</style>
