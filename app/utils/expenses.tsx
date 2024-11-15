import { getLocalExpenses, getLocalIncome, getEnvelopes } from "./localStorage";

export function getFormattedDate(date = new Date(), format = "yyyy-MM-dd") {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "yyyy-MM":
      return `${year}-${month}`;
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

export function calculateTotal(data, type, timePeriod) {
  if (!Array.isArray(data)) return 0;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const isWithinPeriod = (date, monthOffset = 0) => {
    const expenseDate = new Date(date);
    const targetMonth = currentMonth + monthOffset;
    const targetYear = targetMonth < 0 ? currentYear - 1 : currentYear;

    return (
      expenseDate.getMonth() === (targetMonth + 12) % 12 &&
      expenseDate.getFullYear() === targetYear
    );
  };

  const monthOffset = timePeriod === "lastMonth" ? -1 : 0;

  return data
    .filter((item) => item.date && isWithinPeriod(item.date, monthOffset))
    .reduce((total, item) => total + (item.amount || 0), 0);
}

export function getMonthlyExpenditureDetails(incomes, expenses, envelopes) {
  const incomeTotals = calculateTotal(incomes, "income", "thisMonth");
  const expenseTotals = calculateTotal(expenses, "expense", "thisMonth");
  let totalIncomeThisMonth = 0;
  let totalIncomeLastMonth = 0;
  let totalSpendingThisMonth = 0;
  let totalSpendingLastMonth = 0;

  const currentMonth = getFormattedDate(new Date(), "yyyy-MM");
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = getFormattedDate(lastMonthDate, "yyyy-MM");

  expenses.forEach((expense) => {
    const expenseMonth = expense.date.slice(0, 7);
    if (expenseMonth === currentMonth) {
      totalSpendingThisMonth += expense.amount;
    } else if (expenseMonth === lastMonth) {
      totalSpendingLastMonth += expense.amount;
    }
  });

  incomes.forEach((income) => {
    const incomeMonth = income.date.slice(0, 7);
    if (incomeMonth === currentMonth) {
      totalIncomeThisMonth += income.amount;
    } else if (incomeMonth === lastMonth) {
      totalIncomeLastMonth += income.amount;
    }
  });

  const spendingDifference = incomeTotals - expenseTotals;

  const mostSpentEnvelope = expenses.reduce((acc, expense) => {
    if (expense.envelope) {
      if (!acc[expense.envelope]) {
        acc[expense.envelope] = 0;
      }
      acc[expense.envelope] += expense.amount;
    } else {
      console.warn("Expense without envelope found:", expense);
    }
    return acc;
  }, {});
  const [highestEnvelope, highestAmount] = Object.entries(
    mostSpentEnvelope
  ).sort((a, b) => b[1] - a[1])[0];

  const spendingComparison =
    totalSpendingLastMonth === 0
      ? 0
      : ((totalSpendingThisMonth - totalSpendingLastMonth) /
          totalSpendingLastMonth) *
        100;

  const mostFrequentEnvelope = expenses.reduce((acc, expense) => {
    acc[expense.envelope] = (acc[expense.envelope] || 0) + 1;
    return acc;
  }, {});

  const [frequentEnvelope] = Object.entries(mostFrequentEnvelope).sort(
    (a, b) => b[1] - a[1]
  )[0];

  return {
    incomeTotals,
    expenseTotals,
    spendingDifference,
    spendingComparison,
    highestEnvelope,
    highestAmount,
    frequentEnvelope,
  };
}

export const getBudgetLimits = async () => {
  const envelopes = getEnvelopes();
  const budgets = envelopes.map((env) => {
    env.title, env.budget;
  });
  return budgets;
};

export const totalSpend = (envelope) => {
  if (!envelope.expenses || envelope.expenses.length === 0) {
    return 0;
  }
  let amount = 0;
  for (let i = 0; i < envelope.expenses.length; i++) {
    amount += envelope.expenses[i].amount;
  }
  return amount;
};
