// src/components/BankLedger/FilterSection.jsx
import React, { useState } from 'react';

const FilterSection = () => {
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-07-30',
    transactionType: 'All Transactions',
    reconciliationStatus: 'All'
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-50 p-6 border-b border-slate-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
        
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-slate-600 mb-1">Transaction Type</label>
          <select
            value={filters.transactionType}
            onChange={(e) => handleFilterChange('transactionType', e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none bg-white"
          >
            <option>All Transactions</option>
            <option>Receipts Only</option>
            <option>Payments Only</option>
            <option>Vendor Payments</option>
            <option>Employee Advances</option>
            <option>Salary</option>
            <option>Statutory</option>
          </select>
        </div>
        
        
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors">
            Apply Filter
          </button>
          <button className="px-4 py-2 bg-slate-500 text-white rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors">
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;