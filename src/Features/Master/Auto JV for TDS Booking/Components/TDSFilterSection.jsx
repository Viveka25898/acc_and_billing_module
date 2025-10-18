// src/features/Process of Auto JV for TDS Booking/Components/TDSFilterSection.jsx
import React, { useState } from 'react';

const TDSFilterSection = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleApplyFilters = () => {
    setFilters(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      fromDate: '2024-04-01',
      toDate: '2024-05-31',
      entryType: '',
      vendor: ''
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
  };

  return (
    <div className="p-6 bg-gray-50 border-b border-gray-200">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
        {/* Date Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={localFilters.fromDate}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, fromDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={localFilters.toDate}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, toDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Entry Type
            </label>
            <select
              value={localFilters.entryType}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, entryType: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="deduction">TDS Deduction</option>
              <option value="payment">Payment to Govt</option>
              <option value="reversal">Reversal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              value={localFilters.vendor}
              onChange={(e) => setLocalFilters(prev => ({ ...prev, vendor: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">All Vendors</option>
              <option value="VEN-ABC001">ABC Suppliers</option>
              <option value="VEN-DEF003">DEF Legal</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <button
            onClick={handleApplyFilters}
            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-white text-purple-600 border border-purple-600 rounded-md hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Additional Actions */}
        <div className="flex gap-3 w-full lg:w-auto">
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm">
            Download 26AS
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm">
            TDS Report
          </button>
          <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors text-sm">
            Export Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TDSFilterSection;