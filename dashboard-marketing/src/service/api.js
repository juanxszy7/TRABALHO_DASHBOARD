import axios from "axios";

//Configuração do axios
const api = axios.create({
  baseURL: "http://localhost:3000" // URL do backend
});

// sempre que houver token salvo, colocar no header automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
