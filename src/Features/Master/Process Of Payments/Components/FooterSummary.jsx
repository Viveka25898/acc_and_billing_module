import React from 'react';

const FooterSummary = ({ entries }) => {
  const calculateTotals = () => {
    const totals = entries.reduce(
      (acc, entry) => {
        acc.totalDebit += entry.debit || 0;
        acc.totalCredit += entry.credit || 0;
        return acc;
      },
      { totalDebit: 0, totalCredit: 0 }
    );

    const closingBalance = totals.totalCredit - totals.totalDebit;
    
    return {
      totalDebit: totals.totalDebit,
      totalCredit: totals.totalCredit,
      closingBalance: Math.abs(closingBalance),
      balanceType: closingBalance >= 0 ? 'CR' : 'DR'
    };
  };

  const { totalDebit, totalCredit, closingBalance, balanceType } = calculateTotals();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-gray-50 border-t border-gray-200 p-6">
      <div className="flex flex-col md:flex-row justify-end gap-8">
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Total Debit (Payments + Adjustments)</div>
          <div className="text-lg font-bold text-green-600 font-mono">
            ₹{formatCurrency(totalDebit)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Total Credit (Invoices)</div>
          <div className="text-lg font-bold text-red-600 font-mono">
            ₹{formatCurrency(totalCredit)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 mb-1">Closing Balance (Outstanding)</div>
          <div className="text-lg font-bold text-blue-600 font-mono">
            ₹{formatCurrency(closingBalance)} {balanceType}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterSummary;