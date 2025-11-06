import React from "react";

const GSTHeader = ({ data }) => {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 lg:p-8 rounded-md shadow-md mb-6">
      <h1 className="text-2xl lg:text-3xl font-semibold mb-4">
        GST Input Ledger – {data.ledgerName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div>
          <div className="text-xs opacity-80">Ledger Code</div>
          <div className="text-sm font-semibold">{data.ledgerCode}</div>
        </div>
        <div>
          <div className="text-xs opacity-80">Ledger Type</div>
          <div className="text-sm font-semibold">{data.type}</div>
        </div>
        <div>
          <div className="text-xs opacity-80">Financial Year</div>
          <div className="text-sm font-semibold">{data.financialYear}</div>
        </div>
        <div>
          <div className="text-xs opacity-80">Period</div>
          <div className="text-sm font-semibold">{data.period}</div>
        </div>
      </div>

      <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30 max-w-sm">
        <div className="text-xs opacity-90">Opening Balance</div>
        <div className="text-lg md:text-xl font-bold">{data.openingBalance}</div>
      </div>
    </div>
  );
};

export default GSTHeader;
