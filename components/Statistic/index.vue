<script setup>
const tabData = ref([
  {
    name: "Doughnut",
    value: "doughnut",
    isActive: true,
    id: 1,
  },
  {
    name: "Line",
    value: "line",
    isActive: false,
    id: 2,
  },
  {
    name: "PolarArea",
    isActive: false,
    value: "polarArea",
    id: 3,
  },
  {
    name: "Bar",
    isActive: false,
    value: "bar",
    id: 4,
  },
]);

const tabHandler = (id) => {
  tabData?.value?.forEach((item) => {
    if (item.id == id) return (item.isActive = true);
    item.isActive = false;
  });
};

const labels = ["Backlog", "Pending", "In Progress", "Completed"];
const dataStore = useDataStore();

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
  <div
    class="w-[90%] lg:w-[50%] hidden lg:flex rounded-2xl px-5 flex-col bg-[#121212] items-center text-white"
  >
    <h1 class="text-2xl text-start">Statistic</h1>
    <div class="w-full mt-3 mb-3 text-start">
      <SharedButton
        v-for="data in tabData"
        :text="data.name"
        class="px-1 mr-2 py-1 cursor-pointer hover:text-[#5293ee]"
        :class="data.isActive ? 'text-[#5293ee]' : ''"
        :handler="() => tabHandler(data.id)"
      >
      </SharedButton>
    </div>
    <Chart
      :type="tabData.find((item) => item.isActive).value"
      :data="chartData"
      :options="chartOptions"
      class="w-4/6 h-3/5 md:w-[30rem]"
    />
  </div>
</template>
