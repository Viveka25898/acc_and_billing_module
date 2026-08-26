// src/components/BalanceCards.jsx
import React from 'react';

const val = (v) => (v === undefined || v === null || String(v).trim() === "" ? "-" : String(v));

const BalanceCards = ({ balances }) => {
  const b = balances || {};
  const opening = b.opening || {};
  const periodExpenses = b.periodExpenses || {};
  const closing = b.closing || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      <div className="bg-white/20 p-4 rounded-lg border border-white/30 backdrop-blur-xs">
        <div className="text-xs mb-1 opacity-90">Opening Balance</div>
        <div className="text-2xl font-bold">{val(opening.amount)}</div>
        <div className="text-xs opacity-90 mt-1">{val(opening.type)}</div>
      </div>
      <div className="bg-white/20 p-4 rounded-lg border border-white/30 backdrop-blur-xs">
        <div className="text-xs mb-1 opacity-90">Period Expenses</div>
        <div className="text-2xl font-bold">{val(periodExpenses.amount)}</div>
        <div className="text-xs opacity-90 mt-1">{val(periodExpenses.type)}</div>
      </div>
      <div className="bg-white/20 p-4 rounded-lg border border-white/30 backdrop-blur-xs">
        <div className="text-xs mb-1 opacity-90">Closing Balance</div>
        <div className="text-2xl font-bold">{val(closing.amount)}</div>
        <div className="text-xs opacity-90 mt-1">{val(closing.type)}</div>
      </div>
    </div>
  );
};

export default BalanceCards;