<template>
    <div class="container">
      <div class="card">
        <h2>Vendedores Cadastrados</h2>
  
        <!-- Estado de carregamento -->
        <p v-if="loading" class="status">Carregando clientes...</p>
  
        <!-- Mensagem de erro -->
        <p v-else-if="erro" class="status erro">{{ erro }}</p>

        <!-- <p v-else-if="usuarios.length >= 1">Nenhum cliente cadastrado</p> -->
  
        <!-- Tabela de usuários -->
        <table v-else class="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th colspan="2">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="vendedor in vendedores" :key="vendedor._id">
              <td>{{ vendedor._id }}</td>
              <td>{{ vendedor.nome }}</td>
              <td>{{ vendedor.email }}</td>
              <td><button class="excluir" @click=""><i class="bi bi-trash-fill"></i></button></td>
              <td><button class="editar" @click=""><i class="bi bi-pencil-fill"></i></button></td>
            </tr>
          </tbody>
        </table>
  
        <!-- Botões -->

        <div class="botoes">
            <button @click="carregarVendedores" class="btn atualizar">Recarregar Vendedores</button>
            <button @click="listaDeClientes" class="btn atualizar">Lista de Clientes</button>
            <button @click="listadeVendas" class="btn atualizar">Lista de Vendas</button>
        </div>
        
      </div>    

    </div>
    
  </template>
  
  <script>
  import api from "@/service/api";
  
  export default {
    name: "ListademDeVendedores",
    data() {
      return {
        vendedores: [],
        loading: false,
        erro: "",
        modalAberto: false,
        id: null,
      };
    },
    methods: {


      async carregarVendedores() {
        try {
          this.loading = true;
          this.erro = "";
  
          // Faz a requisição para o backend
          const res = await api.get("/vendedores");
  
          this.vendedores = res.data;


        } catch (error) {
          console.error(error);
          this.erro = "Erro ao carregar clientes.";
        } finally {
          this.loading = false;
        }
      },


    //   async excluirCliente(id){

    //     try {
            
    //         const res = await api.delete(`/clientes/${id}`)


    //         if (res) {
                
    //             this.usuarios = this.usuarios.filter(usuario => usuario._id !== id);

    //             this.modalAberto = false
                
    //         }

    //         return res

    //     } catch (err) {
            
    //         this.modalAberto = false

    //         return alert("Erro ao excluir cliente")

    //     }

    

      //},

      editarCliente(id){

        this.$router.push(`/editarUsuario/${id}`)

      },


      cadastrarClientes(){

        this.$router.push("/cadastro")

      },

      listaDeClientes(){

        this.$router.push('/clientes')

      },

      listadeVendas(){
        this.$router.push('/vendas')
      }



    },
    mounted() {
      this.carregarVendedores();
    },
  };
  </script>
  
  <style scoped>
  /* Fundo geral */
  .container {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    background: #0f172a;
    font-family: "Roboto", sans-serif;
    padding-top: 50px;
  }
  
  /* Card principal */
  .card {
    background: #1e293b;
    padding: 40px;
    border-radius: 12px;
    width: 80%;
    max-width: 800px;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
    color: #fff;
    text-align: center;
  }
  
  .card h2 {
    margin-bottom: 25px;
    font-weight: 600;
    color: #60a5fa;
  }
  
  /* Estado e mensagens */
  .status {
    color: #cbd5e1;
    font-size: 15px;
    margin-bottom: 10px;
  }
  
  .status.erro {
    color: #f87171;
  }
  
  /* Tabela */
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
  
  /* Botão recarregar */
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

  .botoes{
    display: flex;
    justify-content: center;
    gap: 20px;
  }

  </style>
  