<template>
    <div class="container">
      <div class="card">
        <h2>✏️ Editar Venda</h2>
  
        <form @submit.prevent="atualizarVenda">

            <div class="campo">
            <label>Cliente:</label>
            <select v-model="venda.cliente" required>
              <option disabled value="">Selecione o cliente</option>
              <option v-for="c in clientes" :key="c._id" :value="c._id">
                {{ c.nome }}
              </option>
            </select>
            </div>

          <!-- Produto -->
          <div class="campo">
            <label>Produto:</label>
            <input type="text" v-model="venda.produto" placeholder="Nome do produto" required />
          </div>
  
          <!-- Valor -->
          <div class="campo">
            <label>Valor:</label>
            <input type="number" v-model="venda.valor" placeholder="Valor da venda" required />
          </div>
  
          <!-- Vendedor -->
          <div class="campo">
            <label>Vendedor:</label>
            <select v-model="venda.vendedor" required>
              <option disabled value="">Selecione o vendedor</option>
              <option v-for="v in vendedores" :key="v._id" :value="v._id">
                {{ v.nome }}
              </option>
            </select>
          </div>
  
          <!-- Método de pagamento -->
          <div class="campo">
            <label>Método de Pagamento:</label>
            <select v-model="venda.metodoPagamento" required>
              <option disabled value="">Selecione</option>
              <option value="Pix">Pix</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
  
          <!-- Botão -->
          <button type="submit" class="btn atualizar">Salvar Alterações</button>
        </form>
  
        <!-- Mensagem -->
        <p v-if="mensagem" class="status">{{ mensagem }}</p>
      </div>
  
      <!-- Modal de confirmação -->
      <div v-if="mostrarModal" class="modal">
        <div class="modal-content">
          <h3>✅ Venda atualizada com sucesso!</h3>
          <p>As alterações foram salvas no sistema.</p>
          <button @click="fecharModal" class="btn confirmar">OK</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import api from "@/service/api";

export default {
  name: "EditarVenda",
  data() {
    return {
      venda: {
        cliente: "",
        produto: "",
        valor: "",
        vendedor: "",
        metodoPagamento: "",
      },
      vendedores: [],
      clientes: [],
      mensagem: "",
      mostrarModal: false,
    };
  },
  methods: {
    async carregarVenda() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/vendas/${id}`);
        this.venda = res.data;
      } catch (err) {
        console.error("Erro ao carregar venda:", err);
      }
    },

    async carregarVendedores() {
      try {
        const res = await api.get("/vendedores");
        this.vendedores = res.data;
      } catch (err) {
        console.error("Erro ao carregar vendedores:", err);
      }
    },

    async carregarClientes() {
      try {
        const res = await api.get("/clientes");
        this.clientes = res.data;
      } catch (err) {
        console.error("Erro ao carregar clientes:", err);
      }
    },

    async atualizarVenda() {
      try {
        const id = this.$route.params.id;
        await api.put(`/vendas/${id}`, this.venda);
        this.mostrarModal = true;
      } catch (err) {
        this.mensagem = "Erro ao atualizar a venda.";
      }
    },

    fecharModal() {
      this.mostrarModal = false;
      this.$router.push("/vendas");
    },
  },
  async mounted() {
    await this.carregarVenda();
    await this.carregarVendedores();
    await this.carregarClientes();
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
  }
  
  .card h2 {
    text-align: center;
    margin-bottom: 25px;
    color: #60a5fa;
    font-weight: 600;
  }
  
  .campo {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  label {
    color: #cbd5e1;
    margin-bottom: 6px;
    font-size: 15px;
  }
  
  input,
  select {
    padding: 10px;
    border-radius: 6px;
    border: none;
    background: #334155;
    color: #fff;
    font-size: 14px;
  }
  
  input:focus,
  select:focus {
    outline: 2px solid #3b82f6;
  }
  
  .btn.atualizar {
    background: #3b82f6;
    border: none;
    border-radius: 6px;
    padding: 12px 20px;
    color: #fff;
    cursor: pointer;
    font-size: 15px;
    transition: 0.3s;
    width: 100%;
  }
  
  .btn.atualizar:hover {
    background: #2563eb;
  }
  
  .status {
    text-align: center;
    margin-top: 15px;
    color: #a1a1aa;
  }
  
  /* Modal */
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(15, 23, 42, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background: #1e293b;
    padding: 30px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.5);
  }
  
  .modal-content h3 {
    color: #60a5fa;
    margin-bottom: 10px;
  }
  
  .modal-content p {
    color: #cbd5e1;
    margin-bottom: 20px;
  }
  
  .btn.confirmar {
    background: #3b82f6;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    color: white;
    cursor: pointer;
  }
  
  .btn.confirmar:hover {
    background: #2563eb;
  }
  </style>
  