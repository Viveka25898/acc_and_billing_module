// src/components/SummarySection.jsx
import React from 'react';

const SummarySection = ({ summaryData }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 p-6 lg:p-8 border-t-2 border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Claims Approved (Credit)</div>
          <div className="text-2xl font-bold text-red-600">₹{formatCurrency(summaryData.totalClaims)}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Payments Made (Debit)</div>
          <div className="text-2xl font-bold text-green-600">₹{formatCurrency(summaryData.totalPayments)}</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Total Visits</div>
          <div className="text-2xl font-bold text-gray-900">{summaryData.totalVisits} visits</div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white p-6 rounded-lg">
          <div className="text-sm opacity-90 mb-2">Outstanding Payable (30-Jul-24)</div>
          <div className="text-2xl font-bold">₹{formatCurrency(summaryData.outstanding)} CR</div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-sm font-semibold text-yellow-800 mb-1 flex items-center">
          <span className="mr-2">⚠️</span>
          Outstanding Details:
        </div>
        <div className="text-xs text-yellow-700">
          • July 2024 Claims (5 visits): ₹4,650.00 - Payment Due: 05-Aug-2024<br />
          • All claims approved and verified by Manager & AE<br />
          • Attachments: Visit reports and bills verified
        </div>
      </div>
    </div>
  );
};

export default SummarySection;