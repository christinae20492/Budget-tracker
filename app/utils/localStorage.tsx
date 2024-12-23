export interface Expense {
  id: number;
  location: string;
  envelope: string;
  date: string;
  amount: number;
  comments?: string;
}

export function getLocalExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("expenses");
  return data ? JSON.parse(data) : [];
}

export function addLocalExpense(expense: Expense): void {
  const expenses = getLocalExpenses();
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

export const addExpensetoEnvelope = (expense: Expense) => {
  const envelopes = getEnvelopes();
  const envelope = envelopes.find((ev) => ev.title === expense.envelope);
  console.log(envelope);
  if (envelope) {
    envelope.expenses.push(expense);
    localStorage.setItem("envelopes", JSON.stringify(envelopes));
  }
};

export function generateExpenseId(): number {
  return Date.now();
}

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
  savings: number;
  investments?: number;
  remainder?: number;
}

export function getLocalIncome(): Income[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("incomes");
  return data ? JSON.parse(data) : [];
}

export function addLocalIncome(income: Income): void {
  const incomes = getLocalIncome();
  incomes.push(income);
  localStorage.setItem("incomes", JSON.stringify(incomes));
}

export function generateIncomeId(): number {
  return Date.now();
}

export const getMonthlyTotal = async () => {
  const expenses = await getLocalExpenses();
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses.filter(
    (expense) => new Date(expense.date).getMonth() === currentMonth
  );
  return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
};

export interface Envelope {
  title: string;
  fixed?: boolean;
  budget?: number;
  expenses: Expense[];
  icon: string;
}

export function getEnvelopes(): Envelope[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("envelopes");
  return data ? JSON.parse(data) : [];
}

export function createEnvelope(envelope: Envelope): void {
  const envelopes = getEnvelopes();
  envelopes.push(envelope);
  localStorage.setItem("envelopes", JSON.stringify(envelopes));
}

export const deleteExpense = async (id) => {
  const expenses = getLocalExpenses();
  const updatedExpenses = expenses.filter((exp) => exp.id !== id);
  localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
};

export const deleteIncome = async (id) => {
  const incomes = getLocalIncome();
  const updatedIncomes = incomes.filter((inc) => inc.id !== id);
  localStorage.setItem("incomes", JSON.stringify(updatedIncomes));
};