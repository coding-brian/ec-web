<script setup>
import { ref } from 'vue'

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

const mouseenter = (e, socialMedia) => {
  e.target.src = socialMedia.hoverUrl
}

const mouseleave = (e, socialMedia) => {
  e.target.src = socialMedia.url
}
</script>

<template>
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

<style scoped>
footer {
  width: 100%;
  min-height: 365px;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.footer-content {
  width: 1110px;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: 2fr 6fr 1fr;
}

.description {
  width: 540px;
}

.description,
.copyright {
  opacity: 50%;
}

.social-media {
  display: flex;
  justify-content: end;
  align-items: end;
  gap: 16px;
}

.social-media > img {
  cursor: pointer;
}

.navbar-footer {
  display: flex;
  gap: 34px;
  justify-content: end;
}

.navbar-footer span:hover {
  color: var(--peru);
  cursor: pointer;
}

/* Tablet */
@media screen and (max-width: 1024px) {
  .footer-content {
    width: 689px;
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      'logo logo'
      'navbar-footer navbar-footer'
      'description description'
      'copyright social-media';
    row-gap: 32px;
  }

  .footer-content .logo {
    grid-area: logo;
  }

  .footer-content .navbar-footer {
    grid-area: navbar-footer;
  }

  .footer-content .description {
    grid-area: description;
  }

  .footer-content .social-media {
    grid-area: social-media;
  }

  .footer-content .copyright {
    grid-area: copyright;
  }

  .navbar-footer {
    justify-content: start;
  }
}

/* Mobile */
@media screen and (max-width: 767px) {
  footer {
    max-width: 100%;
    height: 654px;
  }

  .footer-content {
    display: grid;
    grid-template-columns: auto;
    grid-template-rows: auto auto auto auto auto;
    grid-template-areas:
      'logo'
      'navbar-footer'
      'description'
      'copyright'
      'social-media';
    justify-items: center;
    row-gap: 48px;
  }

  .navbar-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .description {
    text-align: center;
    max-width: 327px;
  }
}
</style>
