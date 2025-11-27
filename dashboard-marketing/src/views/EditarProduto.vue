<template>
  <div class="container">
    <div class="card">
      <h2>Editar Produto</h2>

      <p v-if="loading" class="status">Carregando...</p>

      <form v-else @submit.prevent="salvar" class="formulario">
        <div class="campo">
          <label>Nome do Produto</label>
          <input v-model="produto.nomeProd" type="text" required />
        </div>

        <div class="campo">
          <label>Valor (R$)</label>
          <input v-model="produto.valorProd" type="number" step="0.01" required />
        </div>

        <div class="campo">
          <label>Estoque</label>
          <input v-model="produto.estoqueProd" type="number" min="0" required />
        </div>

        <div class="acoes">
          <button type="submit" class="btn salvar">Salvar</button>
          <button type="button" class="btn voltar" @click="$router.push('/produtos')">Voltar</button>
        </div>
      </form>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </div>

    


  </div>
</template>

<script>
import api from "@/service/api";

export default {
  name: "EditarProduto",
  data() {
    return {
      produto: {},
      loading: true,
      mensagem: "",
    };
  },
  methods: {
    async carregar() {
      try {
        this.loading = true;
        const id = this.$route.params.id;
        const res = await api.get(`/produto/${id}`);

        const p = res.data.produto;

        this.produto = {
          nomeProd: p.produto,
          valorProd: p.valor,
          estoqueProd: p.estoque
        };

      } catch (error) {
        console.error("Erro ao carregar produto:", error);
        this.mensagem = "Erro ao carregar produto.";
      } finally {
        this.loading = false;
      }
    },

    async salvar() {
      try {
        const id = this.$route.params.id;

        const payload = {
          produto: this.produto.nomeProd,
          valor: Number(this.produto.valorProd),
          estoque: Number(this.produto.estoqueProd),
        };

        if (payload.valor < 0) {
          this.mensagem = "Valor não pode ser negativo.";
          return;
        }

        if (payload.estoque < 0) {
          this.mensagem = "Estoque não pode ser negativo.";
          return;
        }

        const res = await api.put(`/editarProduto/${id}`, payload);
        this.mensagem = res.data.message || "Produto atualizado com sucesso.";

        // opcional: redirecionar após salvar
        setTimeout(() => {
          this.$router.push("/produtos");
        }, 900);
      } catch (error) {
        console.error("Erro ao salvar produto:", error);
        this.mensagem = "Erro ao salvar produto.";
      }
    },
  },
  mounted() {
    this.carregar();
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
  padding-top: 50px;
}

.card {
  background: #1e293b;
  padding: 36px;
  border-radius: 12px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
  color: #fff;
}

.card h2 {
  margin-bottom: 20px;
  font-weight: 600;
  color: #60a5fa;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.campo { display:flex; flex-direction:column; text-align:left; }

label { font-weight:600; margin-bottom:6px; color:#cbd5e1; }

input {
  padding:10px;
  border-radius:8px;
  border:1px solid #475569;
  background:#334155;
  color:#fff;
  font-size:15px;
  outline:none;
  transition: border 0.3s, box-shadow 0.2s;
}

input:focus {
  border-color:#3b82f6;
  box-shadow: 0 0 8px rgba(59,130,246,0.25);
}

.acoes {
  display:flex;
  gap:10px;
  margin-top:6px;
}

.btn.salvar {
  background:#3b82f6;
  color:#fff;
  border:none;
  padding:10px 14px;
  border-radius:8px;
  cursor:pointer;
}

.btn.voltar {
  background:#475569;
  color:#fff;
  border:none;
  padding:10px 14px;
  border-radius:8px;
  cursor:pointer;
}

.status { color:#cbd5e1; margin-bottom:8px; }
.mensagem { margin-top:12px; color:#93c5fd; font-weight:500; }
</style>
