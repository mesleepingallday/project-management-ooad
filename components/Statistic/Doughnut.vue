<script setup>
import { Doughnut } from "vue-chartjs";
import { ref } from "vue";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";

const dataStore = useDataStore();

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ArcElement
);

const labels = ["Backlog", "Todo", "Inprogress", "Completed"];

const chartData = ref({
  labels: labels.map((label) => label),
  datasets: [
    {
      data: labels.map((label) => {
        return dataStore.getTaskByStatus(label) || 0;
      }),
      backgroundColor: [
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(255, 205, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
      ],
      borderColor: [
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 99, 132, 0.5)",
        "rgba(255, 205, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
      ],
    },
  ],
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    myScale: {
      position: "left",
    },
  },
  plugins: {
    legend: {
      display: false,
      position: "bottom",
    },
  },
});
</script>

<template>
  <Doughnut
    :chart-data="chartData"
    :options="chartOptions"
    style="width: 70%; height: 60%"
  />
</template>
