<template>
    <div class="container">
      <div class="card">
        <h2>Cadastrar Venda</h2>
  
        <form @submit.prevent="cadastrarVenda" class="formulario">

          <div class="campo">
            <label>Cliente:</label>
            <select v-model="venda.cliente" required>
              <option disabled value="">Selecione um Cliente</option>
              <option
                v-for="c in clientes"
                :key="c._id"
                :value="c._id"
              >
                {{ c.nome }}
              </option>
            </select>
          </div>

          <div class="campo">
            <label>Produto:</label>
            <input
              type="text"
              v-model="venda.produto"
              placeholder="Digite o nome do produto"
              required
            />
          </div>
  
          <div class="campo">
            <label>Valor (R$):</label>
            <input
              type="number"
              step="0.01"
              v-model="venda.valor"
              placeholder="Digite o valor"
              required
            />
          </div>
  
          <div class="campo">
            <label>Vendedor:</label>
            <select v-model="venda.vendedor" required>
              <option disabled value="">Selecione um vendedor</option>
              <option
                v-for="v in vendedores"
                :key="v._id"
                :value="v._id"
              >
                {{ v.nome }}
              </option>
            </select>
          </div>
  
          <div class="campo">
            <label>Método de Pagamento:</label>
            <select v-model="venda.pagMetodo" required>
              <option disabled value="">Selecione o método</option>
              <option value="Pix">Pix</option>
              <option value="Débito">Débito</option>
              <option value="Crédito">Crédito</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
  
          <button type="submit" class="btn salvar">Cadastrar Venda</button>
        </form>
  
        <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/service/api"; // ajuste conforme sua estrutura
  
  export default {
    name: "CadastroNovaVenda",
    data() {
      return {
        venda: {
          cliente: "",
          produto: "",
          valor: "",
          vendedor: "",
          pagMetodo: "",
        },
        vendedores: [],
        clientes: [],
        mensagem: "",
      };
    },
    methods: {

      async carregarClientes(){

        try {
          const res = await api.get("/clientes");
          this.clientes = res.data;
        } catch (error) {
          console.error("Erro ao carregar clientes:", error);
        }

      },


      async carregarVendedores() {
        try {
          const res = await api.get("/vendedores");
          this.vendedores = res.data;
        } catch (error) {
          console.error("Erro ao carregar vendedores:", error);
        }
      },
  
      async cadastrarVenda() {
        try {
          const novaVenda = {
            cliente: this.venda.cliente,
            produto: this.venda.produto,
            valor: parseFloat(this.venda.valor),
            vendedor: this.venda.vendedor,
            pagMetodo: this.venda.pagMetodo,
          };
  
          if (novaVenda.valor < 0 ) {
            this.mensagem = "O valor da venda não pode ser abaixo de 0"
            return this.mensagem
          }

          const res = await api.post("/novaVenda", novaVenda);
  
          this.mensagem = res.data.message || "Venda cadastrada com sucesso!";
  
          // Limpa os campos
          this.venda = {
            cliente: "",
            produto: "",
            valor: "",
            vendedor: "",
            pagMetodo: "",
          };

          setTimeout(() => {

            this.$router.push('/vendas')

          }, 1000)


        } catch (error) {
          console.error(error);
          this.mensagem = "Erro ao cadastrar venda.";
        }
      },
    },
    mounted() {
      this.carregarClientes();
      this.carregarVendedores();
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
  
  input,
  select {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #475569;
    background: #334155;
    color: #fff;
    font-size: 15px;
    outline: none;
    transition: border 0.3s;
  }
  
  input:focus,
  select:focus {
    border-color: #3b82f6;
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
  }
  </style>
  