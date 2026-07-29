import React from "react";

const HKSummaryCards = ({ summary = {} }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white border-b border-gray-200 p-6">
    <div className="text-center bg-gray-50 p-4 rounded-md">
      <p className="text-xs text-gray-500 uppercase">Total Invoices (This Period)</p>
      <p className="text-xl font-bold text-red-600">{summary.totalInvoices}</p>
    </div>
    <div className="text-center bg-gray-50 p-4 rounded-md">
      <p className="text-xs text-gray-500 uppercase">Total Payments Made</p>
      <p className="text-xl font-bold text-green-600">{summary.totalPayments}</p>
    </div>
    <div className="text-center bg-gray-50 p-4 rounded-md">
      <p className="text-xs text-gray-500 uppercase">Pending Invoices</p>
      <p className="text-xl font-bold text-orange-500">{summary.pendingInvoices}</p>
    </div>
  </div>
);

export default HKSummaryCards;
