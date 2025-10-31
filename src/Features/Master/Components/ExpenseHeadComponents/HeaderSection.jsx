import React from 'react';
import ExpenseInfo from './ExpenseInfo';
import BalanceCards from './BalanceCards';
import StatsGrid from './StatsGrid';



const HeaderSection = ({ header, balances, stats }) => {
  return (
    <div className="bg-gradient-to-br from-green-400 to-green-500 text-white p-6">
      <h1 className="text-2xl font-bold mb-5">Expense Head Ledger</h1>
      <ExpenseInfo header={header} />
      <BalanceCards balances={balances} />
      <StatsGrid stats={stats} />
    </div>
  );
};

export default HeaderSection;