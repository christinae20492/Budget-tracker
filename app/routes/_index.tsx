import type { MetaFunction } from "@remix-run/node";
import Layout from "~/components/ui/Layout";
import {
  calculateTotal,
  getMonthlyExpenditureDetails,
} from "~/utils/expenses";
import {
  Expense,
  getEnvelopes,
  getLocalExpenses,
  getLocalIncome,
  Income,
} from "~/utils/localStorage";
import { Doughnut } from "react-chartjs-2";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export const meta: MetaFunction = () => {
  return [
    { title: "Budgeting" },
    { name: "description", content: "Budget App" },
  ];
};

export default function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [summary, setSummary] = useState({
    incomeTotals: 0,
    expenseTotals: 0,
    savings: 0,
  });
  const [spendingDetails, setSpendingDetails] = useState({
    highestEnvelope: '',
    highestAmount: 0,
    frequentEnvelope: '',
  });

  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    const fetchData = () => {
      const storedExpenses = getLocalExpenses();
      const storedIncomes = getLocalIncome();
      const details = getMonthlyExpenditureDetails(storedIncomes, storedExpenses);
      setExpenses(storedExpenses);
      setIncomes(storedIncomes);
      setSummary({
        incomeTotals: details.incomeTotals || 0,
        expenseTotals: details.expenseTotals || 0,
        savings: (details.incomeTotals || 0) - (details.expenseTotals || 0),
      });
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const ctx = document.getElementById("doughnutChart") as HTMLCanvasElement;
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["Income", "Expenses", "Savings"],
          datasets: [
            {
              data: [
                summary.incomeTotals,
                summary.expenseTotals,
                summary.savings,
              ],
              backgroundColor: ["#4CAF50", "#FF5722", "#2196F3"],
              hoverBackgroundColor: ["#45A049", "#E64A19", "#1976D2"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
          },
        },
      });
    }
  }, [summary]);

  return (
    <Layout>
      <div>
        <h1 className="my-5">Your Month - at a glance</h1>
        <table className="comparison-table">
          <thead>
            <tr>
              <th className="positive-item">Income</th>
              <th className="neg-item">Expenditure</th>
              <th className="difference">Difference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${summary.incomeTotals.toFixed(2)}</td>
              <td>${summary.expenseTotals.toFixed(2)}</td>
              <td>${summary.savings.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div>

        </div>
        <div className="chart-container mt-6">
          <canvas id="doughnutChart" />
        </div>
      </div>
    </Layout>
  );
}