import { useState } from "react";
import { vendors } from "../data/Vendors";
import ExpenseForm from "../Components/ExpenseForm";
import ExpenseList from "../Components/ExpenseList";


export default function ExpenseBookingPage() {
  const [expenses, setExpenses] = useState([]);

  const handleSave = (data) => {
    setExpenses((prev) => [...prev, data]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white">
      <h1 className="text-2xl font-bold mb-4 text-green-800">Expense Booking & Auto JV</h1>
      <ExpenseForm vendors={vendors} onSave={handleSave} />
      <ExpenseList expenses={expenses} />
    </div>
  );
}
