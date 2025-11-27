<template>
  <div class="container">
    <div class="card">
      <div class="header-row">
        <h2>Produtos Cadastrados</h2>
        <div class="acoes-topo">
          <input
            v-model="q"
            @input="debounceBuscar"
            placeholder="Buscar produto..."
            class="input-busca"
          />
          <button class="btn novo" @click="$router.push('/novoProduto')">Novo Produto</button>
        </div>
      </div>

      <p v-if="loading" class="status">Carregando produtos...</p>
      <p v-else-if="produtosFiltro.length === 0" class="status">Nenhum produto encontrado.</p>

      <div v-else class="table-wrap">
        <table class="tabela">
          <thead>
            <tr>
              <th @click="ordenarPor('produto')">
                Produto
                <span class="sort-ind">{{ getSortIcon('produto') }}</span>
              </th>
              <th @click="ordenarPor('valor')">
                Valor (R$)
                <span class="sort-ind">{{ getSortIcon('valor') }}</span>
              </th>
              <th @click="ordenarPor('estoque')">
                Estoque
                <span class="sort-ind">{{ getSortIcon('estoque') }}</span>
              </th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="p in paginaAtualItems" :key="p._id">
              <td>{{ p.produto }}</td>
              <td>R$ {{ Number(p.valor).toFixed(2) }}</td>
              <td>{{ p.estoque }}</td>
              <td>
                <button class="btn editar" @click="editarProduto(p._id)">Editar</button>
                <button class="btn excluir" @click="abrirModalExcluir(p)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="paginacao">
        <button @click="irParaPagina(currentPage - 1)" :disabled="currentPage === 1">‹</button>
        <button
          v-for="n in paginaVisivel"
          :key="n"
          :class="{ active: n === currentPage }"
          @click="irParaPagina(n)"
        >
          {{ n }}
        </button>
        <button @click="irParaPagina(currentPage + 1)" :disabled="currentPage === totalPages">›</button>
      </div>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>

      <div class="navegacao">      
        <button class="btn azul" @click="$router.push('/clientes')">
          Lista de clientes
        </button>
        <button class="btn azul" @click="$router.push('/vendedores')">
          Ir para vendedores
        </button>
        <button class="btn azul" @click="$router.push('/vendas')">
          Ir para Vendas
        </button>
      </div>
    </div>


    <!-- Modal de confirmação de exclusão -->
    <div v-if="modalVisivel" class="modal-overlay" @click.self="fecharModal">
      <div class="modal">
        <h3>Excluir Produto</h3>
        <p>Tem certeza que deseja excluir <strong>{{ produtoSelecionado.produto }}</strong>?</p>
        <div class="modal-actions">
          <button class="btn cancelar" @click="fecharModal">Cancelar</button>
          <button class="btn excluir" @click="confirmarExcluir">Excluir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";

