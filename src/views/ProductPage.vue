<script setup>
import { useProduct } from '@/stores/product'
import { storeToRefs } from 'pinia'
import { computed, onMounted, watch } from 'vue'
import { getProductAsync } from '@/api/ecapi'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import ProductContent from '@/components/ProductContent.vue'
import { useDeviceSize } from '@/composables/deviceSize'
import ProductButton from '@/components/ProductButton.vue'
import CountButton from '@/components/CountButton.vue'

const { product } = storeToRefs(useProduct())
const route = useRoute()
const router = useRouter()
const { objectProperty } = useDeviceSize()

const proudctImages = computed(() => {
  if (!product.value) return null

  return product.value.images.filter(
    (item) => !item.isBanner && !item.isInCategory && item[objectProperty],
  )
})

const productGalleries = computed(() => {
  if (!product.value || !product.value.galleries) return null

  return product.value.galleries.filter((item) => item[objectProperty])
})

onBeforeRouteLeave(() => {
  product.value = null
})

onMounted(async () => {
  product.value = await getProductAsync(route.params.id)
})

watch(
  () => route.params.id,
  async (newId) => {
    product.value = await getProductAsync(newId)
  },
)
</script>

<template>
  <div class="container" v-if="product">
    <div class="main">
      <span class="body-manrope-medium opacity-50 black pointer" @click="router.back()"
        >Go Back</span
      >
      <div class="product-container">
        <img :src="proudctImages[0].url" alt="" />
        <ProductContent :product="product">
          <span class="h6-manrope-bold black">$ {{ product.price.salePrice }}</span>
          <CountButton></CountButton>
        </ProductContent>
      </div>
    </div>
    <div class="product-description">
      <div class="feature">
        <span class="h3-manrope-bold black">FEATURES</span>
        <div>
          <span class="body-manrope-medium opacity-50">{{ product.feature }}</span>
        </div>
      </div>
      <div class="in-the-box">
        <span class="h3-manrope-bold black">IN THE BOX</span>
        <ul class="body-manrope-medium">
          <li v-for="content in product.contents" :key="content.id">
            <span class="peru">{{ content.count }}x</span>
            <span class="opacity-50">{{ content.name }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="gallery">
      <img v-for="gallery in productGalleries" :src="gallery.url" alt="" :key="gallery.id" />
    </div>
    <div class="relation">
      <span class="h3-manrope-bold">YOU MAY ALSO LIKE</span>
      <div class="product-relation">
        <div v-for="relation in product.relations" :key="relation.id">
          <img
            :src="relation.images.filter((item) => item[objectProperty])[0].url"
            alt=""
            v-if="relation.images && relation.images.length > 0"
          />
          <span class="h5-manrope-bold">{{ relation.name }}</span>
          <ProductButton class="button-1-default" :id="relation.itemId"></ProductButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
ul,
li {
  margin: 0;
  padding: 0;
  list-style: none; /* 移除項目符號 */
}

li span:first-child {
  margin-right: 24px;
}

img {
  border-radius: 8px;
}

.container {
  display: flex;
  flex-direction: column;
  gap: 160px;
}

.container .main {
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.container .main .product-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 124.5px;
}

.container .product-container img {
  max-width: 540px;
  max-height: 560px;
}

.product-description {
  display: grid;
  grid-template-columns: 2fr 1fr;
  width: 100%;
  gap: 125px;
}

.in-the-box,
.feature {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.gallery {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  column-gap: 30px;
  row-gap: 32px;
  grid-template-areas:
    'img1 img2'
    'img3 img2';
}

.gallery img:first-child {
  grid-area: img1;
}

.gallery img:nth-child(2) {
  grid-area: img2;
  grid-row: span 2;
}

.gallery img:nth-child(3) {
  grid-area: img3;
}

.relation {
  display: flex;
  flex-direction: column;
  gap: 64px;
  padding-bottom: 160px;
}

.relation span {
  text-align: center;
}

.product-relation {
  display: flex;
  justify-content: space-between;
}

.product-relation img {
  max-width: 350px;
  max-height: 318px;
}

.product-relation div {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  .container .product-container img {
    max-width: 281px;
    max-height: 480px;
  }

  .container .main {
    gap: 24px;
  }

  .container .main .product-container {
    gap: 69px;
  }

  .product-content {
    align-items: start;
  }

  .product-description {
    display: grid;
    grid-template-columns: 1fr;
    gap: 120px;
  }

  .gallery {
    width: 100%;
    column-gap: 18px;
    row-gap: 20px;
  }

  .gallery img:first-child {
    max-width: 277px;
    max-height: 174px;
  }

  .gallery img:nth-child(2) {
    max-width: 395px;
    max-height: 368px;
  }

  .gallery img:nth-child(3) {
    max-width: 277px;
    max-height: 174px;
  }

  .in-the-box {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0;
  }

  .relation {
    gap: 56px;
    padding-bottom: 120px;
  }

  .product-relation img {
    max-width: 223px;
    max-height: 318px;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  .product-container {
    flex-direction: column;
    gap: 40px;
  }

  .container .product-container img {
    max-width: 327px;
    max-height: 327px;
  }

  .gallery {
    display: grid;
    column-gap: 0px;
    row-gap: 20px;
    grid-template-areas:
      'img1'
      'img3'
      'img2';
  }

  .gallery img:first-child,
  .gallery img:nth-child(3) {
    max-width: 327px;
    max-height: 174px;
  }

  .gallery img:nth-child(2) {
    max-width: 327px;
    max-height: 368px;
  }

  .in-the-box {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 24px;
  }

  .relation {
    gap: 40px;
  }

  .product-relation {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>

<style>
main {
  grid-template-areas:
    'main-content'
    'product-category-group'
    'news';
}
</style>
