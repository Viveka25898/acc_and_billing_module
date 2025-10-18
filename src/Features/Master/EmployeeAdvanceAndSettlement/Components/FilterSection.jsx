import React from 'react';
import { FiFilter } from "react-icons/fi";

const FilterSection = ({ filters, setFilters }) => {
  return (
    <div className="bg-gray-50 border-b border-gray-200 p-3 md:p-4">
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">Entry Type</label>
          <select
            value={filters.entryType}
            onChange={(e) => setFilters({ ...filters, entryType: e.target.value })}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            <option value="payment">Payment</option>
            <option value="receipt">Receipt</option>
            <option value="journal">Journal</option>
          </select>
        </div>
        
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            <option value="posted">Posted</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        
        <button className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5">
          <FiFilter size={14} />
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default FilterSection;