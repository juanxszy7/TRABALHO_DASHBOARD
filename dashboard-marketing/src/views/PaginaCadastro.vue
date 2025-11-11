<template>
  <div class="container">
    <div class="card">
      <h2>Cadastro</h2>

      <form @submit.prevent="cadastrar">
        <div class="input-group">
          <label for="nome">Nome *</label>
          <input type="text" id="nome" v-model="nome"  />
        </div>

        <div class="input-group">
          <label for="email">Email *</label>
          <input type="email" id="email" v-model="email"  />
        </div>

        <div class="input-group">
          <label for="senha">Senha *</label>
          <input type="password" id="senha" v-model="senha"  />
        </div>

        <div class="input-group">
          <label for="senha">Origem *</label>
          
          <select v-model="origem">
            <option disabled value="">Como conheceu a loja?</option>
            <option>Instagram</option>
            <option>Google</option>
            <option>Facebook</option>
            <option>Indicação</option>
            <option>Outro</option>
          </select>
        </div>

        <button type="submit" class="btn">
          Cadastrar
        </button>
        <small class="mensagem">{{ mensagem }}</small>
      </form>
    </div>

    <Modal
      :show="modalAberto"
      titulo="Cadastro de Cliente"
      mensagem="Cliente cadastrado com sucesso"
      texto-confirmar="Ok"   
    />



  </div>
</template>

<script>
import api from '@/service/api';

export default {
  name: "Cadastro",
  data() {
    return {
      nome: "",
      email: "",
      senha: "",
      origem: "",
      mensagem: "",
    };
  },
  
  methods: {
    async cadastrar() {
    
        try {

            const novoUsuario = {
              nome: this.nome,
              email: this.email,
              senha: this.senha,
              origem: this.origem
            }
        
            const res = await api.post('/cadastro', novoUsuario)
        

            if (res) {

              this.mensagem = "Usuario cadastrado com sucesso"

              this.nome = "";
              this.email = "";
              this.senha = "";
              this.origem = "";
              
              
              this.$router.push("/clientes");
              
            
            }
            
            return this.mensagem
            

        } catch (error) {
            
            this.mensagem = "Erro ao cadastrar usuario"

            return this.mensagem

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

.mensagem{
    margin-top: 10;
}


select {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  background: #334155;
  border: none;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 15px;
  outline: none;
  transition: 0.3s;
}
</style>
