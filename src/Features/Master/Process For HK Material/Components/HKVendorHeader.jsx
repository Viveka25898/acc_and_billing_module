import React from "react";

const HKVendorHeader = ({ info, balances }) => {
  return (
    <div className="bg-gradient-to-r from-green-700 to-green-400 text-white p-6 rounded-t-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Vendor Ledger</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        <div><p className="opacity-80">Vendor Code</p><p className="font-semibold">{info.vendorCode}</p></div>
        <div><p className="opacity-80">Vendor Name</p><p className="font-semibold">{info.vendorName}</p></div>
        <div><p className="opacity-80">GSTIN</p><p className="font-semibold">{info.gstin}</p></div>
        <div><p className="opacity-80">PAN</p><p className="font-semibold">{info.pan}</p></div>
        <div><p className="opacity-80">GL Account Code</p><p className="font-semibold">{info.glAccountCode}</p></div>
        <div><p className="opacity-80">Account Name</p><p className="font-semibold">{info.accountName}</p></div>
        <div><p className="opacity-80">TDS Section</p><p className="font-semibold">{info.tdsSection}</p></div>
        <div><p className="opacity-80">Payment Terms</p><p className="font-semibold">{info.paymentTerms}</p></div>
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

export default HKVendorHeader;
