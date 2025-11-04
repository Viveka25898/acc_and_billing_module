import React from 'react';

const LedgerHeader = ({ ledgerInfo }) => {
  return (
    <div className="bg-gradient-to-br from-green-600 to-green-700 text-white p-6 lg:p-8">
      {/* Main Title */}
      <h1 className="text-2xl lg:text-3xl font-semibold mb-6 flex items-center gap-3">
        <span className="text-3xl">👷</span>
        {ledgerInfo.ledgerCode} - {ledgerInfo.accountName}
      </h1>
      
      {/* Account Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-xs opacity-90">GL Account Code</div>
          <div className="text-sm font-semibold">{ledgerInfo.ledgerCode}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Account Name</div>
          <div className="text-sm font-semibold">{ledgerInfo.accountName}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Account Type</div>
          <div className="text-sm font-semibold">{ledgerInfo.accountType}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Description</div>
          <div className="text-sm font-semibold">{ledgerInfo.description}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Financial Year</div>
          <div className="text-sm font-semibold">{ledgerInfo.financialYear}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Period</div>
          <div className="text-sm font-semibold">{ledgerInfo.period}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Total Sites</div>
          <div className="text-sm font-semibold">{ledgerInfo.totalSites}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Total Relievers</div>
          <div className="text-sm font-semibold">{ledgerInfo.totalRelievers}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-90">Total Transactions</div>
          <div className="text-sm font-semibold">{ledgerInfo.totalTransactions}</div>
        </div>
      </div>

      {/* Opening Balance Card */}
      <div className="bg-green-500 bg-opacity-20 rounded-lg p-4 mt-4 border border-green-400 border-opacity-30">
        <div className="text-xs opacity-90">Opening Balance (01-Apr-2024)</div>
        <div className="text-xl lg:text-2xl font-bold">{ledgerInfo.openingBalance}</div>
        <div className="text-xs opacity-80 mt-1">
          Expense Account | Temporary Staff Coverage
        </div>
      </div>
      
    </div>
  );
};

export default LedgerHeader;