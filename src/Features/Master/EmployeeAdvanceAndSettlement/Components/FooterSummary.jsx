import React from 'react';

const FooterSummary = ({ summary }) => {
  if (!summary) return null;

  const parseVal = (val) => {
    if (val === undefined || val === null || val === 'N/A' || val === '-') return 0
    const num = typeof val === 'string' ? parseFloat(val) : val
    return isNaN(num) ? 0 : num
  }

  const totalDebit = parseVal(summary.totalDebit)
  const totalCredit = parseVal(summary.totalCredit)
  const closingBalance = parseVal(summary.closingBalance)
  const balanceType = summary.closingBalanceType || summary.balanceType || 'DR'

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