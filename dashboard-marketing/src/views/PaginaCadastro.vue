<template>
  
  <div>

    <div class="container">

      <div>

        <form action="" class="formulario">

          <div class="tituloForm">
            <h1>Cadastre-se</h1>
          </div>

          <div class="camposForm">
            <label for="nome">Nome:</label>
            <input type="text" name="nome">
          </div>

          <div class="camposForm">
            <label for="email">Email:</label>
            <input type="email" name="email">
          </div>

          <div class="camposForm">
            <label for="senha">Senha:</label>
            <input type="password" name="senha">
          </div>
          
          <div class="camposForm">
            <button type="submit">Cadastrar</button>
          </div>

        </form>

      </div>

    </div>

  </div>

</template>

<script>
export default{
  name:'PaginaCadastro'
}
</script>

<style>

/* Fundo da página */
body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Container principal */
.container {
  background: #ffffff;
  width: 420px;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.2);
  animation: fadeIn .5s ease-in-out;
}

/* Formulário */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tituloForm{
  text-align: center;
}

.camposForm {
  display: flex;
  flex-direction: column;
}

.camposForm label {
  font-size: 14px;
  color: #333;
  margin-bottom: 6px;
  font-weight: 600;
}

.camposForm input {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #bdbdbd;
  font-size: 15px;
  transition: 0.3s;
}

.camposForm input:focus {
  border-color: #3a7bd5;
  outline: none;
  box-shadow: 0 0 5px rgba(58, 123, 213, 0.4);
}

/* Botão de enviar */
button {
  width: 100%;
  padding: 14px;
  background-color: #3a7bd5;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
  margin-top: 10px;
}

button:hover {
  background-color: #2a5fa0;
}

/* Animação */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsividade */
@media (max-width: 480px) {
  .container {
    width: 90%;
  }
}

</style>
