import { createRouter, createWebHistory } from 'vue-router'
import PaginaCadastro from '../views/PaginaCadastro.vue'
import PaginaLogin from '@/views/PaginaLogin.vue'
import ListagemDeClientes from '@/views/ListagemDeClientes.vue'
import PaginaEdicaoCliente from '@/views/PaginaEdicaoCliente.vue'
import ListagemVendedores from '@/views/ListagemVendedores.vue'
import ListagemVendas from '@/views/ListagemVendas.vue'
import CadastroNovaVenda from '@/views/CadastroNovaVenda.vue'
import EditarVenda from '@/views/EditarVenda.vue'
import GraficosMarketing from '@/views/GraficosMarketing.vue'
import FaturamentoMensal from '@/views/FaturamentoMensal.vue'
import CadastroNovoProduto from '@/views/CadastroNovoProduto.vue'
import ListaProdutos from '@/views/ListaProdutos.vue'
import EditarProduto from '@/views/EditarProduto.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🔓 ROTAS LIVRES
    {
      path: '/',
      name: 'PaginaLogin',
      component: PaginaLogin,
    },
    {
      path: '/cadastro',
      name: 'PaginaCadastro',
      component: PaginaCadastro,
    },

    // 🔒 ROTAS PRIVADAS
    {
      path: '/clientes',
      name: 'ListagemDeClientes',
      component: ListagemDeClientes,
      meta: { requiresAuth: true }
    },
    {
      path: '/vendedores',
      name: 'ListagemVendedores',
      component: ListagemVendedores,
      meta: { requiresAuth: true }
    },
    {
      path: '/vendas',
      name: 'ListagemVendas',
      component: ListagemVendas,
      meta: { requiresAuth: true }
    },
    {
      path: '/novaVenda',
      name: 'CadastroNovaVenda',
      component: CadastroNovaVenda,
      meta: { requiresAuth: true }
    },
    {
      path: '/editarUsuario/:id',
      name: 'PaginaEdicaoCliente',
      component: PaginaEdicaoCliente,
      meta: { requiresAuth: true }
    },
    {
      path: '/editarVenda/:id',
      name: 'EditarVenda',
      component: EditarVenda,
      meta: { requiresAuth: true }
    },
    {
      path: '/estatisticas',
      name: 'GraficosMarketing',
      component: GraficosMarketing,
      meta: { requiresAuth: true }
    },
    {
      path: '/faturamentoMensal',
      name: 'FaturamentoMensal',
      component: FaturamentoMensal,
      meta: { requiresAuth: true }
    },
    {
      path: '/novoProduto',
      name: 'CadastroNovoProduto',
      component: CadastroNovoProduto,
      meta: { requiresAuth: true }
    },
    {
      path: '/produtos',
      name: 'ListaProdutos',
      component: ListaProdutos,
      meta: { requiresAuth: true }
    },
    {
      path: '/editarProduto/:id',
      name: 'EditarProduto',
      component: EditarProduto,
      meta: { requiresAuth: true }
    },
  ],
})


// 🔥 ROUTE GUARD — Protege todas as rotas privadas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");

  if (to.meta.requiresAuth && !token) {
    return next("/");
  }

  next();
});

export default router;
