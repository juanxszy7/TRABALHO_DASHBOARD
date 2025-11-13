<template>
  <div class="container">
    <div class="card">
      <h2>📊 Como os Clientes Encontraram a Loja</h2>

      <div v-if="carregando" class="status">Carregando dados...</div>
      <div v-if="erro" class="status erro">{{ erro }}</div>

      <div v-if="totalClientes > 0" class="status total">
        Total de respostas: <strong>{{ totalClientes }}</strong>
      </div>

      <transition name="fade-slide">
        <div v-if="!carregando && !erro && chartData" class="graficos">
          <!-- Gráfico de Pizza -->
          <div class="grafico">
            <h3>Distribuição por Origem (%)</h3>
            <Pie
              :data="chartData"
              :options="chartOptionsPizza"
              :key="'pie' + chartData.labels.length"
            />

            <!-- Legendas personalizadas -->
            <div class="legendas">
              <div
                v-for="(label, index) in chartData.labels"
                :key="index"
                class="legenda-item"
              >
                <span
                  class="cor-legenda"
                  :style="{ backgroundColor: chartData.datasets[0].backgroundColor[index] }"
                ></span>
                <span class="texto-legenda">
                  {{ label }} —
                  {{
                    (
                      (chartData.datasets[0].data[index] / totalClientes) *
                      100
                    ).toFixed(1)
                  }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Gráfico de Barras -->
          <div class="grafico">
            <h3>Comparativo por Quantidade</h3>
            <Bar
              :data="chartData"
              :options="chartOptionsBar"
              :key="'bar' + chartData.labels.length"
            />
          </div>
        </div>
      </transition>

      <button class="btn atualizar" @click="carregarDados">
        Atualizar Dados
      </button>
    </div>
  </div>
</template>

<script>
import { Pie, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import api from "@/service/api";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "OrigemClientes",
  components: { Pie, Bar },
  data() {
    return {
      chartData: null,
      chartOptionsBar: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
          y: { ticks: { color: "#cbd5e1" }, grid: { color: "#334155" } },
        },
      },
      chartOptionsPizza: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }, // usamos legendas personalizadas
          tooltip: {
            callbacks: {
              label: (context) => {
                const dataset = context.dataset;
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const valor = dataset.data[context.dataIndex];
                const porcentagem = ((valor / total) * 100).toFixed(1);
                return `${context.label}: ${valor} (${porcentagem}%)`;
              },
            },
          },
        },
      },
      carregando: true,
      erro: null,
      totalClientes: 0,
    };
  },
  methods: {
    async carregarDados() {
      this.carregando = true;
      this.erro = null;
      try {
        const res = await api.get("/estatisticas");
        console.log("Dados recebidos:", res.data);

        const dados = res.data;
        if (!Array.isArray(dados) || dados.length === 0) {
          this.erro = "Nenhum dado encontrado.";
          this.carregando = false;
          return;
        }

        this.totalClientes = dados.reduce((acc, d) => acc + d.total, 0);

        this.chartData = {
          labels: dados.map((d) => d._id || "Não Informado"),
          datasets: [
            {
              label: "Clientes",
              backgroundColor: [
                "#3b82f6",
                "#22c55e",
                "#eab308",
                "#f97316",
                "#ef4444",
                "#8b5cf6",
              ],
              data: dados.map((d) => d.total),
            },
          ],
        };
      } catch (err) {
        console.error("❌ Erro ao carregar dados:", err);
        this.erro = "Erro ao carregar dados do servidor.";
      } finally {
        this.carregando = false;
      }
    },
  },
  mounted() {
    this.carregarDados();
  },
};
</script>

<style scoped>
/* 🌌 Fundo geral */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  font-family: "Roboto", sans-serif;
  padding: 60px 15px;
  color: #e2e8f0;
  box-sizing: border-box;
}

/* 📦 Card principal */
.card {
  background: rgba(30, 41, 59, 0.95);
  padding: 40px;
  border-radius: 20px;
  width: 100%;
  max-width: 1100px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  text-align: center;
  transition: transform 0.3s ease;
  overflow: hidden;
  box-sizing: border-box;
}

.card:hover {
  transform: translateY(-3px);
}

.card h2 {
  margin-bottom: 25px;
  font-weight: 700;
  color: #60a5fa;
  letter-spacing: 1px;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.3);
  word-wrap: break-word;
}

/* 💬 Mensagens e status */
.status {
  color: #cbd5e1;
  font-size: 15px;
  margin-bottom: 10px;
}

.status.erro {
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 8px;
  padding: 10px;
}

.status.total {
  font-size: 16px;
  margin-bottom: 25px;
  color: #a5b4fc;
  background: rgba(79, 70, 229, 0.1);
  border-radius: 8px;
  padding: 8px 12px;
  display: inline-block;
}

/* 📊 Gráficos container */
.graficos {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 30px;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* 🧭 Gráfico individual */
.grafico {
  background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 480px;
  min-width: 300px;
  height: auto;
  min-height: 380px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4);
  position: relative;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.grafico:hover {
  box-shadow: 0 0 35px rgba(59, 130, 246, 0.3);
  transform: translateY(-5px);
}

.grafico h3 {
  color: #93c5fd;
  margin-bottom: 15px;
  font-weight: 600;
  font-size: 17px;
  text-align: center;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Ajuste do gráfico Canvas */
.grafico canvas {
  max-width: 100%;
  height: 260px !important;
  object-fit: contain;
}

/* 🧭 Legendas personalizadas */
.legendas {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 12px;
  border-top: 1px solid #475569;
  padding-top: 10px;
  max-height: 120px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #475569 transparent;
}

.legenda-item {
  display: flex;
  align-items: center;
  margin: 3px 0;
  transition: transform 0.2s ease, color 0.2s ease;
}

.legenda-item:hover {
  transform: translateX(4px);
  color: #60a5fa;
}

.cor-legenda {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  margin-right: 8px;
  box-shadow: 0 0 6px rgba(255, 255, 255, 0.2);
}

.texto-legenda {
  font-size: 14px;
  color: #e2e8f0;
  line-height: 1.2;
  word-break: break-word;
}

/* 🔘 Botão Atualizar */
.btn.atualizar {
  margin-top: 40px;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 8px;
  padding: 12px 26px;
  font-size: 15px;
  font-weight: 500;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
}

.btn.atualizar:hover {
  background: linear-gradient(90deg, #2563eb, #1d4ed8);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
}

/* ✨ Animação Fade/Slide */
.fade-slide-enter-active {
  animation: fadeSlideIn 0.8s ease forwards;
}
.fade-slide-leave-active {
  animation: fadeSlideOut 0.5s ease forwards;
}

@keyframes fadeSlideIn {
  0% {
    opacity: 0;
    transform: translateY(40px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeSlideOut {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
}

/* 📱 Responsividade */
@media (max-width: 950px) {
  .graficos {
    flex-direction: column;
    align-items: center;
  }

  .grafico {
    width: 90%;
    max-width: 500px;
    height: auto;
  }

  .grafico canvas {
    height: 240px !important;
  }

  .card {
    padding: 30px;
  }

  .card h2 {
    font-size: 20px;
  }
}
</style>
