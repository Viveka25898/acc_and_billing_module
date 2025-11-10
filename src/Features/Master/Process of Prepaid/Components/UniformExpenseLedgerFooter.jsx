import React from "react";

const UniformExpenseLedgerFooter = ({ totalEntries = 0, totalDebit = 0, totalCredit = 0, closingBalance = "₹0.00" }) => {
  // Format amounts
  const formattedTotalDebit = typeof totalDebit === 'number' 
    ? `₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : totalDebit;
  const formattedTotalCredit = typeof totalCredit === 'number' 
    ? `₹${totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : totalCredit;
  const formattedClosingBalance = typeof closingBalance === 'string' 
    ? closingBalance 
    : `₹${closingBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DR`;

  return (
    <div className="flex justify-between items-center bg-gray-50 border-t-2 border-gray-200 p-6">
      <div className="text-sm text-gray-600">
        <p>Total Entries: <span className="font-semibold">{totalEntries}</span></p>
      </div>
      <div className="flex justify-end gap-10 text-right">
        <div>
          <p className="text-xs text-gray-600">Total Debit</p>
          <p className="font-mono text-red-600 font-bold text-lg">{formattedTotalDebit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Total Credit</p>
          <p className="font-mono text-green-700 font-bold text-lg">{formattedTotalCredit}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Closing Balance</p>
          <p className="font-mono text-indigo-600 font-bold text-lg">{formattedClosingBalance}</p>
        </div>
      </div>
    </div>
  );
};

export default UniformExpenseLedgerFooter;
