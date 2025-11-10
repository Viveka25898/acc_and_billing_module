import React from "react";

export const FAAssetHeader = ({ info, balances }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-700 to-blue-500 text-white p-6 rounded-t-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Fixed Asset Ledger</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div><p className="opacity-80">Asset Code</p><p className="font-semibold">{info.assetCode}</p></div>
        <div><p className="opacity-80">Asset Category</p><p className="font-semibold">{info.assetCategory}</p></div>
        <div><p className="opacity-80">GL Account Code</p><p className="font-semibold">{info.glAccountCode}</p></div>
        <div><p className="opacity-80">Account Name</p><p className="font-semibold">{info.accountName}</p></div>
        <div><p className="opacity-80">Depreciation Rate</p><p className="font-semibold">{info.depreciationRate}</p></div>
        <div><p className="opacity-80">Depreciation Method</p><p className="font-semibold">{info.depreciationMethod}</p></div>
        <div><p className="opacity-80">Total Assets</p><p className="font-semibold">{info.totalAssets}</p></div>
        <div><p className="opacity-80">Active Assets</p><p className="font-semibold">{info.activeAssets}</p></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {balances.map((b, idx) => (
          <div key={idx} className="bg-white/20 p-4 rounded-md border border-white/30">
            <p className="text-xs mb-1 opacity-90">{b.label}</p>
            <p className="text-xl font-bold">{b.amount}</p>
            <p className="text-xs opacity-80">{b.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};