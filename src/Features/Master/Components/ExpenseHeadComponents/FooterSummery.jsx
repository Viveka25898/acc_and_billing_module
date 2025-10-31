// src/components/FooterSummary.jsx
import React from 'react';

const FooterSummary = ({ summary }) => {
  return (
    <div className="p-5 bg-gray-50 border-t-2 border-gray-200 flex justify-end gap-10">
      <div className="text-right">
        <div className="text-xs text-gray-600 mb-1">Total Debit</div>
        <div className="text-lg font-bold font-mono text-red-600">{summary.totalDebit}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-600 mb-1">Total Credit</div>
        <div className="text-lg font-bold font-mono text-green-600">{summary.totalCredit}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-600 mb-1">Closing Balance</div>
        <div className="text-lg font-bold font-mono text-green-500">{summary.closingBalance}</div>
      </div>
    </div>
  );
};

export default FooterSummary;