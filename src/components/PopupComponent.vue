<script setup>
import { getOrderAsync } from '@/api/ecapi'
import { computed, onMounted, ref } from 'vue'
import MaskComponent from './MaskComponent.vue'
import { useDeviceSize } from '@/composables/deviceSize'
import { useRouter } from 'vue-router'

const props = defineProps({ orderId: { type: String, default: null } })
const router = useRouter()
const { objectProperty } = useDeviceSize()

const isShowMore = ref(false)

const order = ref(null)

const getImages = (images) => images.filter((image) => image[objectProperty] && !image.isBanner)

const orderDetails = computed(() => {
  console.log()

  if (isShowMore.value) {
    return order.value.details
  } else {
    return order.value.details.slice(0, 1)
  }
})

const goHome = () => {
  router.push({ name: 'home' })
}

onMounted(async () => {
  order.value = await getOrderAsync(props.orderId)
})
</script>

<template>
  <MaskComponent v-if="order">
    <div class="pop-container">
      <div class="popup">
        <img src="/images/icon-order-confirmation.svg" alt="" />
        <span class="h3-manrope-bold">THANK YOU FOR YOUR ORDER</span>
        <span class="body-manrope-medium opacity-50"
          >You will receive an email confirmation shortly.</span
        >
        <div class="detail">
          <div class="item-container">
            <div>
              <div class="item" v-for="detail in orderDetails" :key="detail.id">
                <img class="item-image" :src="getImages(detail.product.images)[0].url" alt="" />
                <div class="item-description">
                  <span class="body-manrope-medium black">{{ detail.product.shortName }}</span>
                  <span class="opacity-50 black item-sale-price">${{ detail.salePrice }}</span>
                </div>
                <span class="body-manrope-medium opacity-50 black">x{{ detail.quantity }}</span>
              </div>
            </div>
            <span
              class="else-item opacity-50 black"
              v-if="order.details && order.details.length > 1"
              @click="() => (isShowMore = !isShowMore)"
            >
              and {{ order.details.length - 1 }} other item(s)
            </span>
          </div>
          <div>
            <span class="body-manrope-medium opacity-50 white">GRAND TOTAL</span>
            <span class="detail-amount white">${{ order.grandTotal }}</span>
          </div>
        </div>
        <button class="button-1-default" @click="goHome">BACK TO HOME</button>
      </div>
    </div>
  </MaskComponent>
</template>

<style scoped>
.pop-container {
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 125px;
}

.popup {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 34px;
  background-color: white;
  border-radius: 8px;
  max-height: 581px;
  padding: 48px;
}

.popup button {
  width: 100%;
}

.detail {
  display: flex;
  border-radius: 8px;
  align-self: stretch;
}

.detail > div:first-child {
  flex: 4;
  background-color: var(--anti-flash-white);
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.detail > div:nth-child(2) {
  flex: 3;
  background-color: black;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  padding-left: 32px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.detail-amount {
  font-size: 18px;
  font-weight: bold;
}

.item-container {
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.item-container > div:first-child {
  border-bottom: 1px rgba(0, 0, 0, 0.08) solid;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 12px;
}

.item-image {
  max-width: 64px;
  max-height: 64px;
  border-radius: 8px;
}

.item-description {
  display: flex;
  flex-direction: column;
}

.item-sale-price {
  font-size: 14px;
  line-height: 25px;
  font-weight: bold;
}

.else-item {
  font-size: 12px;
  letter-spacing: -0.21px;
  text-align: center;
  padding-top: 12px;
  cursor: pointer;
}

/* Mobile */
@media screen and (max-width: 767px) {
  .pop-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-left: 24px;
    padding-right: 24px;
  }

  .popup {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 34px;
    background-color: white;
    max-height: initial;
    padding: 32px;
  }

  .detail {
    display: flex;
    flex-direction: column;
  }

  .detail > div:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 0px;
  }

  .detail > div:nth-child(2) {
    border-top-right-radius: 0px;
    border-bottom-right-radius: 8px;
    border-bottom-left-radius: 8px;
    padding-left: 24px;
    padding-top: 16px;
    padding-bottom: 16px;
  }
}
</style>
