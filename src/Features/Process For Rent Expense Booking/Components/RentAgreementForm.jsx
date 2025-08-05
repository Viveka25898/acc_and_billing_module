import React, { useState, useEffect } from "react";


export default function RentAgreementForm({ onSuccess }) {
  const [form, setForm] = useState({
    owner: "",
    file: null,
    startDate: "",
    endDate: "",
    amount: "",
    withGST: false,
  });

 const [calculations, setCalculations] = useState({
  totalVouchers: 0,
  totalAmount: 0,
  monthlyExpense: 0,
  totalGST: 0,
  grandTotal: 0,
});


  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "file" ? files[0] : value,
    }));
  };

  // Calculate vouchers and amounts whenever dates or amount changes
 useEffect(() => {
  if (form.startDate && form.endDate && form.amount) {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    const months =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;

    const totalAmount = parseFloat(form.amount); // Total for full period
    const monthlyExpense = Math.round(totalAmount / months);

    const totalGST = form.withGST ? Math.round(totalAmount * 0.18) : 0;
    const grandTotal = totalAmount + totalGST;

    setCalculations({
      totalVouchers: months,
      totalAmount,
      monthlyExpense,
      totalGST,
      grandTotal,
    });
  }
}, [form.startDate, form.endDate, form.amount, form.withGST]);



  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data ready to be sent to API/store:", form);
    
    // Create agreement data with file URL simulation
    const agreementData = {
  owner: form.owner,
  startDate: form.startDate,
  endDate: form.endDate,
  amount: parseFloat(form.amount),
  withGST: form.withGST,
  fileUrl: form.file ? URL.createObjectURL(form.file) : null,
  monthlyExpense: calculations.monthlyExpense, // ✅ ADD THIS
  createdAt: new Date().toISOString()
};


if (onSuccess) onSuccess(agreementData);
console.log(agreementData);

  };

  return (
    <form onSubmit={handleSubmit} className="p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Upload Rent Agreement</h2>
      
      {/* Calculation Preview */}
    {form.startDate && form.endDate && form.amount && (
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 text-sm">
        <h3 className="text-base font-semibold text-blue-800 mb-2">Agreement Summary</h3>
        <ul className="space-y-1 text-blue-700">
          <li><strong>Total Vouchers:</strong> {calculations.totalVouchers}</li>
          <li><strong>Total Amount (Base Rent):</strong> ₹{calculations.totalAmount.toLocaleString()}</li>
          {form.withGST && (
            <>
              <li><strong>GST @18%:</strong> ₹{calculations.totalGST.toLocaleString()}</li>
              <li><strong>Total Amount (Including GST):</strong> ₹{calculations.grandTotal.toLocaleString()}</li>
            </>
          )}
          <li><strong>Monthly Expense:</strong> ₹{calculations.monthlyExpense.toLocaleString()}</li>
        </ul>
      </div>
)}




      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Owner Name / Ledger</label>
          <input
            type="text"
            name="owner"
            placeholder="Enter owner name or ledger"
            value={form.owner}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700"> Rent Amount</label>
          <input
            type="number"
            name="amount"
            placeholder="Enter monthly rent amount"
            value={form.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Upload Agreement (PDF)</label>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept="application/pdf"
            required
            className="w-full p-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="w-full">
            <label className="block mb-1 text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="withGST"
            checked={form.withGST}
            onChange={handleChange}
            className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
          />
          <label className="text-sm font-medium text-gray-700">Include GST</label>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          className="w-full md:w-auto bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Save Agreement
        </button>
      </div>
    </form>
  );
}