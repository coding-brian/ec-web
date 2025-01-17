import { createRouter, createWebHistory } from 'vue-router'
import { useUser } from '@/composables/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        requireAuth: false,
      },
      component: () => import('../views/IndexPage.vue'),
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
    },
  ],
})

router.beforeEach((to) => {
  const { IsAuthorizated } = useUser()
  if (to.meta.requireAuth && !IsAuthorizated()) return { name: 'login' }
})

export default router
