// src/components/BalanceCards.jsx
import React from 'react';

const BalanceCards = ({ balances }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      <div className="bg-white/20 p-4 rounded-lg border border-white/30">
        <div className="text-xs mb-1 opacity-90">Opening Balance (01-Apr-2024)</div>
        <div className="text-2xl font-bold">{balances.opening.amount}</div>
        <div className="text-xs opacity-90 mt-1">{balances.opening.type}</div>
      </div>
      <div className="bg-white/20 p-4 rounded-lg border border-white/30">
        <div className="text-xs mb-1 opacity-90">Period Expenses</div>
        <div className="text-2xl font-bold">{balances.periodExpenses.amount}</div>
        <div className="text-xs opacity-90 mt-1">{balances.periodExpenses.type}</div>
      </div>
      <div className="bg-white/20 p-4 rounded-lg border border-white/30">
        <div className="text-xs mb-1 opacity-90">Closing Balance (31-May-2024)</div>
        <div className="text-2xl font-bold">{balances.closing.amount}</div>
        <div className="text-xs opacity-90 mt-1">{balances.closing.type}</div>
      </div>
    </div>
  );
};

export default BalanceCards;