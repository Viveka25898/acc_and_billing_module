// src/components/FooterSummary.jsx
import React from 'react';

const val = (v) => (v === undefined || v === null || String(v).trim() === "" ? "-" : String(v));

const FooterSummary = ({ summary }) => {
  const s = summary || {};
  return (
    <div className="p-5 bg-gray-50 border-t-2 border-gray-200 flex flex-wrap justify-end gap-6 sm:gap-10">
      <div className="text-right">
        <div className="text-xs font-semibold text-gray-600 mb-1">Total Debit</div>
        <div className="text-lg font-bold font-mono text-red-600">{val(s.totalDebit)}</div>
      </div>
      <div className="text-right">
        <div className="text-xs font-semibold text-gray-600 mb-1">Total Credit</div>
        <div className="text-lg font-bold font-mono text-green-600">{val(s.totalCredit)}</div>
      </div>
      <div className="text-right">
        <div className="text-xs font-semibold text-gray-600 mb-1">Closing Balance</div>
        <div className="text-lg font-bold font-mono text-emerald-600">{val(s.closingBalance)}</div>
      </div>
    </div>
  );
};

export default FooterSummary;