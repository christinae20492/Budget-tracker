import { MetaFunction, useParams, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getLocalExpenses, getLocalIncome } from "~/utils/localStorage";

export const meta: MetaFunction = () => {
  return [
    { title: "Day's Details" },
    { name: "description", content: "Details for the selected day." },
  ];
};

export const loader: LoaderFunction = async ({ params }) => {
  const currentDate = params.date;
  if (!currentDate) {
    throw new Response("Date not found", { status: 404 });
  }
  return json({ date: currentDate });
};

export default function DayDetails() {
  const { date } = useLoaderData<{ date: string }>();
  const expenses = getLocalExpenses().filter(expense => expense.date === date);
  const incomes = getLocalIncome().filter(income => income.date === date);

  return (
    <div className="details-page">
      <h1>Details for {date}</h1>
      <h2>Expenses</h2>
      <ul>
        {expenses.length > 0 ? (
          expenses.map(expense => (
            <li key={expense.id}>
              {expense.location} - ${expense.amount} ({expense.envelope?.title || "No Title"})
            </li>
          ))
        ) : (
          <p>No expenses recorded.</p>
        )}
      </ul>
      <h2>Income</h2>
      <ul>
        {incomes.length > 0 ? (
          incomes.map(income => (
            <li key={income.id}>
              {income.source} - ${income.amount}
            </li>
          ))
        ) : (
          <p>No income recorded.</p>
        )}
      </ul>
    </div>
  );
}