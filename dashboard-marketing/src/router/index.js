import { createRouter, createWebHistory } from 'vue-router'
import PaginaCadastro from '../views/PaginaCadastro.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'PaginaCadastro',
      component: PaginaCadastro,
    },
    
  ],
})

export default router
