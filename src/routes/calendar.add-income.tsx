import { useEffect, useState } from "react";
import { MetaFunction, useNavigate, useSearchParams } from "@remix-run/react";
import { addLocalIncome, generateIncomeId, Income } from "src/utils/localStorage";
import { successToast, failToast, warnToast } from "src/utils/toast";

export const meta: MetaFunction = () => {
  return [
    { title: "Add Income" },
    {
      name: "description",
      content: "Add a new source of income to your budget tracker.",
    },
  ];
};

export default function AddIncome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialDate =
    searchParams.get("selectedDate") || new Date().toISOString().split("T")[0];

  const [source, setSource] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(initialDate);
  const [savings, setSavings] = useState(0);
  const [investments, setInvestments] = useState(0);
  const [remainder, setRemainder] = useState(0);

  useEffect(() => {
    const totalDeductions = savings + investments;
    const remainingIncome = amount - totalDeductions;
    setRemainder(remainingIncome);
  }, [amount, savings, investments]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const totalDeductions = savings + investments;
    const remainingIncome = amount - totalDeductions;

    if (!source || !date || !amount) {
      alert("Please fill in all required fields.");
      return;
    }

    if (remainingIncome > 0) {
      const newIncome: Income = {
        id: generateIncomeId(),
        source,
        amount,
        date,
        savings,
        investments,
        remainder: remainingIncome,
      };

      addLocalIncome(newIncome);

      navigate("/calendar");
    } else {
      alert("Total deductions cannot exceed the total income.");
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-center">Add Income</h2>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <label>Source of Income</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="block w-full p-2 border border-gray-300"
            required
          />
        </div>
        <div>
          <label>Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="block w-full p-2 border border-gray-300"
          />
        </div>
        <div>
          <label>Total Income Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="block w-full p-2 border border-gray-300"
            required
          />
        </div>
        <div>
          <label>Savings</label>
          <input
            type="number"
            value={savings}
            onChange={(e) => setSavings(Number(e.target.value))}
            className="block w-full p-2 border border-gray-300"
          />
        </div>
        <div>
          <label>Investments</label>
          <input
            type="number"
            value={investments}
            onChange={(e) => setInvestments(Number(e.target.value))}
            className="block w-full p-2 border border-gray-300"
          />
        </div>
        <div>
          <label className="font-semibold">Remaining Income: {remainder}</label>
        </div>
        <div className="text-center ">
          <button
            type="submit"
            className="px-4 py-2 rounded-md hover:positive-item"
          >
            Add Income
          </button>
        </div>
      </form>
    </div>
  );
}
