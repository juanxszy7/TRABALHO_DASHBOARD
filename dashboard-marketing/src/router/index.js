import { createRouter, createWebHistory } from 'vue-router'
import PaginaCadastro from '../views/PaginaCadastro.vue'
import PaginaLogin from '@/views/PaginaLogin.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PaginaCadastro',
      component: PaginaCadastro,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'PaginaLogin',
      component: PaginaLogin
    },
  ],
})

export default router
