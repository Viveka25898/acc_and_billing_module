import React from "react";

const VendorHeader = ({ info }) => {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 lg:p-8 rounded-md shadow-md">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-2">
        Ledger: {info.ledgerCode} ({info.displayName})
      </h1>
      <p className="text-sm opacity-90 mb-4">
        Type: {info.type} | Parent: {info.parent}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="space-y-1">
          <div className="text-xs opacity-90">GL Account Code</div>
          <div className="text-sm font-semibold">{info.ledgerCode}</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs opacity-90">Financial Year</div>
          <div className="text-sm font-semibold">2024-25</div>
        </div>

        <div className="space-y-1">
          <div className="text-xs opacity-90">Period</div>
          <div className="text-sm font-semibold">{info.period}</div>
        </div>
      </div>

      <div className="mt-4 bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30 max-w-xs">
        <div className="text-xs opacity-90">Opening Balance</div>
        <div className="text-xl md:text-2xl font-bold">{info.openingBalanceLabel}</div>
      </div>
    </div>
  );
};

export default VendorHeader;
