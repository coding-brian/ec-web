import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: '',
      meta: {
        requireAuth: false,
      },
      component: () => import('../views/HomePage.vue'),
      children: [
        { name: 'home', path: '', component: () => import('@/views/ProductGroupPage.vue') },
        {
          name: 'product',
          path: 'product/:id',
          component: () => import('@/views/ProductPage.vue'),
        },
        {
          name: 'productCategory',
          path: 'productCategory/:id',
          component: () => import('@/views/ProductCategoryPage.vue'),
        },
      ],
    },
    // TODO: 這裡要改成requireAuth: true
    {
      path: '/checkout',
      name: 'checkout',
      meta: {
        requireAuth: true,
      },
      component: () => import('../views/CheckoutPage.vue'),
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        requireAuth: false,
      },
      component: () => import('../views/RegisterPage.vue'),
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        requireAuth: false,
      },
      component: () => import('../views/LoginPage.vue'),
      beforeEnter() {
        const userStore = useUserStore()
        // TODO 如果已經登入狀態，再去登入頁，要導去特定一頁
        if (userStore.IsAuthorizated()) return { name: 'home' }

        return true
      },
    },
  ],
})

router.beforeResolve((to) => {
  const userStore = useUserStore()
  if (to.meta.requireAuth && !userStore.IsAuthorizated()) return { name: 'login' }

  return true
})

export default router
