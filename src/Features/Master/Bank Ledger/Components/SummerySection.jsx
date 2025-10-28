// src/components/BankLedger/SummarySection.jsx
import React from 'react';

const SummarySection = () => {
  return (
    <div className="bg-slate-50 p-8 border-t-2 border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Total Receipts (DR)</div>
          <div className="text-2xl font-bold text-red-600">₹80,82,500.00</div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-sm text-slate-600 mb-2">Total Payments (CR)</div>
          <div className="text-2xl font-bold text-green-600">₹63,84,000.00</div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="text-sm opacity-90 mb-2">Closing Balance (30-Jul-24)</div>
          <div className="text-2xl font-bold">₹21,98,500.00 DR</div>
        </div>
      </div>
    </div>
  );
};

export default SummarySection;