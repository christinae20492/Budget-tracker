import type { MetaFunction } from "@remix-run/node";
import Layout from "~/components/ui/Layout";
import {
  getMonthlyExpenditureDetails,
} from "~/utils/expenses";
import {
  Expense,
  getEnvelopes,
  getLocalExpenses,
  getLocalIncome,
  Income,
} from "~/utils/localStorage";
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
    difference: 0,
  });
  const [spendingDetails, setSpendingDetails] = useState({
    highestEnvelope: '',
    highestAmount: 0,
    frequentLocation: '',
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
        difference: (details.incomeTotals || 0) - (details.expenseTotals || 0),
      });
      setSpendingDetails({
        highestEnvelope: details.highestEnvelope || 'n/a',
    highestAmount: details.highestSpendingAmount || 0,
    frequentLocation: details.highestSpendingLocation || 'n/a',
      })
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
          labels: ["Income", "Expenses", "Remainder"],
          datasets: [
            {
              data: [
                summary.incomeTotals,
                summary.expenseTotals,
                summary.difference,
              ],
              backgroundColor: ["#86bd75", "#DB6A6A", "#E4C04C"],
              hoverBackgroundColor: ["#45A049", "#E64A19", "#bdb775"],
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

  const savingsMessage =
  summary.difference > 0
    ? `🎉 Wow, you saved a lot of money this month! You still have $${summary.difference.toFixed(2)} left over after paying the month's debts.`

    : `😞 This month wasn't too good budget-wise. It looks like ${spendingDetails.frequentLocation} really got to you - you spent a total of $${spendingDetails.highestAmount} there this month.`;

  return (
    <Layout>
      <div>
        <h1 className="my-5 text-center">Your "At a Glance"</h1>
        <table className="comparison-table text-center mx-auto">
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
              <td>${summary.difference.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
        <div className="m-6">
          {savingsMessage}
        </div>
        <div className="chart-container mt-6">
          <canvas id="doughnutChart" />
        </div>
      </div>
    </Layout>
  );
}