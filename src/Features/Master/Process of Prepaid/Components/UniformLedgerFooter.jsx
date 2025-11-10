import React from "react";

const UniformLedgerFooter = ({ totalEntries = 0, totalPrepaid = "₹0.00", totalAmortized = "₹0.00", remainingBalance = "₹0.00" }) => {
  return (
    <div className="flex justify-between items-center bg-gray-50 border-t-2 border-gray-200 p-6">
      <div className="text-sm text-gray-600">
        <p>Total Entries: <span className="font-semibold">{totalEntries}</span></p>
      </div>
      <div className="flex justify-end gap-10 text-right">
        <div>
          <p className="text-xs text-gray-600">Total Prepaid</p>
          <p className="font-mono text-red-600 font-bold text-lg">{totalPrepaid}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Cumulative Amortization</p>
          <p className="font-mono text-green-700 font-bold text-lg">{totalAmortized}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Closing Balance</p>
          <p className="font-mono text-indigo-600 font-bold text-lg">{remainingBalance}</p>
        </div>
      </div>
    </div>
  );
};

export default UniformLedgerFooter;
