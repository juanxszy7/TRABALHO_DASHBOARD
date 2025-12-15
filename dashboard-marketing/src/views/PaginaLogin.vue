<template>
    <div class="container">
      <div class="card">
        <h2>Login</h2>
  
        <form @submit.prevent="logar">
          <div class="input-group">
            <label for="email">Email *</label>
            <input type="email" id="email" v-model="email" required />
          </div>
  
          <div class="input-group">
            <label for="senha">Senha *</label>
            <input type="password" id="senha" v-model="senha" required />
          </div>
  
          <button type="submit" class="btn">
            Entrar
          </button>
          <small class="mensagem">{{ mensagem }}</small>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import api from "@/service/api";
  
  export default {
    name: "PaginaLogin",
    data() {
      return {
        email: "",
        senha: "",
        mensagem: "",
      };
    },
    methods: {
      async logar() {
        try {
            const usuario = {
              email: this.email,
              senha: this.senha,
            };
        
            const res = await api.post("/login", usuario);
        
            
            if (res) {

              // PEGAR O TOKEN DO BACKEND
              const token = res.data.tokenLogin;
              // SALVAR NO LOCALSTORAGE
              sessionStorage.setItem("token", token);
              const { admin, userId } = res.data
              
              this.email = ""
              this.senha = ""
              
              
              if (admin == true) {
                  console.log(`Login efetuado, id de adiministrador: ${userId}`)
                  this.$router.push("/clientes")
              }else{
                  this.mensagem = "Pagina restrita para adminstradores"
              }

            }

            return this.mensagem
            
        }catch (error) {
            if (error.response && error.response.status === 404) {
                this.mensagem = "Usuário não encontrado.";
                return this.mensagem
            } else if (error.response && error.response.status === 401) {
                this.mensagem = "Senha incorreta.";
                return this.mensagem
            } else {
                this.mensagem = "Erro ao fazer login. Tente novamente.";
                return this.mensagem
            }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* Fundo geral */
  .container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #0f172a;
    font-family: "Roboto", sans-serif;
  }
  
  /* Card */
  .card {
    background: #1e293b;
    padding: 40px 50px;
    border-radius: 12px;
    width: 350px;
    box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
    color: #fff;
    text-align: center;
  }
  
  .card h2 {
    margin-bottom: 25px;
    font-weight: 600;
    color: #60a5fa;
  }
  
  /* Inputs */
  .input-group {
    width: 100%;
    margin-bottom: 20px;
    text-align: left;
  }
  
  .input-group label {
    font-size: 14px;
    color: #cbd5e1;
  }
  
  .input-group input {
    width: 100%;
    padding: 10px;
    margin-top: 5px;
    background: #334155;
    border: none;
    border-radius: 6px;
    color: #fff;
    outline: none;
    transition: 0.3s;
  }
  
  .input-group input:focus {
    background: #475569;
    box-shadow: 0 0 5px #3b82f6;
  }
  
  /* Botão */
  .btn {
    width: 100%;
    padding: 12px;
    background: #3b82f6;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    color: #fff;
    cursor: pointer;
    transition: 0.3s;
  }
  
  .btn:hover {
    background: #2563eb;
  }
  
  /* Mensagem */
  .mensagem {
    display: block;
    margin-top: 10px;
    color: #93c5fd;
    font-size: 14px;
  }
  </style>
  