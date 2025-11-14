<template>
  <div class="container">
    <div class="card">
      <h2>Clientes Cadastrados</h2>

      <p v-if="loading" class="status">Carregando clientes...</p>
      <p v-else-if="erro" class="status erro">{{ erro }}</p>

      <table v-else class="tabela">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Origem</th>
            <th colspan="2">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="usuario in usuarios" :key="usuario._id">
            <td>{{ usuario._id }}</td>
            <td>{{ usuario.nome }}</td>
            <td>{{ usuario.email }}</td>
            <td>{{ usuario.origem }}</td>
            <td>
              <button class="excluir" @click="abrirModalConfirmacao(usuario._id)">
                <i class="bi bi-trash-fill"></i>
              </button>
            </td>
            <td>
              <button class="editar" @click="editarCliente(usuario._id)">
                <i class="bi bi-pencil-fill"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="botoes">
        <button @click="carregarUsuarios" class="btn atualizar">Recarregar Clientes</button>
        <button @click="cadastrarClientes" class="btn atualizar">Cadastrar Clientes</button>
        <button @click="listaDeVendedores" class="btn atualizar">Lista de Vendedores</button>
        <button @click="listadeVendas" class="btn atualizar">Lista de Vendas</button>
      </div>
    </div>

    <!-- MODAL DE CONFIRMAÇÃO -->
  <transition name="fade-blur">
    <div v-if="modalConfirmacaoAberto" class="modal-overlay">
      <div class="modal">
        <h3>Tem certeza que deseja excluir este cliente?</h3>
        <p>Essa ação não pode ser desfeita.</p>

        <div class="modal-buttons">
          <button class="cancelar" @click="modalConfirmacaoAberto = false">Cancelar</button>
          <button class="confirmar" @click="confirmarExclusao">Excluir</button>
        </div>
      </div>
    </div>
  </transition>

  <!-- MODAL DE SUCESSO -->
  <transition name="fade-blur">
    <div v-if="modalSucessoAberto" class="modal-overlay">
      <div class="modal">
        <h3>Cliente excluído com sucesso!</h3>

        <div class="modal-buttons">
          <button class="confirmar" @click="modalSucessoAberto = false">OK</button>
        </div>
      </div>
    </div>
  </transition>


  </div>
</template>

  
  <script>
import api from "@/service/api";

export default {
  name: "ListademDeClientes",
  data() {
    return {
      usuarios: [],
      loading: false,
      erro: "",
      modalConfirmacaoAberto: false,
      modalSucessoAberto: false,
      clienteSelecionado: null,
    };
  },
  methods: {
    async carregarUsuarios() {
      try {
        this.loading = true;
        this.erro = "";

        const res = await api.get("/clientes");
        this.usuarios = res.data;

      } catch (error) {
        this.erro = "Erro ao carregar clientes.";
      } finally {
        this.loading = false;
      }
    },

    // Abre modal e guarda o ID
    abrirModalConfirmacao(id) {
      this.clienteSelecionado = id;
      this.modalConfirmacaoAberto = true;
    },

    // Confirma exclusão
    async confirmarExclusao() {
      try {
        const res = await api.delete(`/clientes/${this.clienteSelecionado}`);

        this.usuarios = this.usuarios.filter(
          (usuario) => usuario._id !== this.clienteSelecionado
        );

        this.modalConfirmacaoAberto = false;
        this.modalSucessoAberto = true;

      } catch (err) {
        alert("Erro ao excluir cliente");
      }
    },

    editarCliente(id) {
      this.$router.push(`/editarUsuario/${id}`);
    },

    cadastrarClientes() {
      this.$router.push("/cadastro");
    },

    listaDeVendedores() {
      this.$router.push("/vendedores");
    },

    listadeVendas() {
      this.$router.push("/vendas");
    },
  },

  mounted() {
    this.carregarUsuarios();
  },
};
</script>

  
  <style scoped>
/* --- FUNDO GERAL --- */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #0f172a;
  font-family: "Roboto", sans-serif;
  padding-top: 50px;
}

/* Card */
.card {
  background: #1e293b;
  padding: 40px;
  border-radius: 12px;
  width: 80%;
  max-width: 900px;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.4);
  color: #fff;
  text-align: center;
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

/* Botões */
.excluir {
  background-color: red;
  border: none;
  color: white;
  padding: 10px;
  border-radius: 100%;
  cursor: pointer;
}

.editar {
  color: white;
  background-color: #ebbc00;
  border: none;
  padding: 10px;
  border-radius: 100%;
  cursor: pointer;
}

.botoes {
  display: flex;
  justify-content: center;
  gap: 20px;
}

/* ===================== MODAL ===================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}

.modal {
  background: #1e293b;
  padding: 30px;
  border-radius: 12px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.3);
}

.modal h3 {
  margin-bottom: 15px;
  color: #60a5fa;
}

.modal p{
  color: white;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 20px;
}

.confirmar {
  background: #3b82f6;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.cancelar {
  background: #ef4444;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}

.confirmar:hover {
  background: #2563eb;
}

.cancelar:hover {
  background: #dc2626;
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

  /* ===================== OVERLAY COM BLUR ===================== */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.55); /* tom escuro + transparência */
  backdrop-filter: blur(8px);         /* BLUR PRINCIPAL */
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;

  animation: fadeInBlur 0.3s ease forwards;
}

/* Modal */
.modal {
  background: rgba(30, 41, 59, 0.9);
  padding: 30px;
  border-radius: 14px;
  width: 350px;
  text-align: center;
  box-shadow: 0px 0px 25px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
  animation: zoomIn 0.25s ease forwards;
}

/* ==========================
   ANIMAÇÃO GRADUAL DO BLUR
   ========================== */

/* Entrada do overlay + blur */
.fade-blur-enter-active {
  animation: blurIn 0.35s ease forwards;
}

/* Saída do overlay + removendo o blur gradualmente */
.fade-blur-leave-active {
  animation: blurOut 0.35s ease forwards;
}

/* Entrada e saída do modal (zoom suave) */
.fade-blur-enter-active .modal,
.fade-blur-leave-active .modal {
  animation: zoomIn 0.25s ease forwards;
}

.fade-blur-leave-active .modal {
  animation: zoomOut 0.25s ease forwards;
}

/* ======== KEYFRAMES ======== */

@keyframes blurIn {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

@keyframes blurOut {
  from {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
  to {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes zoomOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}


</style>

  