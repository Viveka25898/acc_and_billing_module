import React, { useState, useEffect } from "react";

const MonthlyVoucherGenerator = ({ site, agreement, onSuccess }) => {
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [validationError, setValidationError] = useState("");
  const [existingVouchers, setExistingVouchers] = useState([]);

  // ✅ Load existing vouchers from localStorage
  useEffect(() => {
    const storedVouchers = JSON.parse(localStorage.getItem("vouchers") || "[]");
    const siteVouchers = storedVouchers.filter(v => v.siteId === site?.siteId);
    setExistingVouchers(siteVouchers);
  }, [site]);

  // ✅ Auto-populate amount from agreement
  useEffect(() => {
    if (agreement?.monthlyTotal) {
      setAmount(agreement.monthlyTotal.toString());
    }
  }, [agreement]);

  // ✅ Validate selected month
  const validateMonth = (selectedMonth) => {
    if (!agreement || !selectedMonth) {
      setValidationError("");
      return true;
    }

    const selected = new Date(selectedMonth + "-01");
    const startDate = new Date(agreement.startDate);
    const endDate = new Date(agreement.endDate);

    const selectedFirstDay = new Date(selected.getFullYear(), selected.getMonth(), 1);
    const startFirstDay = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
    const endFirstDay = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

    // Check if before start date
    if (selectedFirstDay < startFirstDay) {
      setValidationError("Selected month is before agreement start period");
      return false;
    }
    
    // Check if after end date
    if (selectedFirstDay > endFirstDay) {
      setValidationError("Selected month is after agreement end period");
      return false;
    }

    // ✅ NEW: Check if voucher already exists for this month
    const voucherExists = existingVouchers.some(v => v.month === selectedMonth);
    if (voucherExists) {
      setValidationError("Voucher already exists for this month");
      return false;
    }

    setValidationError("");
    return true;
  };

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

    if (!validateMonth(month)) {
      alert(validationError || "Cannot generate voucher");
      return;
    }

    const voucherAmount = parseFloat(amount);
    
    // Calculate breakdown for accounting
    let breakdown = {};
    let gstDetails = null;
    
    if (agreement?.withGST) {
      const baseAmount = agreement.monthlyBaseRent;
      const gstAmount = agreement.monthlyGST;
      
      // Determine GST type based on site state
      const gstType = site?.state === "Maharashtra" ? "CGST+SGST" : "IGST"; // You can enhance this
      
      breakdown = {
        baseRent: baseAmount,
        gst: gstAmount,
        total: voucherAmount
      };
      
      gstDetails = {
        applicable: true,
        rate: 18,
        type: gstType,
        cgst: gstType === "CGST+SGST" ? gstAmount / 2 : 0,
        sgst: gstType === "CGST+SGST" ? gstAmount / 2 : 0,
        igst: gstType === "IGST" ? gstAmount : 0
      };
    } else {
      breakdown = {
        baseRent: voucherAmount,
        gst: 0,
        total: voucherAmount
      };
      
      gstDetails = {
        applicable: false,
        rate: 0,
        type: "None",
        cgst: 0,
        sgst: 0,
        igst: 0
      };
    }

    const newVoucher = {
      voucherId: `VOUCH-${Date.now()}`,
      siteId: site?.siteId,
      siteName: site?.siteName,
      agreementId: agreement?.agreementId,
      
      // Period
      month,
      year: month.split("-")[0],
      
      // Amounts
      amount: voucherAmount,
      breakdown: breakdown,
      
      // GST Details
      gstDetails: gstDetails,
      gstType: agreement?.withGST ? "With GST" : "Without GST",
      
      // Owner Information
      ownerName: agreement?.owner || site?.owners?.[0]?.ownerName || "Unknown",
      ownerGLCode: site?.owners?.[0]?.glCode || null,
      
      // Status
      status: "Generated",
      paymentStatus: "Pending",
      
      // Metadata
      createdBy: "Billing Executive",
      createdAt: new Date().toISOString(),
      
      // For future payment tracking
      paidDate: null,
      paidAmount: null,
      paymentReference: null
    };

    onSuccess(newVoucher);
  };

  // Calculate remaining vouchers
  const totalMonths = agreement?.totalVouchers || 0;
  const generatedCount = existingVouchers.length;
  const remainingCount = totalMonths - generatedCount;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-green-700 mb-4">Generate Monthly Voucher</h2>

      {/* Site & Agreement Information */}
      {site && agreement && (
        <div className="mb-6 space-y-3">
          {/* Site Info */}
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Site Information</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div><strong>Site:</strong> {site.siteName}</div>
              <div><strong>Location:</strong> {site.location}</div>
              <div><strong>City:</strong> {site.city}</div>
              <div><strong>State:</strong> {site.state}</div>
            </div>
          </div>

          {/* Agreement Info */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-sm font-semibold text-blue-700 mb-2">Agreement Details</h3>
            <div className="space-y-1 text-xs text-blue-600">
              <div><strong>Owner:</strong> {agreement.owner}</div>
              <div><strong>Period:</strong> {agreement.startDate} to {agreement.endDate}</div>
              <div><strong>Monthly Amount:</strong> ₹{agreement.monthlyTotal.toLocaleString()}</div>
              <div className="pt-2 border-t border-blue-300">
                <strong>Voucher Progress:</strong> {generatedCount} / {totalMonths} 
                <span className="text-red-600 ml-2">({remainingCount} remaining)</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
            <strong>Note:</strong> Vouchers can only be generated for months within the agreement period and cannot be duplicated.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Month Selection */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Select Month <span className="text-red-500">*</span>
          </label>
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
            <div className="flex items-start gap-2 mt-2 p-2 bg-red-50 border border-red-200 rounded">
              <svg className="w-4 h-4 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-red-600 font-medium">{validationError}</p>
            </div>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Monthly Rent Amount <span className="text-red-500">*</span>
            <span className="text-xs text-gray-500 ml-2">
              {agreement?.withGST ? "(Including GST)" : "(Without GST)"}
            </span>
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            min="1"
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
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 mb-3">Amount Breakdown:</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-blue-700">
                <span>Base Rent:</span>
                <span className="font-semibold">₹{agreement.monthlyBaseRent?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-blue-700">
                <span>GST @ 18%:</span>
                <span className="font-semibold">₹{agreement.monthlyGST?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600 pl-4">
                <span>• CGST (9%):</span>
                <span>₹{(agreement.monthlyGST / 2)?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-blue-600 pl-4">
                <span>• SGST (9%):</span>
                <span>₹{(agreement.monthlyGST / 2)?.toLocaleString()}</span>
              </div>
              <hr className="border-blue-300 my-2" />
              <div className="flex justify-between text-base font-semibold text-blue-900">
                <span>Total Amount:</span>
                <span>₹{parseFloat(amount).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {!agreement?.withGST && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">
              <strong>GST Status:</strong> Not Applicable
              <span className="text-xs text-gray-500 block mt-1">
                This agreement is configured without GST
              </span>
            </p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="submit"
            disabled={!!validationError || !month || !amount}
            className={`px-6 py-3 rounded-lg font-medium transition focus:outline-none focus:ring-2 ${
              validationError || !month || !amount
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
            }`}
          >
            Generate Voucher
          </button>
        </div>
      </form>

      {/* Existing Vouchers Preview */}
      {existingVouchers.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Generated Vouchers:</h3>
          <div className="flex flex-wrap gap-2">
            {existingVouchers.map((v, i) => (
              <span
                key={i}
                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full border border-green-300"
              >
                {v.month}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyVoucherGenerator;