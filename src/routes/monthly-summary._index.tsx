import { useEffect, useState } from "react";
import Layout from "src/components/ui/Layout";
import { getMonthlyExpenditureDetails, totalSpend } from "src/utils/expenses";
import {
  getEnvelopes,
  getLocalExpenses,
  getLocalIncome,
} from "src/utils/localStorage";
import { filterCurrentMonthExpenses } from "src/utils/expenses"; // Utility for filtering
import { warnToast } from "src/utils/toast";
import { Link } from "@remix-run/react";

export default function MonthlySummary() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [currentExpenses, setCurrentExpenses] = useState([]);
  const [currentIncomes, setCurrentIncomes] = useState([]);
  const [currentEnvelopes, setCurrentEnvelopes] = useState([]);

  const [triggeredEnvelopes, setTriggeredEnvelopes] = useState(new Set());

  useEffect(() => {
    const loadData = async () => {
      const rawExpenses = getLocalExpenses();
      const rawIncomes = getLocalIncome();
      const rawEnvelopes = getEnvelopes();

      const filteredExpenses = filterCurrentMonthExpenses(rawExpenses);
      const filteredEnvelopes = rawEnvelopes.map((env) => ({
        ...env,
        expenses: filterCurrentMonthExpenses(env.expenses || []),
      }));

      setCurrentExpenses(filteredExpenses);
      setCurrentIncomes(rawIncomes);
      setCurrentEnvelopes(filteredEnvelopes);
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    if (currentEnvelopes.length) {
      currentEnvelopes.forEach((env) => {
        const totalSpent = totalSpend(env);
        const isOverBudget = env.fixed && totalSpent > env.budget;
        const isCloseToBudget = env.fixed && env.budget - totalSpent <= 30;

        if (!triggeredEnvelopes.has(env.title)) {
          if (isOverBudget) {
            warnToast(`${env.title}'s budget has been exceeded for this month!`);
            setTriggeredEnvelopes((prev) => new Set(prev).add(env.title));
          } else if (isCloseToBudget) {
            warnToast(`${env.title} is close to exceeding the budget!`);
            setTriggeredEnvelopes((prev) => new Set(prev).add(env.title));
          }
        }
      });
    }
  }, [currentEnvelopes, triggeredEnvelopes]);

  useEffect(() => {
    if (
      currentExpenses.length > 0 &&
      currentIncomes.length > 0 &&
      currentEnvelopes.length > 0
    ) {
      const details = getMonthlyExpenditureDetails(
        currentIncomes,
        currentExpenses,
        currentEnvelopes
      );
      setSummary(details);
    }
  }, [currentExpenses, currentIncomes, currentEnvelopes]);

  if (isLoading) {
    return <div>Loading Monthly Summary...</div>;
  }

  return (
    <Layout>
      <h1 className="text-center">Monthly Summary</h1>
      <h3 className="text-right p-3 text-green-dark hover:text-green"><Link to={"/monthly-summary/year-review"}>View the Year</Link></h3>
      <h3 className="text-right p-3 text-green-dark hover:text-green"><Link to={"/monthly-summary/manage-expenses"}>Manage Expenses</Link></h3>
      <div>
        <p>Total Income: ${summary?.incomeTotals ?? 0}</p>
        <p>Total Spending: ${summary?.expenseTotals ?? 0}</p>
        <p>Net Savings: ${summary?.spendingDifference ?? 0}</p>
        <p>Spending Compared to Last Month: ${summary?.spendingComparison ?? 0}</p>
      </div>
      <p>
        Category with Highest Spending: {summary?.highestEnvelope} - $
        {summary?.highestAmount}
      </p>
      <p>Most Frequent Purchases Category: {summary?.frequentEnvelope}</p>

      <h2 className="text-center mt-4">Envelope Budgets</h2>
      <div className="envelopes-summary">
        {currentEnvelopes.map((env) => {
          const totalSpent = totalSpend(env);
          const isOverBudget = env.fixed && totalSpent > env.budget;

          return (
            <div
              key={env.title}
              className={`summary-envelope ${
                isOverBudget ? "text-red font-bold" : ""
              }`}
            >
              <p>
                {env.title}: ${totalSpent} / ${env.budget}
              </p>
              <div className="expense-list pl-4 mt-2">
                {env.expenses?.map((expense, idx) => (
                  <p key={idx} className="expense-item text-gray-700">
                    {expense.location}: ${expense.amount}
                  </p>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}