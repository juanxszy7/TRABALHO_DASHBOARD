<template>
  <div class="container">
    <div class="card">
      <div class="header-row">
        <h2>Clientes Cadastrados</h2>

        <div class="acoes-topo">
          <input
            v-model="q"
            @input="debounceBuscar"
            placeholder="Buscar cliente..."
            class="input-busca"
          />
          <button class="btn novo" @click="cadastrarClientes">
            Novo Cliente
          </button>
        </div>
      </div>

      <p v-if="loading" class="status">Carregando clientes...</p>
      <p v-else-if="clientesFiltrados.length === 0" class="status">
        Nenhum cliente encontrado.
      </p>

      <div v-else class="table-wrap">
        <table class="tabela">
          <thead>
            <tr>
              <th @click="ordenarPor('_id')">
                ID <span>{{ getSortIcon('_id') }}</span>
              </th>
              <th @click="ordenarPor('nome')">
                Nome <span>{{ getSortIcon('nome') }}</span>
              </th>
              <th @click="ordenarPor('email')">
                Email <span>{{ getSortIcon('email') }}</span>
              </th>
              <th @click="ordenarPor('origem')">
                Origem <span>{{ getSortIcon('origem') }}</span>
              </th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="c in paginaAtual" :key="c._id">
              <td>{{ c._id }}</td>
              <td>{{ c.nome }}</td>
              <td>{{ c.email }}</td>
              <td>{{ c.origem }}</td>
              <td>
                <button class="btn editar" @click="editarCliente(c._id)">
                  Editar
                </button>
                <button class="btn excluir" @click="abrirModalConfirmacao(c)">
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="paginacao">
        <button @click="mudarPagina(currentPage - 1)" :disabled="currentPage === 1">
          ‹
        </button>

        <button
          v-for="n in paginasVisiveis"
          :key="n"
          :class="{ active: n === currentPage }"
          @click="mudarPagina(n)"
        >
          {{ n }}
        </button>

        <button @click="mudarPagina(currentPage + 1)" :disabled="currentPage === totalPages">
          ›
        </button>
      </div>

      <div class="navegacao">
        <button class="btn azul" @click="$router.push('/vendedores')">Vendedores</button>
        <button class="btn azul" @click="$router.push('/vendas')">Vendas</button>
        <button class="btn azul" @click="$router.push('/produtos')">Produtos</button>
      </div>
    </div>

    <!-- MODAL -->
    <transition name="fade-blur">
      <div v-if="modalAberto" class="modal-overlay" @click.self="fecharModal">
        <div class="modal">
          <h3>Excluir Cliente</h3>
          <p>Tem certeza que deseja excluir <strong>{{ clienteSelecionado.nome }}</strong>?</p>

          <div class="modal-actions">
            <button class="btn cancelar" @click="fecharModal">Cancelar</button>
            <button class="btn excluir" @click="confirmarExclusao">Excluir</button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>



  
<script>
import api from "@/service/api";

export default {
  name: "ListaClientes",
  data() {
    return {
      clientes: [],
      loading: true,
      q: "",
      buscaTimer: null,

      sortKey: "nome",
      sortDir: "asc",

      perPage: 8,
      currentPage: 1,

      modalAberto: false,
      clienteSelecionado: {},
    };
  },

  computed: {
    clientesFiltrados() {
      const texto = this.q.toLowerCase().trim();
      let arr = this.clientes.slice();

      if (texto) {
        arr = arr.filter(
          (c) =>
            c.nome?.toLowerCase().includes(texto) ||
            c.email?.toLowerCase().includes(texto) ||
            c.origem?.toLowerCase().includes(texto) ||
            c._id?.toLowerCase().includes(texto)
        );
      }

      // ordenação
      arr.sort((a, b) => {
        const A = String(a[this.sortKey] || "").toLowerCase();
        const B = String(b[this.sortKey] || "").toLowerCase();

        if (A < B) return this.sortDir === "asc" ? -1 : 1;
        if (A > B) return this.sortDir === "asc" ? 1 : -1;
        return 0;
      });

      return arr;
    },

    totalPages() {
      return Math.ceil(this.clientesFiltrados.length / this.perPage);
    },

    paginaAtual() {
      const inicio = (this.currentPage - 1) * this.perPage;
      return this.clientesFiltrados.slice(inicio, inicio + this.perPage);
    },

    paginasVisiveis() {
      let arr = [];
      for (let i = 1; i <= this.totalPages; i++) arr.push(i);
      return arr.slice(0, 7);
    },
  },

  methods: {
    async carregarClientes() {
      try {
        const res = await api.get("/clientes");
        this.clientes = res.data;
      } catch (e) {
        console.log("Erro ao carregar clientes", e);
      } finally {
        this.loading = false;
      }
    },

    debounceBuscar() {
      clearTimeout(this.buscaTimer);
      this.buscaTimer = setTimeout(() => {
        this.currentPage = 1;
      }, 300);
    },

    ordenarPor(key) {
      if (this.sortKey === key) {
        this.sortDir = this.sortDir === "asc" ? "desc" : "asc";
      } else {
        this.sortKey = key;
        this.sortDir = "asc";
      }
    },

    getSortIcon(key) {
      if (this.sortKey !== key) return "↕";
      return this.sortDir === "asc" ? "▲" : "▼";
    },

    mudarPagina(n) {
      if (n < 1 || n > this.totalPages) return;
      this.currentPage = n;
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    abrirModalConfirmacao(cliente) {
      this.clienteSelecionado = cliente;
      this.modalAberto = true;
    },

    fecharModal() {
      this.modalAberto = false;
    },

    async confirmarExclusao() {
      try {
        await api.delete(`/clientes/${this.clienteSelecionado._id}`);

        this.clientes = this.clientes.filter(
          (c) => c._id !== this.clienteSelecionado._id
        );

        this.modalAberto = false;
      } catch (e) {
        alert("Erro ao excluir cliente");
      }
    },

    editarCliente(id) {
      this.$router.push(`/editarUsuario/${id}`);
    },

    cadastrarClientes() {
      this.$router.push("/cadastro");
    },
  },

  mounted() {
    this.carregarClientes();
  },
};
</script>



  
<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #0f172a;
  font-family: "Roboto", sans-serif;
  padding-top: 40px;
}

