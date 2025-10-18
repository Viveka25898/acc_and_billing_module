import React from 'react';

const VendorHeader = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-green-600 via-blgreenue-700 to-green-800 text-white p-6 md:p-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Vendor Ledger</h1>
      
      {/* Vendor Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-sm opacity-90">Vendor Code</div>
          <div className="text-lg font-semibold">{data.vendorCode}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Vendor Name</div>
          <div className="text-lg font-semibold">{data.vendorName}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">GSTIN</div>
          <div className="text-lg font-semibold">{data.gstin}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">PAN</div>
          <div className="text-lg font-semibold">{data.pan}</div>
        </div>
      </div>

      {/* Vendor Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-sm opacity-90">GL Account Code</div>
          <div className="text-lg font-semibold">{data.glAccountCode}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Account Name</div>
          <div className="text-lg font-semibold">{data.accountName}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">TDS Section</div>
          <div className="text-lg font-semibold">{data.tdsSection}</div>
        </div>
        <div className="space-y-1">
          <div className="text-sm opacity-90">Payment Terms</div>
          <div className="text-lg font-semibold">{data.paymentTerms}</div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="text-sm opacity-90">Opening Balance ({data.openingBalance.date})</div>
          <div className="text-2xl md:text-3xl font-bold">₹{formatCurrency(data.openingBalance.amount)}</div>
          <div className="text-sm opacity-90">{data.openingBalance.type}</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="text-sm opacity-90">Current Outstanding</div>
          <div className="text-2xl md:text-3xl font-bold">₹{formatCurrency(data.currentOutstanding)}</div>
          <div className="text-sm opacity-90">Credit Balance</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
          <div className="text-sm opacity-90">Overdue Amount</div>
          <div className="text-2xl md:text-3xl font-bold">₹{formatCurrency(data.overdueAmount)}</div>
          <div className="text-sm opacity-90">Aging 30 Days</div>
        </div>
      </div>
    </div>
  );
};

export default VendorHeader;