import React, { useState } from "react";

const MonthlyVoucherGenerator = ({ site, agreement, onSuccess }) => {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!month || !amount) {
      alert("Please fill all fields.");
      return;
    }

    const newVoucher = {
      month,
      amount: parseFloat(amount),
      gstType: agreement?.withGST ? "With GST" : "Without GST",
      createdBy: "Billing Executive",
      createdAt: new Date().toISOString()
    };

    // Send voucher to parent
    onSuccess(newVoucher);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Generate Monthly Voucher</h2>
      
      {site && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600"><strong>Site:</strong> {site.siteName}</p>
          <p className="text-sm text-gray-600"><strong>Owner:</strong> {site.owner}</p>
          {agreement && (
            <p className="text-sm text-gray-600">
              <strong>Agreement Period:</strong> {agreement.startDate} to {agreement.endDate}
            </p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Month</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none"
            required
          />
        </div>
        
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Rent Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Rent Amount"
            className="w-full p-3 border rounded-lg focus:outline-none"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="p-3 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">
            <strong>GST Type:</strong> {agreement?.withGST ? "With GST" : "Without GST"}
            <span className="text-xs text-gray-500 block">
              (Based on agreement settings)
            </span>
          </p>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button 
            type="submit" 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
          >
            Generate Voucher
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyVoucherGenerator;