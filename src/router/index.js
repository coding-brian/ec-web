import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        requireAuth: false,
      },
      component: () => import('../views/HomePage.vue'),
      children: [
        { name: '', path: '', component: () => import('@/views/ProductGroupPage.vue') },
        {
          name: 'productCategory',
          path: 'productCategory/:id',
          component: () => import('@/views/ProductCategory.vue'),
        },
      ],
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
        if (userStore.IsAuthorizated()) return { name: 'index' }

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
