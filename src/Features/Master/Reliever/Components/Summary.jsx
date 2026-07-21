import React from 'react';

const Summary = ({ summary, balanceType = 'DR' }) => {
  const formatCurrency = (amount) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-gradient-to-r from-green-400 to-green-500 text-white p-6 md:p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="text-center">
          <h4 className="text-xs md:text-sm opacity-90 mb-2 uppercase tracking-wide">
            Opening Balance
          </h4>
          <p className="text-lg md:text-xl font-bold">
            {formatCurrency(summary.openingBalance)}
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-xs md:text-sm opacity-90 mb-2 uppercase tracking-wide">
            Total Debit
          </h4>
          <p className="text-lg md:text-xl font-bold">
            {formatCurrency(summary.totalDebit)}
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-xs md:text-sm opacity-90 mb-2 uppercase tracking-wide">
            Total Credit
          </h4>
          <p className="text-lg md:text-xl font-bold">
            {formatCurrency(summary.totalCredit)}
          </p>
        </div>
        <div className="text-center">
          <h4 className="text-xs md:text-sm opacity-90 mb-2 uppercase tracking-wide">
            Closing Balance
          </h4>
          <p className="text-lg md:text-xl font-bold">
            {formatCurrency(summary.closingBalance)} {balanceType}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Summary;