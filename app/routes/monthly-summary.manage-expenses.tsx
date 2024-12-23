import { useState } from "react";
import Layout from "~/components/ui/Layout";
import { getLocalExpenses, getLocalIncome, deleteExpense, deleteIncome } from "~/utils/localStorage";
import { formatCurrency, getFormattedDate } from "~/utils/expenses";

export default function ManageExpenses() {
  const [expenses, setExpenses] = useState(getLocalExpenses());
  const [incomes, setIncomes] = useState(getLocalIncome());
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [type, setType] = useState("");

  const handleDelete = async (id) => {
    if (type === "expense") {
      await deleteExpense(id);
      setExpenses(getLocalExpenses());
    } else if (type === "income") {
      await deleteIncome(id);
      setIncomes(getLocalIncome());
    }
    setIsModalVisible(false);
  };

  const openModal = (item, itemType) => {
    setSelectedItem(item);
    setType(itemType);
    setIsModalVisible(true);
  };

  return (
    <Layout>
      <h1 className="text-center font-bold text-2xl">Manage Expenses and Incomes</h1>
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <h2 className="font-bold text-xl">Expenses</h2>
          <div className="expense-list">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() => openModal(expense, "expense")}
              >
                <p>{getFormattedDate(expense.date)}</p>
                <p>{expense.location}</p>
                <p>{formatCurrency(expense.amount)}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-xl">Incomes</h2>
          <div className="income-list">
            {incomes.map((income) => (
              <div
                key={income.id}
                className="p-2 border rounded shadow mb-2 cursor-pointer hover:bg-gray-100"
                onClick={() => openModal(income, "income")}
              >
                <p>{getFormattedDate(income.date)}</p>
                <p>{income.source}</p>
                <p>{formatCurrency(income.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isModalVisible && selectedItem && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded p-4 shadow-lg w-1/3">
            <h3 className="font-bold text-lg">{type === "expense" ? "Expense Details" : "Income Details"}</h3>
            <div className="mt-4">
              <p><strong>Date:</strong> {getFormattedDate(selectedItem.date)}</p>
              <p><strong>Location:</strong> {selectedItem.location || selectedItem.source}</p>
              <p><strong>Amount:</strong> {formatCurrency(selectedItem.amount)}</p>
              {type === "expense" && (
                <>
                  <p><strong>Envelope:</strong> {selectedItem.envelope}</p>
                  <p><strong>Comments:</strong> {selectedItem.comments}</p>
                </>
              )}
              {type === "income" && (
                <p><strong>Allocation:</strong> {JSON.stringify(selectedItem.allocation)}</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="button bg-red-500 text-white mr-2"
                onClick={() => handleDelete(selectedItem.id)}
              >
                Delete
              </button>
              <button
                className="button"
                onClick={() => setIsModalVisible(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}