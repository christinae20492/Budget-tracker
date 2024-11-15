import React, { useState } from "react";

export default function ToggleSwitch({
  onToggle,
}: {
  onToggle: (view: string) => void;
}) {
  const [view, setView] = useState("both");

  const handleToggle = (newView: string) => {
    setView(newView);
    onToggle(newView);
  };

  return (
    <div className="w-1/8 h-12 p-4 absolute top-4 right-4 float-right bg-mintgreen rounded shadow-sm">
      <button
        className={`text-white text-md mx-4 ${
          view === "income" ? "font-bold" : ""
        }`}
        onClick={() => handleToggle("income")}
      >
        Income
      </button>
      <button
        className={`text-white text-md mx-4 ${
          view === "expenses" ? "font-bold" : ""
        }`}
        onClick={() => handleToggle("expenses")}
      >
        Expenses
      </button>
      <button
        className={`text-white text-md mx-4 ${
          view === "both" ? "font-bold" : ""
        }`}
        onClick={() => handleToggle("both")}
      >
        Both
      </button>
    </div>
  );
}