export default {
  name: "ListaProdutos",
  data() {
    return {
      produtos: [],
      loading: true,
      mensagem: "",
      q: "",
      buscaTimer: null,
      // paginação
      perPage: 8,
      currentPage: 1,
      // ordenação
      sortKey: "produto",
      sortDir: "asc", // asc | desc
      // modal
      modalVisivel: false,
      produtoSelecionado: null,
    };
  },
  computed: {
    produtosFiltro() {
      const q = this.q.trim().toLowerCase();
      let arr = this.produtos.slice();

      if (q) {
        arr = arr.filter(
          (p) =>
            (p.produto && p.produto.toLowerCase().includes(q)) ||
            (String(p.valor) && String(p.valor).includes(q)) ||
            (String(p.estoque) && String(p.estoque).includes(q))
        );
      }

      // ordenação
      arr.sort((a, b) => {
        const A = a[this.sortKey];
        const B = b[this.sortKey];

        if (A == null) return 1;
        if (B == null) return -1;

        if (this.sortKey === "produto") {
          const res = String(A).localeCompare(String(B), undefined, { sensitivity: "base" });
          return this.sortDir === "asc" ? res : -res;
        } else {
          const numA = Number(A);
          const numB = Number(B);
          const res = numA - numB;
          return this.sortDir === "asc" ? res : -res;
        }
      });

      return arr;
    },
    totalPages() {
      return Math.max(1, Math.ceil(this.produtosFiltro.length / this.perPage));
    },
    paginaAtualItems() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.produtosFiltro.slice(start, start + this.perPage);
    },
    paginaVisivel() {
      // calcula um range simples de páginas a mostrar (máx 7)
      const total = this.totalPages;
      const cur = this.currentPage;
      const max = 7;
      let start = Math.max(1, cur - Math.floor(max / 2));
      let end = Math.min(total, start + max - 1);
      if (end - start + 1 < max) start = Math.max(1, end - max + 1);
      const arr = [];
      for (let i = start; i <= end; i++) arr.push(i);
      return arr;
    },
  },
  methods: {
    async carregarProdutos() {
      try {
        this.loading = true;
        const res = await api.get("/produtos");
        this.produtos = res.data;
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
        this.mensagem = "Erro ao carregar produtos.";
      } finally {
        this.loading = false;
      }
    },

    editarProduto(id) {
      this.$router.push(`/editarProduto/${id}`);
    },

    abrirModalExcluir(produto) {
      this.produtoSelecionado = produto;
      this.modalVisivel = true;
    },

    fecharModal() {
      this.modalVisivel = false;
      this.produtoSelecionado = null;
    },

    async confirmarExcluir() {
      if (!this.produtoSelecionado) return;
      try {
        const id = this.produtoSelecionado._id;
        const res = await api.delete(`/produto/${id}`);
        this.mensagem = res.data.message || "Produto excluído.";
        // atualiza lista localmente
        this.produtos = this.produtos.filter((p) => p._id !== id);
        this.fecharModal();
        // ajusta página se necessário
        if (this.currentPage > this.totalPages) this.currentPage = this.totalPages;
      } catch (error) {
        console.error("Erro ao excluir produto:", error);
        this.mensagem = "Erro ao excluir produto.";
      }
    },

    irParaPagina(n) {
      if (n < 1) n = 1;
      if (n > this.totalPages) n = this.totalPages;
      this.currentPage = n;
      window.scrollTo({ top: 0, behavior: "smooth" });
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

    debounceBuscar() {
      clearTimeout(this.buscaTimer);
      this.buscaTimer = setTimeout(() => {
        this.currentPage = 1;
      }, 350);
    },
  },
  mounted() {
    this.carregarProdutos();
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

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.header-row h2 {
  color: #60a5fa;
  margin: 0;
  font-weight: 600;
}

.acoes-topo {
  display: flex;
  gap: 10px;
  align-items: center;
}

.input-busca {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #475569;
  background: #0b1220;
  color: #fff;
  outline: none;
  transition: box-shadow 0.2s, border-color 0.2s;
  min-width: 220px;
}

.input-busca:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.25);
}

.btn.novo {
  background: #10b981;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.table-wrap {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

.tabela th {
  background: #334155;
  padding: 12px;
  border-bottom: 2px solid #475569;
  font-weight: 600;
  color: #93c5fd;
  text-align: left;
  cursor: pointer;
  user-select: none;
}

.tabela td {
  padding: 12px;
  border-bottom: 1px solid #475569;
  color: #e2e8f0;
}

.tabela tr:hover {
  background: rgba(59, 130, 246, 0.06);
  transition: 0.15s;
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
  transition: 0.2s;
  margin-right: 6px;
}

.btn.editar {
  background: #3b82f6;
  color: #fff;
}

.btn.editar:hover { transform: translateY(-1px); }

.btn.excluir {
  background: #ef4444;
  color: #fff;
}

.btn.excluir:hover { transform: translateY(-1px); }

.status {
  color: #cbd5e1;
  margin-top: 10px;
}

.mensagem {
  margin-top: 15px;
  color: #93c5fd;
  font-weight: 500;
}

/* Paginacao */
.paginacao {
  margin-top: 16px;
  display: flex;
  gap: 6px;
  justify-content: center;
}

.paginacao button {
  padding: 8px 10px;
  border-radius: 6px;
  border: none;
  background: #0b1220;
  color: #cbd5e1;
  cursor: pointer;
}

.paginacao button.active {
  background: #3b82f6;
  color: white;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 60;
}

.modal {
  background: #0b1220;
  padding: 22px;
  border-radius: 10px;
  width: 90%;
  max-width: 420px;
  box-shadow: 0 10px 30px rgba(2,6,23,0.6);
  color: #e6eef8;
  text-align: center;
}

.modal h3 {
  margin-bottom: 8px;
  color: #60a5fa;
}

.modal p { margin-bottom: 14px; color: #cbd5e1; }

.modal-actions { display:flex; gap:10px; justify-content:center; }

.btn.cancelar {
  background: #475569;
  color: #fff;
}

.btn.cancelar:hover { transform: translateY(-1px); }

.navegacao {
  margin-top: 25px;
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn.azul {
  background: #3b82f6;
  color: #fff;
  border: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.25s;
  font-weight: 500;
}

.btn.azul:hover {
  background: #2563eb;
}


</style>
