import axios from "axios";

//Configuração do axios
const api = axios.create({
  baseURL: "http://localhost:3000" // URL do backend
});

export default api;
