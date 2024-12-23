import React from "react";
import { Link } from "@remix-run/react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: any[];
  incomes: any[];
  selectedDate: string;
  view: "expenses" | "income" | "both";
}

export default function ExpenseModal({
  isOpen,
  onClose,
  expenses,
  incomes,
  selectedDate,
  view,
}: ModalProps) {
  if (!isOpen) return null;

  const displayExpenses =
    view === "expenses" || view === "both" ? expenses : [];
  const displayIncomes = view === "income" || view === "both" ? incomes : [];
  const hasData = displayExpenses.length > 0 || displayIncomes.length > 0;

  return (
    <div>
      <div className="w-1/3 h-1/3 absolute b-2 border-lightgrey top-1/2 z-10 mx-auto my-0 shadow-lg bg-white rounded">
        <button
          onClick={onClose}
          className="w-6 h-6 m-2 rounded bg-red text-white font-bold float-right clear-both"
        >
          <p>x</p>
        </button>
        <h2>Summary of {selectedDate}</h2>

        {hasData ? (
          <ul className="space-y-2">
            {displayExpenses.map((expense: any) => (
              <li key={expense.id} className="border-b pb-2">
                <strong>{expense.envelope}:</strong> ${expense.amount} at{" "}
                {expense.location}
                {expense.comments && (
                  <p className="text-sm text-gray-600">"{expense.comments}"</p>
                )}
              </li>
            ))}
            {displayIncomes.map((income: any) => (
              <li key={income.id} className="border-b pb-2">
                <strong>Income:</strong> ${income.amount} from {income.source}
              </li>
            ))}
          </ul>
        ) : (
          <p>
            No{" "}
            {view === "expenses"
              ? "expenses"
              : view === "income"
              ? "income"
              : "records"}{" "}
            for this date.
          </p>
        )}

        <Link to={`./add-expense?selectedDate=${selectedDate}`}>
          <button className="text-green">Add Expense for {selectedDate}</button>
        </Link>
        <br />
        <Link to={`./add-income?selectedDate=${selectedDate}`}>
          <button className="text-red-500">
            Add Income for {selectedDate}
          </button>
        </Link>
      </div>
    </div>
  );
}