.card {
  background: #1e293b;
  padding: 28px;
  border-radius: 12px;
  width: 92%;
  max-width: 980px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
  color: #fff;
}

/* HEADER */
.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 22px;
}

.header-row h2 {
  color: #60a5fa;
  margin: 0;
  font-weight: 600;
}

/* ----------- CAMPO DE BUSCA BONITO ----------- */
.acoes-topo {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-busca {
  padding: 10px 12px 10px 38px;
  width: 220px;
  max-width: 260px;
  background: #0f172a;
  border: 1px solid #475569;
  border-radius: 8px;
  color: #fff;
  outline: none;
  transition: 0.25s;
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' stroke='%23cbd5e1' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 10px center;
  background-size: 18px;
}

.input-busca:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.35);
}

/* BOTÃO NOVO */
.btn.novo {
  background: #10b981;
  padding: 10px 14px;
  border-radius: 8px;
  border: none;
  color: #fff;
  cursor: pointer;
  transition: 0.2s;
}

.btn.novo:hover {
  background: #059669;
}

/* ------------------- TABELA ------------------- */
.table-wrap {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
}

.tabela th {
  background: #334155;
  color: #93c5fd;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #475569;
  font-weight: 600;
  cursor: pointer;
}

.tabela td {
  padding: 12px;
  border-bottom: 1px solid #475569;
  color: #e2e8f0;
}

.tabela tr:hover {
  background: rgba(59, 130, 246, 0.12);
  transition: 0.15s;
}

/* ------------------- AÇÕES (EDITAR / EXCLUIR) ------------------- */
.acoes {
  display: flex;
  gap: 14px; /* ← AFASTAMENTO MAIOR */
}

/* BOTÕES */
.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 13px;
  transition: 0.25s;
}

.btn.editar {
  background: #3b82f6;
  color: #fff;
}

.btn.editar:hover {
  background: #60a5fa;
}

.btn.excluir {
  background: #ef4444;
  color: #fff;
}

.btn.excluir:hover {
  background: #dc2626;
}

.btn.azul {
  background: #3b82f6;
  color: #fff;
}

.navegacao {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 14px;
}

/* ------------------- PAGINAÇÃO ------------------- */
.paginacao {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 8px;
}

.paginacao button {
  background: #1e3a8a;
  padding: 8px 12px;
  border-radius: 6px;
  color: white;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.paginacao button:hover {
  background: #3b82f6;
}

.paginacao button.active {
  background: #3b82f6;
  font-weight: bold;
}

/* ------------------- MODAL ------------------- */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 90;
  backdrop-filter: blur(6px);
}

.modal {
  background: #0b1220;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  border-radius: 10px;
  text-align: center;
  color: #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

.modal h3 {
  margin-bottom: 10px;
  color: #60a5fa;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

/* SUAVE ANIMAÇÃO DO MODAL */
.fade-blur-enter-active,
.fade-blur-leave-active {
  transition: 0.25s;
}

.fade-blur-enter-from,
.fade-blur-leave-to {
  opacity: 0;
  transform: scale(0.94);
  filter: blur(2px);
}
</style>


  