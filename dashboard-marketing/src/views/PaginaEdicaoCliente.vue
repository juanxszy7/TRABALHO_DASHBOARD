<template>
  <div class="container">
    <div class="card">
      <h2>✏️ Editar Usuário</h2>

      <form @submit.prevent="atualizarUsuario">
        <div class="campo">
          <label>Nome:</label>
          <input type="text" v-model="usuario.nome" placeholder="Digite o nome" required />
        </div>

        <div class="campo">
          <label>Email:</label>
          <input type="email" v-model="usuario.email" placeholder="Digite o email" required />
        </div>

        <div class="campo">
          <label>Senha:</label>
          <input type="password" v-model="usuario.senha" placeholder="Digite a nova senha" />
        </div>

        <div class="campo">
          <label>Admin:</label>
          <select v-model="adminSelecionado">
            <option value="false">Não</option>
            <option value="true">Sim</option>
          </select>
        </div>
        
        <div class="campo">
          <label>Origem:</label>
          <select v-model="usuario.origem">
            <option disabled value="">Como conheceu a loja?</option>
            <option>Instagram</option>
            <option>Google</option>
            <option>Facebook</option>
            <option>Indicação</option>
            <option>Outro</option>
          </select>
        </div>

        <div class="botoes">
          <button type="submit" class="btn salvar">Salvar</button>
          <button type="button" class="btn voltar" @click="voltarPagina">Voltar</button>
        </div>
      </form>
    </div>

    <!-- Modal -->
    <div v-if="mostrarModal" class="modal">
      <div class="modal-content">
        <h3>{{ modalTitulo }}</h3>
        <p>{{ modalMensagem }}</p>
        <button class="btn fechar" @click="fecharModal">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/service/api";

export default {
  name: "EditarUsuario",
  data() {
    return {
      usuario: { nome: "", email: "", senha: "", origem: "" },
      adminSelecionado: "false",
      mostrarModal: false,
      modalTitulo: "",
      modalMensagem: "",
    };
  },
  methods: {
    async atualizarUsuario() {
      try {
        const id = this.$route.params.id;
        const dadosAtualizados = {
          nome: this.usuario.nome,
          email: this.usuario.email,
          senha: this.usuario.senha,
          origem: this.usuario.origem,
          admin: this.adminSelecionado === "true",
        };
        const res = await api.put(`/editarUsuarios/${id}`, dadosAtualizados);
        this.modalTitulo = "✅ Sucesso!";
        this.modalMensagem = res.data.message || "Usuário atualizado com sucesso!";
        this.mostrarModal = true;
      } catch (error) {
        console.error(error);
        this.modalTitulo = "❌ Erro!";
        this.modalMensagem = "Erro ao atualizar o usuário.";
        this.mostrarModal = true;
      }
    },

    async carregarUsuario() {
      try {
        const id = this.$route.params.id;
        const res = await api.get(`/clientes/${id}`);
        this.usuario = res.data;
        this.adminSelecionado = this.usuario.admin ? "true" : "false";
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        this.modalTitulo = "❌ Erro!";
        this.modalMensagem = "Erro ao carregar os dados do usuário.";
        this.mostrarModal = true;
      }
    },

    voltarPagina() {
      this.$router.push("/clientes");
    },

    fecharModal() {
      this.mostrarModal = false;
      this.$router.push("/clientes");
    },
  },
  mounted() {
    this.carregarUsuario();
  },
};
</script>

<style scoped>
/* ===== CONTAINER E CARD ===== */
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
  max-width: 700px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
  color: #fff;
  text-align: center;
}

.card h2 {
  margin-bottom: 25px;
  font-weight: 600;
  color: #60a5fa;
}

/* ===== FORMULÁRIO ===== */
.campo {
  display: flex;
  flex-direction: column;
  margin-bottom: 18px;
  text-align: left;
}

label {
  font-weight: 500;
  color: #cbd5e1;
  margin-bottom: 6px;
}

input,
select {
  background: #334155;
  color: #e2e8f0;
  border: 1px solid #475569;
  border-radius: 8px;
  padding: 10px;
  font-size: 15px;
  transition: 0.3s;
}

input:focus,
select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.4);
}

/* ===== BOTÕES ===== */
.botoes {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 25px;
}

.btn {
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.btn.salvar {
  background: #3b82f6;
  color: white;
}

.btn.salvar:hover {
  background: #2563eb;
}

.btn.voltar {
  background: #9ca3af;
  color: white;
}

.btn.voltar:hover {
  background: #6b7280;
}

/* ===== MODAL ===== */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #1e293b;
  color: #fff;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  width: 90%;
  max-width: 400px;
  animation: aparecer 0.3s ease-in-out;
}

.modal-content h3 {
  color: #60a5fa;
  margin-bottom: 10px;
}

.modal-content p {
  margin-bottom: 20px;
  color: #cbd5e1;
}

.btn.fechar {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.3s;
}

.btn.fechar:hover {
  background-color: #2563eb;
}

/* ===== ANIMAÇÃO ===== */
@keyframes aparecer {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
