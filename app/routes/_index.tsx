import type { MetaFunction } from "@remix-run/node";
import Layout from "~/components/ui/Layout";
import { calculateTotal, getMonthlyExpenditureDetails } from "~/utils/expenses";
import {
  Expense,
  getEnvelopes,
  getLocalExpenses,
  getLocalIncome,
  Income,
} from "~/utils/localStorage";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Budgeting" },
    { name: "description", content: "Budget App" },
  ];
};

export default function Index() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const envelopes = getEnvelopes();

  useEffect(() => {
    const storedExpenses = getLocalExpenses();
    const storedIncomes = getLocalIncome();
    setExpenses(storedExpenses);
    setIncomes(storedIncomes);
  }, []);

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
              <td>${calculateTotal(incomes, "income", "thisMonth")}</td>
              <td>${calculateTotal(expenses, "expense", "thisMonth")}</td>
              <td>
                $
                {calculateTotal(incomes, "income", "thisMonth") -
                  calculateTotal(expenses, "expense", "thisMonth")}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
