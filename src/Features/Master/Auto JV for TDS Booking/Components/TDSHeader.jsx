// src/features/Process of Auto JV for TDS Booking/Components/TDSHeader.jsx
import React from 'react';

const TDSHeader = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">TDS Payable Ledger</h1>
      
      {/* TDS Section Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-sm opacity-90">TDS Section</div>
          <div className="text-lg font-semibold">{data.sectionCode} - {data.sectionName}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">TDS Rate</div>
          <div className="text-lg font-semibold">{data.tdsRate}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">GL Account Code</div>
          <div className="text-lg font-semibold">{data.glAccountCode}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Account Name</div>
          <div className="text-lg font-semibold">{data.accountName}</div>
        </div>
      </div>

      {/* Period Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-sm opacity-90">Financial Year</div>
          <div className="text-lg font-semibold">{data.financialYear}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Quarter</div>
          <div className="text-lg font-semibold">{data.quarter}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Due Date for Payment</div>
          <div className="text-lg font-semibold">{data.dueDate}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Days Remaining</div>
          <div className="text-lg font-semibold">{data.daysRemaining} Days</div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="text-sm opacity-90">Opening Balance ({data.openingBalance.date})</div>
          <div className="text-2xl md:text-3xl font-bold">₹{formatCurrency(data.openingBalance.amount)}</div>
          <div className="text-sm opacity-90">{data.openingBalance.type}</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="text-sm opacity-90">Current Outstanding</div>
          <div className="text-2xl md:text-3xl font-bold">₹{formatCurrency(data.currentOutstanding)}</div>
          <div className="text-sm opacity-90">Credit Balance</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="text-sm opacity-90">TDS Deducted (This Period)</div>
          <div className="text-2xl md:text-3xl font-bold">₹{formatCurrency(data.tdsDeducted)}</div>
          <div className="text-sm opacity-90">Apr-May 2024</div>
        </div>
      </div>
    </div>
  );
};

export default TDSHeader;