import React from 'react';

const SummaryCards = ({ data }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white border-b border-gray-200">
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
          Total Invoices (This Period)
        </div>
        <div className="text-2xl font-bold text-red-600 font-mono">
          ₹{formatCurrency(data.totalInvoices)}
        </div>
      </div>
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
          Total Payments Made
        </div>
        <div className="text-2xl font-bold text-green-600 font-mono">
          ₹{formatCurrency(data.totalPayments)}
        </div>
      </div>
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <div className="text-sm text-gray-600 uppercase tracking-wide mb-2">
          Pending Invoices
        </div>
        <div className="text-2xl font-bold text-orange-600">
          {data.pendingInvoices} Invoices
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;