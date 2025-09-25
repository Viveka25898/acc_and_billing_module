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
    baseRentTotal: 0,
    totalGST: 0,
    grandTotal: 0,
    monthlyBaseRent: 0,
    monthlyGST: 0,
    monthlyTotal: 0,
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

      const baseRentTotal = parseFloat(form.amount); // Total base rent for full period
      const monthlyBaseRent = Math.round(baseRentTotal / months);
      
      // Calculate GST properly
      const totalGST = form.withGST ? Math.round(baseRentTotal * 0.18) : 0;
      const monthlyGST = form.withGST ? Math.round(totalGST / months) : 0;
      
      const grandTotal = baseRentTotal + totalGST;
      const monthlyTotal = monthlyBaseRent + monthlyGST; // This is what should be used in vouchers

      setCalculations({
        totalVouchers: months,
        baseRentTotal,
        totalGST,
        grandTotal,
        monthlyBaseRent,
        monthlyGST,
        monthlyTotal, // This includes GST if applicable
      });
    }
  }, [form.startDate, form.endDate, form.amount, form.withGST]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data ready to be sent to API/store:", form);
    
    // Create agreement data with correct monthly amounts
    const agreementData = {
      owner: form.owner,
      startDate: form.startDate,
      endDate: form.endDate,
      amount: parseFloat(form.amount), // Base rent total
      withGST: form.withGST,
      fileUrl: form.file ? URL.createObjectURL(form.file) : null,
      // FIXED: Store the correct monthly amounts
      monthlyBaseRent: calculations.monthlyBaseRent,
      monthlyGST: calculations.monthlyGST,
      monthlyTotal: calculations.monthlyTotal, // This is what vouchers should use
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
            <li><strong>Base Rent (Total):</strong> ₹{calculations.baseRentTotal.toLocaleString()}</li>
            {form.withGST && (
              <>
                <li><strong>GST @18% (Total):</strong> ₹{calculations.totalGST.toLocaleString()}</li>
                <li><strong>Grand Total:</strong> ₹{calculations.grandTotal.toLocaleString()}</li>
                <hr className="my-2 border-blue-300" />
                <li><strong>Monthly Base Rent:</strong> ₹{calculations.monthlyBaseRent.toLocaleString()}</li>
                <li><strong>Monthly GST:</strong> ₹{calculations.monthlyGST.toLocaleString()}</li>
              </>
            )}
            <li className="text-lg font-semibold">
              <strong>Monthly Total Amount:</strong> ₹{calculations.monthlyTotal.toLocaleString()}
            </li>
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
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Total Rent Amount {form.withGST ? "(Base Amount - GST will be calculated)" : "(Total Amount)"}
          </label>
          <input
            type="number"
            name="amount"
            placeholder="Enter total rent amount for agreement period"
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
          <label className="text-sm font-medium text-gray-700">
            Include GST (18% will be added to base amount)
          </label>
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