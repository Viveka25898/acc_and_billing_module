import React from "react";

const RentLedgerHeader = ({ data }) => {
  const glCode = data.glAccount || data.accountCode || "";
  const accountType = data.accountType || data.description || "Expense";
  const financialYear = data.financialYear || "";
  const period = data.period || "";
  const company = data.company || "";
  const opening = data.openingBalance;
  const openingLabel = typeof opening === 'object' && opening !== null
    ? `${(opening.amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })} ${opening.type || ''}`
    : (opening || "0.00");

  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 lg:p-8 rounded-md shadow-md mb-6">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-6">
        RENT EXPENSE BOOKING - ALL LEDGERS VIEW
      </h1>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-xs opacity-90">GL Account Code</div>
          <div className="text-sm font-semibold">{glCode}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Account Type</div>
          <div className="text-sm font-semibold">{accountType}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Financial Year</div>
          <div className="text-sm font-semibold">{financialYear}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Period</div>
          <div className="text-sm font-semibold">{period}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Company</div>
          <div className="text-sm font-semibold">{company}</div>
        </div>
      </div>

      {/* Opening Balance Card */}
      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30 max-w-md">
        <div className="text-xs opacity-90">Opening Balance {opening && opening.date ? `(${opening.date})` : ''}</div>
        <div className="text-xl lg:text-2xl font-bold">{openingLabel}</div>
      </div>
    </div>
  );
};

export default RentLedgerHeader;
