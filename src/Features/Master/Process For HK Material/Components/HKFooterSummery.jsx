import React from "react";

const HKFooterSummary = ({ totals }) => {
  // Default values if totals not provided
  const totalDebit = totals?.totalDebit || "0.00";
  const totalCredit = totals?.totalCredit || "0.00";
  const closingBalance = totals?.closingBalance || "0.00";
  const balanceType = totals?.balanceType || "CR";

  return (
    <div className="flex flex-wrap justify-end gap-8 bg-gray-50 border-t border-gray-200 p-6">
      <div>
        <p className="text-xs text-gray-600">Total Debit</p>
        <p className="font-bold text-green-700 text-lg">₹{totalDebit}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600">Total Credit</p>
        <p className="font-bold text-red-700 text-lg">₹{totalCredit}</p>
      </div>
      <div>
        <p className="text-xs text-gray-600">Closing Balance</p>
        <p className={`font-bold text-lg ${balanceType === 'CR' ? 'text-red-600' : 'text-green-600'}`}>
          ₹{closingBalance} {balanceType}
        </p>
      </div>
    </div>
  );
};

export default HKFooterSummary;
