import React, { useState, useEffect } from "react";

const MonthlyVoucherGenerator = ({ site, agreement, onSuccess }) => {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");

  // ✅ FIXED: Use monthlyTotal (which includes GST) from agreement
  useEffect(() => {
    if (agreement?.monthlyTotal) {
      setAmount(agreement.monthlyTotal.toString());
    }
  }, [agreement]);

  // ✅ NEW: Validate selected month against agreement period
  const validateMonth = (selectedMonth) => {
    if (!agreement || !selectedMonth) {
      setValidationError("");
      return true;
    }

    const selected = new Date(selectedMonth + "-01");
    const startDate = new Date(agreement.startDate);
    const endDate = new Date(agreement.endDate);

    // Set to first day of month for proper comparison
    const selectedFirstDay = new Date(selected.getFullYear(), selected.getMonth(), 1);
    const startFirstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endFirstDay = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    if (selectedFirstDay < startFirstDay) {
      setValidationError("Selected month is before agreement start period");
      return false;
    }
    
    if (selectedFirstDay > endFirstDay) {
      setValidationError("Selected month is after agreement end period");
      return false;
    }

    setValidationError("");
    return true;
  };

  // Handle month selection with validation
  const handleMonthChange = (e) => {
    const selectedMonth = e.target.value;
    setMonth(selectedMonth);
    validateMonth(selectedMonth);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!month || !amount) {
      alert("Please fill all fields.");
      return;
    }

    // ✅ NEW: Validate month is within agreement period before submission
    if (!validateMonth(month)) {
      alert("Cannot generate voucher outside agreement period");
      return;
    }

    const voucherAmount = parseFloat(amount);
    
    // Calculate breakdown for display/records
    let breakdown = {};
    if (agreement?.withGST) {
      const baseAmount = agreement.monthlyBaseRent;
      const gstAmount = agreement.monthlyGST;
      breakdown = {
        baseRent: baseAmount,
        gst: gstAmount,
        total: voucherAmount
      };
    } else {
      breakdown = {
        baseRent: voucherAmount,
        gst: 0,
        total: voucherAmount
      };
    }

    const newVoucher = {
      month,
      amount: voucherAmount, // This is the total amount (including GST if applicable)
      breakdown: breakdown, // Store breakdown for accounting
      gstType: agreement?.withGST ? "With GST" : "Without GST",
      createdBy: "Billing Executive",
      createdAt: new Date().toISOString()
    };

    onSuccess(newVoucher);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Generate Monthly Voucher</h2>

      {agreement && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm text-gray-600"><strong>Site:</strong> {site.siteName}</p>
          <p className="text-sm text-gray-600"><strong>Owner:</strong> {site.owner}</p>
          <p className="text-sm text-gray-600">
            <strong>Agreement Period:</strong> {agreement.startDate} to {agreement.endDate}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            <strong>Note:</strong> Vouchers can only be generated for months within this period
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Select Month</label>
          <input
            type="month"
            value={month}
            onChange={handleMonthChange}
            min={agreement ? agreement.startDate.slice(0, 7) : undefined}
            max={agreement ? agreement.endDate.slice(0, 7) : undefined}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
              validationError ? 'border-red-500 focus:ring-red-500' : 'focus:ring-green-500'
            }`}
            required
          />
          {agreement && (
            <p className="text-xs text-gray-500 mt-1">
              Valid period: {agreement.startDate.slice(0, 7)} to {agreement.endDate.slice(0, 7)}
            </p>
          )}
          {validationError && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              {validationError}
            </p>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Monthly Rent Amount {agreement?.withGST ? "(Including GST)" : "(Without GST)"}
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            min="0"
            step="0.01"
            placeholder="Monthly rent amount"
          />
          {agreement?.monthlyTotal && (
            <p className="text-xs text-gray-500 mt-1">
              From agreement: ₹{agreement.monthlyTotal.toLocaleString()} 
              {agreement.withGST ? " (includes GST)" : ""}
            </p>
          )}
        </div>

        {/* Amount Breakdown Display */}
        {agreement?.withGST && amount && (
          <div className="p-3 bg-blue-50 rounded">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Amount Breakdown:</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <div className="flex justify-between">
                <span>Base Rent:</span>
                <span>₹{agreement.monthlyBaseRent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST @18%:</span>
                <span>₹{agreement.monthlyGST?.toLocaleString()}</span>
              </div>
              <hr className="border-blue-300 my-1" />
              <div className="flex justify-between font-semibold">
                <span>Total Amount:</span>
                <span>₹{parseFloat(amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {!agreement?.withGST && (
          <div className="p-3 bg-gray-50 rounded">
            <p className="text-sm text-gray-600">
              <strong>GST Type:</strong> Without GST
              <span className="text-xs text-gray-500 block">(Based on agreement settings)</span>
            </p>
          </div>
        )}

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="submit"
            disabled={!!validationError || !month || !amount}
            className={`px-6 py-3 rounded-lg transition focus:outline-none focus:ring-2 ${
              validationError || !month || !amount
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            Generate Voucher
          </button>
        </div>
      </form>
    </div>
  );
};

export default MonthlyVoucherGenerator;