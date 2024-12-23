import { useEffect, useState } from "react";
import Layout from "~/components/ui/Layout";
import { getYearlyExpenditureDetails } from "~/utils/expenses";
import {
  getLocalExpenses,
  getLocalIncome,
} from "~/utils/localStorage";

export default function YearlySummary() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());

  const expenses = getLocalExpenses();
  const incomes = getLocalIncome();

  useEffect(() => {
    if (expenses.length && incomes.length) {
      const details = getYearlyExpenditureDetails(incomes, expenses, year);
      setSummary(details);
      setIsLoading(false);
    }
  }, [expenses, incomes, year]);

  if (isLoading) {
    return <div>Loading Yearly Summary...</div>;
  }

  return (
    <Layout>
      <h1 className="text-center">Yearly Summary</h1>
      <div className="text-center my-5">
        <h3 className="text-gray-400"><button onClick={() => setYear(year - 1)}>Previous Year</button></h3>
        <h3><span>{year}</span></h3>
        <h3 className="text-gray-400"><button onClick={() => setYear(year + 1)}>Next Year</button></h3>
      </div>
      <div>
        <p>Total Income: ${summary.incomeTotals}</p>
        <p>Total Spending: ${summary.expenseTotals}</p>
        <p>Net Savings: ${summary.spendingDifference}</p>
      </div>
      <p>
        Category with Highest Spending: {summary.highestEnvelope} - $
        {summary.highestAmount}
      </p>
      <p>Most Frequent Purchases Category: {summary.frequentEnvelope}</p>
    </Layout>
  );
}