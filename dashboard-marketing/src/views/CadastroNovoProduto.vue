<template>
  <div class="container">
    <div class="card">
      <h2>Cadastrar Produto</h2>

      <form @submit.prevent="cadastrarProduto" class="formulario">

        <div class="campo">
          <label>Nome do Produto:</label>
          <input
            type="text"
            v-model="produto.produto"
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div class="campo">
          <label>Valor (R$):</label>
          <input
            type="number"
            step="0.01"
            v-model="produto.valor"
            placeholder="Digite o valor do produto"
            required
          />
        </div>

        <div class="campo">
          <label>Estoque Inicial:</label>
          <input
            type="number"
            min="0"
            v-model="produto.estoque"
            placeholder="Digite a quantidade"
            required
          />
        </div>

        <button type="submit" class="btn salvar">Cadastrar Produto</button>
      </form>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";

export default {
  name: "CadastroNovoProduto",

  data() {
    return {
      produto: {
        produto: "",
        valor: "",
        estoque: "",
      },
      mensagem: "",
    };
  },

  methods: {
    async cadastrarProduto() {
      try {
        const novo = {
          produto: this.produto.produto,
          valor: parseFloat(this.produto.valor),
          estoque: Number(this.produto.estoque),
        };

        if (novo.valor < 0) {
          this.mensagem = "O valor não pode ser negativo.";
          return;
        }
        if (novo.estoque < 0) {
          this.mensagem = "O estoque não pode ser negativo.";
          return;
        }

        const res = await api.post("/novoProduto", novo);
        this.mensagem = res.data.message;

        // Limpar campos
        this.produto = {
          produto: "",
          valor: "",
          estoque: "",
        };

        // Redirecionar suavemente
        setTimeout(() => {
          this.$router.push("/produtos");
        }, 1000);

      } catch (err) {
        console.error(err);
        this.mensagem = "Erro ao cadastrar produto.";
      }
    },
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
  padding: 40px;
  border-radius: 12px;
  width: 80%;
  max-width: 600px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
  color: #fff;
  text-align: center;
}

.card h2 {
  margin-bottom: 25px;
  font-weight: 600;
  color: #60a5fa;
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.campo {
  display: flex;
  flex-direction: column;
  text-align: left;
}

label {
  font-weight: 600;
  margin-bottom: 5px;
  color: #cbd5e1;
}

input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #475569;
  background: #334155;
  color: #fff;
  font-size: 15px;
  outline: none;
  transition: border 0.3s, box-shadow 0.3s;
}

input:focus {
  border-color: #3b82f6;
  box-shadow: 0px 0px 8px rgba(59, 130, 246, 0.6);
}

.btn.salvar {
  margin-top: 15px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
}

.btn.salvar:hover {
  background: #2563eb;
}

.mensagem {
  margin-top: 15px;
  color: #93c5fd;
  font-weight: 500;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0 }
  to { opacity: 1 }
}
</style>
