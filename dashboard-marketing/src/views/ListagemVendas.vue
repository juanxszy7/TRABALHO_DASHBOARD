<template>
    <div class="container">
      <div class="card">
        <h2>Listagem de Vendas</h2>
  
        <!-- Estado de carregamento -->
        <p v-if="loading" class="status">Carregando vendas...</p>
  
        <!-- Mensagem de erro -->
        <p v-else-if="erro" class="status erro">{{ erro }}</p>
  
        <!-- Nenhuma venda encontrada -->
        <p v-else-if="vendas.length === 0" class="status">Nenhuma venda registrada.</p>
  
        <!-- Tabela de vendas -->
        <table v-else class="tabela">
          <thead>
            <tr>
              <th>Id</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Valor (R$)</th>
              <th>Vendedor</th>
              <th>Metodo de Pagamento</th>
              <th>Data da Venda</th>
              <th colspan="2">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="venda in vendas" :key="venda._id">
              <td>{{ venda._id }}</td>
              <td>{{ venda.cliente?.nome || '—' }}</td>
              <td>{{ venda.produto }}</td>
              <td>{{ formatarValor(venda.valor) }}</td>
              <td>{{ venda.vendedor?.nome || '—' }}</td>
              <td>{{ venda.pagMetodo }}</td>
              <td>{{ formatarData(venda.dataVenda) }}</td>
              <td><button class="excluir" @click="excluirVenda(venda._id)"><i class="bi bi-trash-fill"></i></button></td>
              <td><button class="editar" @click="editarVenda(venda._id)"><i class="bi bi-pencil-fill"></i></button></td>
            </tr>
          </tbody>
        </table>
  
        <div class="botoes">
          <button class="btn atualizar" @click="carregarVendas">Atualizar Vendas</button>
          <button class="btn atualizar" @click="novaVenda">Cadastrar Venda</button>
          <button class="btn atualizar" @click="listaCLientes">Lista de Clientes</button>
          <button class="btn atualizar" @click="listaVendedores">Lista de Vendedores</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/service/api"; 
  
  export default {
    name: "ListarVendas",
    data() {
      return {
        vendas: [],
        loading: false,
        erro: "",
      };
    },
    methods: {
      async carregarVendas() {
        this.loading = true;
        this.erro = "";

        try {
          const res = await api.get("/vendas");
          this.vendas = res.data;
        } catch (error) {
          console.error(error);
          this.erro = "Erro ao carregar as vendas.";
        } finally {
          this.loading = false; 
        }
      },

  
      formatarValor(valor) {
        return Number(valor).toFixed(2).replace(".", ",");
      },
  
      formatarData(data) {
        const d = new Date(data);
        return d.toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      },

      novaVenda(){

        this.$router.push('/novaVenda')

      },

      listaCLientes(){

        this.$router.push('/clientes')

      },
      
      listaVendedores(){

        this.$router.push('/vendedores')

      },

      async excluirVenda(id){

        try {
          
          const res = await api.delete(`/vendas/${id}`)

          if (res) {
            
            this.vendas = this.vendas.filter(venda => venda._id !== id);
            return res

          }


        } catch (err) {
          
          console.error(err.response || err)
          return alert("Erro ao excluir venda")

        }

      },


      editarVenda(id){

        this.$router.push(`/editarVenda/${id}`)

      }

    },
  
    mounted() {
      this.carregarVendas();
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
    max-width: 1100px;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
    color: #fff;
    text-align: center;
  }
  
  .card h2 {
    margin-bottom: 25px;
    font-weight: 600;
    color: #60a5fa;
  }
  
  .status {
    color: #cbd5e1;
    font-size: 15px;
    margin-bottom: 10px;
  }
  
  .status.erro {
    color: #f87171;
  }
  
  .tabela {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
    background: #334155;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .tabela th,
  .tabela td {
    padding: 12px 15px;
    border-bottom: 1px solid #475569;
    text-align: left;
    color: #e2e8f0;
    font-size: 14px;
  }
  
  .tabela th {
    background-color: #3b82f6;
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
  }
  
  .tabela tr:hover {
    background: #475569;
    transition: 0.3s;
  }
  
  .btn.atualizar {
    margin-top: 20px;
    background: #3b82f6;
    border: none;
    border-radius: 6px;
    padding: 12px 20px;
    font-size: 15px;
    color: #fff;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .btn.atualizar:hover {
    background: #2563eb;
  }
  
  .botoes {
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  .excluir{
    background-color: red;
    border: none;
    color: white;
    padding: 10px;
    border-radius: 100%;
    cursor: pointer;
  }

  .editar{
    color: white;
    background-color: #ebbc00;
    border: none;
    padding: 10px;
    border-radius: 100%;
    cursor: pointer;
  }
  </style>
  