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

const getImage = (images) => {
  return images.filter((item) => item.isInBanner && item[objectProperty])[0]
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
          <li><span class="sub-title-manrope-bold white">HOME</span></li>
          <li
            v-for="productCategory in productCategories"
            :key="productCategory.id"
            @click="router.push({ path: `/productCategory/${productCategory.id}` })"
          >
            <span class="sub-title-manrope-bold white">{{ productCategory.name }}</span>
          </li>
        </template>
        <template v-else>
          <div class="navbar" v-if="isNavbarShow">
            <div>
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
                    <div class="product-categoey-shop">
                      <span>SHOP</span>
                      <img src="/images/icon-arrow-right.svg" alt="" srcset="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <li><img src="/images/icon-cart.svg" alt="" class="cart" /></li>
      </ul>
    </nav>
  </header>
  <div class="banner">
    <div class="content-container" v-if="productInBanner">
      <div class="content">
        <NewProductComponet class="white" v-if="productInBanner.isNewProduct" />
        <span class="h1-manrope-bold white">{{ productInBanner.name }}</span>
        <span class="content-description">{{ productInBanner.description }}</span>
      </div>
      <button class="button-1-default">SEE PRODUCT</button>
    </div>
  </div>
</template>

<style scoped>
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

header span:hover {
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

  .navbar {
    display: block;
    position: absolute;
    top: 94px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    width: 100%;
    z-index: 2;
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
  }

  .content-container .content {
    text-align: center;
  }
}
</style>
