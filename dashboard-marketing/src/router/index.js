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

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    {
      path: '/clientes',
      name: 'ListagemDeClientes',
      component: ListagemDeClientes,
    },
    {
      path: '/vendedores',
      name: 'ListagemDeVendedores',
      component: ListagemVendedores,
    },
    {
      path: '/vendas',
      name: 'ListagemVendas',
      component: ListagemVendas,
    },
    {
      path: '/novaVenda',
      name: 'CadastroNovaVenda',
      component: CadastroNovaVenda,
    },
    {
      path: '/editarUsuario/:id',
      name: 'PaginaEdicaoCliente',
      component: PaginaEdicaoCliente,
    },
    {
      path: '/editarVenda/:id',
      name: 'EditarVenda',
      component: EditarVenda,
    },
    {
      path: '/estatisticas',
      name: 'GraficosMarketing',
      component: GraficosMarketing,
    },
    {
      path: '/faturamentoMensal',
      name: 'FaturamentoMensal',
      component: FaturamentoMensal,
    },
    
  ],
})

export default router
