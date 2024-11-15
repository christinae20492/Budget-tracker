import { useEffect, useState } from "react";
import Layout from "~/components/ui/Layout";
import { getMonthlyExpenditureDetails, totalSpend } from "~/utils/expenses";
import {
  getEnvelopes,
  getLocalExpenses,
  getLocalIncome,
} from "~/utils/localStorage";
import { warnToast } from "~/utils/toast";

export default function MonthlySummary() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const expenses = getLocalExpenses();
  const incomes = getLocalIncome();
  const envelopes = getEnvelopes();

  const [triggeredEnvelopes, setTriggeredEnvelopes] = useState(new Set());

  useEffect(() => {
    if (expenses.length && incomes.length && envelopes.length) {
      const details = getMonthlyExpenditureDetails(
        incomes,
        expenses,
        envelopes
      );
      setSummary(details);
      setIsLoading(false);
    }
  }, [expenses, incomes, envelopes]);

  useEffect(() => {
    envelopes.forEach((env) => {
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
  }, [envelopes, triggeredEnvelopes]);

  if (isLoading) {
    return <div>Loading Monthly Summary...</div>;
  }

  return (
    <Layout>
      <h1 className="text-center">Monthly Summary</h1>
      <div>
      <p>Total Income: ${summary.incomeTotals}</p>
      <p>Total Spending: ${summary.expenseTotals}</p>
      <p>Net Savings: ${summary.spendingDifference}</p>
      <p>Spending Compared to Last Month: ${summary.spendingComparison}</p>
      </div>
      <p>
        Category with Highest Spending: {summary.highestEnvelope} - $
        {summary.highestAmount}
      </p>
      <p>Most Frequent Purchases Category: {summary.frequentEnvelope}</p>
<h2 className="text-center">Envelope Budgets</h2>
      <div className="envelopes-summary">
        
        {envelopes.map((env) => {
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