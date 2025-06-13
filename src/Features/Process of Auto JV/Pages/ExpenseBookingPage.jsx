import ExpenseBookingTable from "../components/ExpenseBookingTable";

export default function ExpenseBookingPage() {
  return (
    <div className="p-6 bg-white text-green-800 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Expense Booking Simulation</h1>
      <ExpenseBookingTable />
    </div>
  );
}