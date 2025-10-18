import React from 'react';

const FooterSummary = ({ entries }) => {
  const totalDebit = entries.reduce((sum, entry) => sum + (entry.debit || 0), 0);
  const totalCredit = entries.reduce((sum, entry) => sum + (entry.credit || 0), 0);
  const closingBalance = entries[entries.length - 1]?.balance || 0;
  const balanceType = entries[entries.length - 1]?.balanceType || 'DR';

  const formatAmount = (amount) => {
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-gray-50 border-t-2 border-gray-200 p-3 md:p-4">
      <div className="flex flex-col sm:flex-row justify-end gap-4 md:gap-8">
        <div className="text-right">
          <div className="text-[11px] text-gray-600 mb-1">Total Debit</div>
          <div className="text-base md:text-lg font-bold font-mono text-red-600">
            ₹{formatAmount(totalDebit)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-600 mb-1">Total Credit</div>
          <div className="text-base md:text-lg font-bold font-mono text-green-600">
            ₹{formatAmount(totalCredit)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-gray-600 mb-1">Closing Balance</div>
          <div className="text-base md:text-lg font-bold font-mono text-indigo-600">
            ₹{formatAmount(closingBalance)} {balanceType}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSummary;