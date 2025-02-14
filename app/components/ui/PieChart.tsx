import React, { useEffect, useRef } from "react";
import { totalSpend } from "~/utils/expenses";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import { envelopeColorsList } from "~/utils/colors";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  envelopeData: { title: string; amount: number; color: string; }[];
}

const PieChart: React.FC<PieChartProps> = ({ envelopeData }) => {
  const chartRef = useRef<ChartJS | null>(null);

  const labels = envelopeData.map((e) => e.title);
  const dataValues = envelopeData.map((e) => totalSpend(e));

  const data = {
    labels,
    datasets: [
      {
        label: "Spending",
        data: dataValues,
        backgroundColor: envelopeData.map((envelope) => envelope.color),
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  return (
    <Pie
      data={data}
      ref={(chart) => {
        if (chart) {
          chartRef.current = chart.chartInstance;
        }
      }}
    />
  );
};

export default PieChart;