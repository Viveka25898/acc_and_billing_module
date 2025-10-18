// src/features/Process of Auto JV for TDS Booking/Components/TDSSummaryCards.jsx
import React from 'react';

const TDSSummaryCards = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white border-b border-gray-200">
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
          Total TDS Deducted
        </div>
        <div className="text-xl font-bold text-purple-600 font-mono">
          ₹{formatCurrency(data.totalTDSDeducted)}
        </div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
          TDS Paid to Govt
        </div>
        <div className="text-xl font-bold text-green-600 font-mono">
          ₹{formatCurrency(data.tdsPaidToGovt)}
        </div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
          TDS Payable
        </div>
        <div className="text-xl font-bold text-red-600 font-mono">
          ₹{formatCurrency(data.tdsPayable)}
        </div>
      </div>
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 uppercase tracking-wide mb-2">
          No. of Deductions
        </div>
        <div className="text-xl font-bold text-blue-600">
          {data.numberOfDeductions} Entries
        </div>
      </div>
    </div>
  );
};

export default TDSSummaryCards;