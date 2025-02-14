import { MetaFunction, useParams, useLoaderData } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { getLocalExpenses, getLocalIncome } from "~/utils/localStorage";
import { useState } from "react";

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
  const [expenses, setExpenses] = useState(getLocalExpenses().filter(expense => expense.date === date));
  const [incomes, setIncomes] = useState(getLocalIncome().filter(income => income.date === date));

  
  const updateStorage = (data, type) => {
    localStorage.setItem(type, JSON.stringify(data));
  };

  const handleDeleteExpense = (id) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    updateStorage(updatedExpenses, "expenses")
  };

  const handleDeleteIncome = (id) => {
    const updatedIncomes = incomes.filter(income => income.id !== id);
    setIncomes(updatedIncomes);
    updateStorage(updatedIncomes, "incomes")
  };

  return (
    <div className="details-page">
      <h1>Details for {date}</h1>

      <h2>Expenses</h2>
      <ul>
        {expenses.length > 0 ? (
          expenses.map(expense => (
            <li key={expense.id}>
              {expense.location} - ${expense.amount} ({expense.envelope?.title || "No Title"})
              <button 
                onClick={() => handleDeleteExpense(expense.id)} 
                className="text-red-500 ml-2"
              >
                Delete
              </button>
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
              <button 
                onClick={() => handleDeleteIncome(income.id)} 
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No income recorded.</p>
        )}
      </ul>
    </div>
  );
}