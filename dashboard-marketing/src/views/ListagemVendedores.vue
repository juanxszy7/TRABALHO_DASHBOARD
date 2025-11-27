<template>
  <div class="container">
    <div class="card">

      <!-- Cabeçalho -->
      <div class="header-row">
        <h2>Vendedores Cadastrados</h2>

        <div class="acoes-topo">
          <input
            v-model="q"
            @input="debounceBuscar"
            placeholder="Buscar vendedor..."
            class="input-busca"
          />

          <button class="btn novo" @click="$router.push('/novoVendedor')">
            Novo Vendedor
          </button>
        </div>
      </div>

      <!-- Estados -->
      <p v-if="loading" class="status">Carregando vendedores...</p>
      <p v-else-if="erro" class="status erro">{{ erro }}</p>

      <!-- Tabela -->
      <div v-else class="table-wrap">
        <table class="tabela">
          <thead>
            <tr>
              <th @click="ordenarPor('nome')" class="clickable">
                Nome
                <span v-if="ordenar.campo === 'nome'">
                  {{ ordenar.direcao === 'asc' ? '▲' : '▼' }}
                </span>
              </th>

              <th @click="ordenarPor('email')" class="clickable">
                Email
                <span v-if="ordenar.campo === 'email'">
                  {{ ordenar.direcao === 'asc' ? '▲' : '▼' }}
                </span>
              </th>

              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="v in vendedoresOrdenados" :key="v.id">
              <td>{{ v.nome }}</td>
              <td>{{ v.email }}</td>

              <td>
                <button class="btn editar" @click="editar(v.id)">Editar</button>
                <button class="btn excluir" @click="excluir(v.id)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botão atualizar -->
      <div class="botoes">
        <button class="btn azul atualizar" @click="carregar">Atualizar Lista</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import api from "@/service/api";

const vendedores = ref([]);
const loading = ref(false);
const erro = ref("");
const q = ref("");

const ordenar = ref({
  campo: "nome",
  direcao: "asc",
});

// -------- BUSCA COM DEBOUNCE --------
let timerBusca = null;

const debounceBuscar = () => {
  clearTimeout(timerBusca);
  timerBusca = setTimeout(() => {
    aplicarFiltro();
  }, 300);
};

// -------- CARREGAR LISTA --------
async function carregar() {
  loading.value = true;
  erro.value = "";

  try {
    const { data } = await api.get("/vendedores");
    vendedores.value = data;
  } catch (e) {
    erro.value = "Erro ao carregar vendedores.";
  }

  loading.value = false;
}

carregar();

// -------- FILTRO --------
const vendedoresFiltrados = computed(() => {
  return vendedores.value.filter((v) =>
    v.nome.toLowerCase().includes(q.value.toLowerCase())
  );
});

// -------- ORDENAÇÃO --------
function ordenarPor(campo) {
  if (ordenar.value.campo === campo) {
    ordenar.value.direcao =
      ordenar.value.direcao === "asc" ? "desc" : "asc";
  } else {
    ordenar.value.campo = campo;
    ordenar.value.direcao = "asc";
  }
}

const vendedoresOrdenados = computed(() => {
  return [...vendedoresFiltrados.value].sort((a, b) => {
    const campo = ordenar.value.campo;
    const dir = ordenar.value.direcao === "asc" ? 1 : -1;

    return a[campo].localeCompare(b[campo]) * dir;
  });
});

// -------- AÇÕES --------
function editar(id) {
  alert("Editar vendedor: " + id);
}

async function excluir(id) {
  if (!confirm("Excluir este vendedor?")) return;

  try {
    await axios.delete(`http://localhost:3333/vendedor/${id}`);
    carregar();
  } catch (e) {
    alert("Erro ao excluir.");
  }
}

function aplicarFiltro() {
  // Função chamada pelo debounce (já atualiza a lista filtrada)
}
</script>

<style scoped>
/* ---------- ESTILO COMPLETO ---------- */

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
  margin-bottom: 22px;
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
  padding: 10px 12px 10px 38px;
  width: 220px;
  background: #0f172a;
  border: 1px solid #475569;
  border-radius: 8px;
  color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg width='18' height='18' stroke='%23cbd5e1' fill='none' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='11' cy='11' r='8'/%3E%3Cpath d='m21 21-4.3-4.3'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 10px center;
  transition: 0.2s;
}

.input-busca:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.35);
}

/* Tabela */
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
  border-bottom: 2px solid #475569;
  font-weight: 600;
}

.tabela td {
  padding: 12px;
  border-bottom: 1px solid #475569;
  color: #e2e8f0;
}

.tabela tr:hover {
  background: rgba(59, 130, 246, 0.12);
}

.clickable {
  cursor: pointer;
  user-select: none;
}

/* Botões */
.btn {
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}

.btn.novo {
  background: #10b981;
  color: white;
}

.btn.novo:hover {
  background: #059669;
}

.btn.editar {
  background: #3b82f6;
  color: white;
}

.btn.editar:hover {
  background: #60a5fa;
}

.btn.excluir {
  background: #ef4444;
  color: white;
}

.btn.excluir:hover {
  background: #dc2626;
}

.botoes {
  margin-top: 25px;
  display: flex;
  justify-content: center;
  gap: 14px;
}

.btn.azul {
  background: #3b82f6;
  color: white;
}

.btn.azul:hover {
  background: #60a5fa;
}

/* Estados */
.status {
  color: #cbd5e1;
  font-size: 15px;
}

.status.erro {
  color: #f87171;
}
</style>
