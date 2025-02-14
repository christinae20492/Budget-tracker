import type { MetaFunction } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { json, LoaderFunction } from "@remix-run/node";
import { useState, useEffect, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ExpenseModal from "~/components/ui/ExpenseModal";
import FloatingMenu from "~/components/ui/FloatingMenu";
import {
  getLocalExpenses,
  Expense,
  getLocalIncome,
  Income,
  getEnvelopes,
  Envelope,
} from "~/utils/localStorage";
import ToggleSwitch from "~/components/ui/ToggleSwitch";

export const meta: MetaFunction = () => {
  return [
    { title: "Calendar" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async () => {
  return json({ expenses: [], incomes: [] });
};

export default function ExpenseCalendar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState("both");
  const [selectedDateExpenses, setSelectedDateExpenses] = useState<Expense[]>(
    []
  );
  const [selectedDateIncome, setSelectedDateIncome] = useState<Income[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const storedExpenses = getLocalExpenses();
    const storedIncomes = getLocalIncome();
    const storedEnvelopes = getEnvelopes();
    setExpenses(storedExpenses);
    setIncomes(storedIncomes);
    setEnvelopes(storedEnvelopes);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedExpenses = getLocalExpenses();
      const updatedIncome = getLocalIncome();
      setExpenses(updatedExpenses);
      setIncomes(updatedIncome);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleDateClick = (info: any) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const expensesForDate = expenses.filter(
      (expense) => expense.date === clickedDate
    );
    setSelectedDateExpenses(expensesForDate);

    const incomesForDate = incomes.filter(
      (income) => income.date === clickedDate
    );
    setSelectedDateIncome(incomesForDate);
    console.log(selectedDateIncome);

    setIsModalOpen(true);
  };

  const handleToggle = (newView: string) => {
    setView(newView);
  };

  const handleEventClick = (info) => {
    const selectedDate = info.event.startStr;
    navigate(`/calendar/${selectedDate}`);
  };

  const getCategoryColor = (envelopeName, envelopes) => {
    const envelope = envelopes.find((env) => env.title === envelopeName);
    return envelope?.color || "#DA5151";
  };

  const calendarEvents = useMemo(() => {
    if (view === "expenses") {
      return expenses.map((expense) => ({
        id: expense.id,
        title: `${expense.location} - $${expense.amount}`,
        start: expense.date,
        backgroundColor: getCategoryColor(expense.envelope, envelopes),
      }));
    } else if (view === "income") {
      return incomes.map((income) => ({
        id: income.id,
        title: `${income.source} - $${income.amount}`,
        start: income.date,
        backgroundColor: "#4DB533",
      }));
    } else {
      return [
        ...expenses.map((expense) => ({
          id: expense.id,
          title: `${expense.location} - $${expense.amount}`,
          start: expense.date,
          backgroundColor: getCategoryColor(expense.envelope, envelopes),
        })),
        ...incomes.map((income) => ({
          id: income.id,
          title: `${income.source} - $${income.amount}`,
          start: income.date,
          backgroundColor: "#4DB533",
        })),
      ];
    }
  }, [view, expenses, incomes]);

  return (
    <div className="mx-auto my-0 max-w-screen-2xl">
      <div>
        <FloatingMenu />
        <ToggleSwitch onToggle={handleToggle} />
      </div>
      <div>
        <h1 className="text-center">Expense Calendar</h1>
      </div>
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth" // Set the default view (month view)
          dateClick={handleDateClick} // Handle when a date is clicked
          selectable={true} // Enable date selection
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "today",
          }}
          events={calendarEvents}
          eventClick={handleEventClick}
          footerToolbar={{
            center: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
        />
      </div>
      <div className="w-full">
        <ExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          expenses={selectedDateExpenses}
          incomes={selectedDateIncome}
          selectedDate={selectedDate}
          view={view}
        />
      </div>
    </div>
  );
}
