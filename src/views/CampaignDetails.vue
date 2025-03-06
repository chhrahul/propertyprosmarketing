<!-- <script setup>
import { defineProps, computed } from "vue";
import { BarChart } from "vue-chart-3";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const props = defineProps({
  campaigns: Array, // Receive campaigns data as a prop
});

const chartData = computed(() => ({
  labels: props.campaigns.map(c => c.campaign_name),
  datasets: [
    {
      label: "Clicks",
      data: props.campaigns.map(c => c.visitors_count),
      backgroundColor: "rgba(75, 192, 192, 0.5)",
    },
    {
      label: "Leads",
      data: props.campaigns.map(c => c.leads_count),
      backgroundColor: "rgba(255, 159, 64, 0.5)",
    },
    {
      label: "Conversions",
      data: props.campaigns.map(c => c.sales_count),
      backgroundColor: "rgba(54, 162, 235, 0.5)",
    },
  ],
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
};
</script>

<template>
  <div class="bg-white shadow-md rounded-lg p-4">
    <h2 class="text-xl font-bold mb-4">Campaign Performance</h2>
    <div class="h-80">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template> -->


<template>
  <h1>Campaign DEtails</h1>
</template>