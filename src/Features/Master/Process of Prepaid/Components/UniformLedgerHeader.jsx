import React from "react";

const UniformLedgerHeader = ({ accountDetails }) => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  const financialYear = `${currentYear}-${String(nextYear).slice(-2)}`;
  
  // Get account details or use defaults
  const accountCode = accountDetails?.accountCode || "A3005001";
  const accountName = accountDetails?.accountName || "UNIFORM EXPENSE (Prepaid)";
  const remainingBalance = accountDetails?.balances?.[2]?.amount || "₹0.00";
  const totalPrepaid = accountDetails?.balances?.[0]?.amount || "₹0.00";
  const totalAmortized = accountDetails?.balances?.[1]?.amount || "₹0.00";

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-t-lg">
      <h1 className="text-2xl font-semibold mb-4">
        Uniform Prepaid Expense Ledger
      </h1>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="opacity-80 text-xs">Ledger Code</p>
          <p className="font-semibold">{accountCode}</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Account Name</p>
          <p className="font-semibold">{accountName}</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Financial Year</p>
          <p className="font-semibold">{financialYear}</p>
        </div>
        <div>
          <p className="opacity-80 text-xs">Reporting Period</p>
          <p className="font-semibold">Apr {currentYear} - Mar {nextYear}</p>
        </div>
      </div>

      <div className="mt-5 grid md:grid-cols-3 gap-4">
        <div className="bg-white/20 p-4 rounded-lg border border-white/30">
          <p className="text-sm mb-1 opacity-90">Total Prepaid Amount</p>
          <p className="text-2xl font-bold">{totalPrepaid}</p>
          <p className="opacity-80 text-xs">Asset (Debit)</p>
        </div>
        <div className="bg-white/20 p-4 rounded-lg border border-white/30">
          <p className="text-sm mb-1 opacity-90">Total Amortized</p>
          <p className="text-2xl font-bold">{totalAmortized}</p>
          <p className="opacity-80 text-xs">Amortization (Credit)</p>
        </div>
        <div className="bg-white/20 p-4 rounded-lg border border-white/30">
          <p className="text-sm mb-1 opacity-90">Remaining Balance</p>
          <p className="text-2xl font-bold">{remainingBalance}</p>
          <p className="opacity-80 text-xs">Net Prepaid Asset</p>
        </div>
      </div>
    </div>
  );
};

export default UniformLedgerHeader;
