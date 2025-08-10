import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const ScoreLineChart = ({ score }) => {
  const data = {
    labels: ["Prev 4", "Prev 3", "Prev 2", "Prev 1", "Current"],
    datasets: [
      {
        label: "Accessibility Score",
        data: [70, 75, 80, 85, score],
        borderColor: "#4caf50",
        backgroundColor: "#4caf50",
        tension: 0.3,
        fill: false,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { min: 0, max: 100 } }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-4">Score Trend</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default ScoreLineChart;
