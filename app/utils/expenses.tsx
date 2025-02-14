import { getEnvelopes } from "./localStorage";

export function getFormattedDate(date: string | Date = new Date(), format = "yyyy-MM-dd") {
  if (typeof date === "string") return date;

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


export const formatCurrency = (amount: number, locale: string = "en-US", currency: string = "USD") => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(amount);
};

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

export function getMonthlyExpenditureDetails(incomes, expenses) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const lastMonthDate = new Date(currentDate);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastYear = lastMonthDate.getFullYear();

  const filterByMonth = (data, month, year) =>
    data.filter((item) => {
      const [itemYear, itemMonth] = item.date.split("-").map(Number);
      return itemMonth - 1 === month && itemYear === year;
    });
  

  const thisMonthExpenses = filterByMonth(expenses, currentMonth, currentYear);
  const lastMonthExpenses = filterByMonth(expenses, lastMonth, lastYear);
  const thisMonthIncomes = filterByMonth(incomes, currentMonth, currentYear);
  const lastMonthIncomes = filterByMonth(incomes, lastMonth, lastYear);

  const totalSpendingThisMonth = thisMonthExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  const totalSpendingLastMonth = lastMonthExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  const totalIncomeThisMonth = thisMonthIncomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );
  const totalIncomeLastMonth = lastMonthIncomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );

  const spendingDifference = totalIncomeThisMonth - totalSpendingThisMonth;

  const mostSpentEnvelope = thisMonthExpenses.reduce((acc, expense) => {
    if (expense.envelope) {
      acc[expense.envelope] = (acc[expense.envelope] || 0) + expense.amount;
    }
    return acc;
  }, {});
  const [highestEnvelope, highestAmount] =
    Object.entries(mostSpentEnvelope).sort((a, b) => b[1] - a[1])[0] || [];

  const mostFrequentEnvelope = thisMonthExpenses.reduce((acc, expense) => {
    if (expense.envelope) {
      acc[expense.envelope] = (acc[expense.envelope] || 0) + 1;
    }
    return acc;
  }, {});
  const [frequentEnvelope] =
    Object.entries(mostFrequentEnvelope).sort((a, b) => b[1] - a[1])[0] || [];

  const spendingComparison =
    totalSpendingLastMonth === 0
      ? 0
      : ((totalSpendingThisMonth - totalSpendingLastMonth) /
          totalSpendingLastMonth) *
        100;

  const mostSpentLocation = thisMonthExpenses.reduce((acc, expense) => {
    if (expense.location) {
      acc[expense.location] = (acc[expense.location] || 0) + expense.amount;
    }
    return acc;
  }, {});
  const [highestSpendingLocation, highestSpendingAmount] =
    Object.entries(mostSpentLocation).sort((a, b) => b[1] - a[1])[0] || [];

  return {
    incomeTotals: totalIncomeThisMonth,
    expenseTotals: totalSpendingThisMonth,
    spendingDifference,
    spendingComparison,
    highestEnvelope: highestEnvelope || "N/A",
    highestAmount: highestAmount || 0,
    frequentEnvelope: frequentEnvelope || "N/A",
    highestSpendingLocation: highestSpendingLocation || "N/A",
    highestSpendingAmount: highestSpendingAmount || 0,
  };
}

export function getYearlyExpenditureDetails(incomes, expenses, year) {
  const incomeTotals = incomes
    .filter((income) => new Date(income.date).getFullYear() === year)
    .reduce((total, income) => total + income.amount, 0);

  const expenseTotals = expenses
    .filter((expense) => new Date(expense.date).getFullYear() === year)
    .reduce((total, expense) => total + expense.amount, 0);

  const spendingDifference = incomeTotals - expenseTotals;

  const mostSpentEnvelope = expenses
    .filter((expense) => new Date(expense.date).getFullYear() === year)
    .reduce((acc, expense) => {
      if (expense.envelope) {
        acc[expense.envelope] = (acc[expense.envelope] || 0) + expense.amount;
      }
      return acc;
    }, {});

  const [highestEnvelope, highestAmount] = Object.entries(
    mostSpentEnvelope
  ).sort((a, b) => b[1] - a[1])[0] || [null, 0];

  const mostFrequentEnvelope = expenses
    .filter((expense) => new Date(expense.date).getFullYear() === year)
    .reduce((acc, expense) => {
      acc[expense.envelope] = (acc[expense.envelope] || 0) + 1;
      return acc;
    }, {});

  const [frequentEnvelope] = Object.entries(mostFrequentEnvelope).sort(
    (a, b) => b[1] - a[1]
  )[0] || [null, 0];

  return {
    incomeTotals,
    expenseTotals,
    spendingDifference,
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
  return amount.toFixed(2);
};

export function filterEnvelopeExpenses(envelopes, criteria = {}) {
  const { month, year, minAmount, maxAmount, envelopeName } = criteria;

  return envelopes
    .filter((envelope) => {
      // Filter by envelope name (optional)
      if (envelopeName && envelope.title !== envelopeName) return false;
      return true;
    })
    .map((envelope) => {
      // Filter expenses within the envelope
      const filteredExpenses = envelope.expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);

        // Filter by month and year
        const matchesMonth =
          month !== undefined ? expenseDate.getMonth() + 1 === month : true;
        const matchesYear =
          year !== undefined ? expenseDate.getFullYear() === year : true;

        // Filter by amount range
        const matchesMinAmount =
          minAmount !== undefined ? expense.amount >= minAmount : true;
        const matchesMaxAmount =
          maxAmount !== undefined ? expense.amount <= maxAmount : true;

        return matchesMonth && matchesYear && matchesMinAmount && matchesMaxAmount;
      });

      return { ...envelope, expenses: filteredExpenses };
    })
    .filter((envelope) => envelope.expenses.length > 0);
}

export function filterCurrentMonthExpenses(expenses) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return expenses.filter((expense) => {
    const [year, month] = expense.date.split("-").map(Number);
    return year === currentYear && month === currentMonth;
  });
}