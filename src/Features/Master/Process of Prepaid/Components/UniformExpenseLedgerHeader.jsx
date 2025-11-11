/* eslint-disable no-unused-vars */
import React from "react";

const UniformExpenseLedgerHeader = ({ totalEntries = 0, totalDebit = 0, closingBalance = "₹0.00" }) => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const financialYear = `${currentYear}-${String(nextYear).slice(-2)}`;
  
  // Format total debit
  const formattedTotalDebit = typeof totalDebit === 'number' 
    ? `₹${totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : totalDebit;

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-t-lg">
      <h1 className="text-2xl font-semibold mb-4">Uniform Expense Ledger</h1>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="opacity-80 text-xs">Ledger Code</p>
          <p className="font-semibold">X2001004</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Account Name</p>
          <p className="font-semibold">UNIFORM EXPENSE</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Group</p>
          <p className="font-semibold">Expense (X2)</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Financial Year</p>
          <p className="font-semibold">{financialYear}</p>
        </div>
      </div>

      <div className="mt-5 grid md:grid-cols-2 gap-4">
        <div className="bg-white/20 p-4 rounded-lg border border-white/30">
          <p className="text-sm mb-1 opacity-90">Total Entries</p>
          <p className="text-2xl font-bold">{totalEntries}</p>
          <p className="opacity-80 text-xs">Amortization Transactions</p>
        </div>
        <div className="bg-white/20 p-4 rounded-lg border border-white/30">
          <p className="text-sm mb-1 opacity-90">Total Expense (Debit)</p>
          <p className="text-2xl font-bold">{formattedTotalDebit}</p>
          <p className="opacity-80 text-xs">Cumulative Amortization</p>
        </div>
      </div>
    </div>
  );
};

export default UniformExpenseLedgerHeader;
