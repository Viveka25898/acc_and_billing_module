import React from 'react';

const SummarySection = ({ summary }) => {
  if (!summary) {
    return (
      <div className="bg-slate-50 p-8 border-t-2 border-slate-200">
        <div className="text-center text-gray-500">Loading summary...</div>
      </div>
    );
  }

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === 'N/A' || amount === '-') return '0.00'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '0.00'
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const totalReceipts = summary.totalReceipts ?? summary.totalDebit ?? 0;
  const totalPayments = summary.totalPayments ?? summary.totalCredit ?? 0;
  const closingBalance = summary.closingBalance ?? 0;
  const balanceType = summary.balanceType || 'DR';

  return (
    <div className="bg-slate-50 p-8 border-t-2 border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Total Receipts (DR)</div>
          <div className="text-2xl font-bold text-red-600">₹{formatAmount(totalReceipts)}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Total Payments (CR)</div>
          <div className="text-2xl font-bold text-green-600">₹{formatAmount(totalPayments)}</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="text-sm opacity-90 mb-2">Closing Balance</div>
          <div className="text-2xl font-bold">₹{formatAmount(closingBalance)} {balanceType}</div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;