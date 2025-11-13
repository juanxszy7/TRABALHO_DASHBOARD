<template>
  <div class="container">
    <div class="card" :class="{ animar: animando }">
      <h2>Faturamento Mensal</h2>

      <p class="total-anual">
        Total Anual: 
        <strong>R$ {{ totalAnual.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) }}</strong>
      </p>

      <div class="acoes">
        <button @click="atualizarGrafico" class="botao">
          Atualizar Gráfico
        </button>
      </div>

      <div class="grafico-wrapper">
        <canvas id="graficoFaturamento"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import api from "@/service/api";

Chart.register(...registerables);

export default {
  name: "FaturamentoMensal",
  data() {
    return {
      meses: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ],
      grafico: null,
      animando: false,
      totalAnual: 0, 
    };
  },
  methods: {
    async carregarGrafico() {
      try {
        const res = await api.get("/faturamento-mensal");
        const dados = res.data;

        const valoresPorMes = Array(12).fill(0);
        dados.forEach(item => {
          valoresPorMes[Number(item._id) - 1] = item.total;
        });

        // 💡 Calcula o total anual
        this.totalAnual = valoresPorMes.reduce((a, b) => a + b, 0);

        const ctx = document
          .getElementById("graficoFaturamento")
          .getContext("2d");

        if (this.grafico) this.grafico.destroy();

        this.grafico = new Chart(ctx, {
          type: "line",
          data: {
            labels: this.meses,
            datasets: [
              {
                label: "Faturamento (R$)",
                data: valoresPorMes,
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.15)",
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: "#60a5fa",
                pointBorderColor: "#93c5fd",
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: { color: "#cbd5e1", font: { family: "Roboto" } },
                grid: { color: "rgba(148,163,184,0.15)" },
              },
              x: {
                ticks: { color: "#cbd5e1", font: { family: "Roboto" } },
                grid: { color: "rgba(148,163,184,0.1)" },
              },
            },
            plugins: {
              legend: {
                labels: { color: "#e2e8f0", font: { family: "Roboto" } },
              },
              tooltip: {
                callbacks: {
                  label: ctx => `R$ ${ctx.formattedValue}`,
                },
              },
            },
            animation: {
              duration: 1000,
              easing: "easeInOutQuart",
            },
          },
        });
      } catch (err) {
        console.error("❌ Erro ao carregar gráfico:", err);
      }
    },
    async atualizarGrafico() {
      this.animando = true;
      await this.carregarGrafico();
      setTimeout(() => (this.animando = false), 800);
    },
  },
  mounted() {
    this.carregarGrafico();
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap");

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: #0f172a;
  font-family: "Roboto", sans-serif;
  padding: 60px 20px;
  animation: fadeIn 0.8s ease forwards;
}

.card {
  background: #1e293b;
  border-radius: 16px;
  padding: 40px;
  width: 90%;
  max-width: 900px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.5);
  color: #e2e8f0;
  text-align: center;
  overflow: hidden;
  transition: all 0.6s ease;
}

.card.animar {
  transform: scale(1.02);
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.5);
}

.card h2 {
  margin-bottom: 10px;
  font-weight: 600;
  color: #60a5fa;
  font-size: 26px;
  text-shadow: 0 0 10px rgba(96, 165, 250, 0.5);
}

/* 💰 Estilo do total anual */
.total-anual {
  font-size: 18px;
  font-weight: 500;
  color: #38bdf8;
  margin-bottom: 20px;
  text-shadow: 0 0 8px rgba(56, 189, 248, 0.4);
}

.acoes {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.botao {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  color: #fff;
  padding: 10px 22px;
  font-size: 15px;
  border-radius: 10px;
  cursor: pointer;
  font-family: "Roboto", sans-serif;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.botao:hover {
  transform: translateY(-2px);
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.45);
}

.grafico-wrapper {
  position: relative;
  height: 420px;
  width: 100%;
  animation: fadeIn 1.2s ease;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
