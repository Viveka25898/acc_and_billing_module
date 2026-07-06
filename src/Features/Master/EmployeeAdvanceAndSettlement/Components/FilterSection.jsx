import React, { useState, useEffect } from 'react';
import { FiFilter } from "react-icons/fi";

const FilterSection = ({ filters, setFilters, onApply }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  // Sync with parent filters if they are reset/changed from outside
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleApplyClick = (e) => {
    e.preventDefault()
    setFilters(localFilters)
    if (onApply) {
      onApply(localFilters)
    }
  }

  const handleClearClick = (e) => {
    e.preventDefault()
    const cleared = {
      fromDate: '',
      toDate: '',
      entryType: '',
      status: '',
      searchText: '',
    }
    setLocalFilters(cleared)
    setFilters(cleared)
    if (onApply) {
      onApply(cleared)
    }
  }

  return (
    <div className="bg-gray-50 border-b border-gray-200 p-3 md:p-4">
      <form onSubmit={handleApplyClick} className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            value={localFilters.fromDate || ''}
            onChange={(e) => handleFilterChange('fromDate', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">To Date</label>
          <input
            type="date"
            value={localFilters.toDate || ''}
            onChange={(e) => handleFilterChange('toDate', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex-1 min-w-[150px] max-w-[200px]">
          <label className="block text-[11px] text-gray-600 mb-1">Entry Type</label>
          <select
            value={localFilters.entryType || ''}
            onChange={(e) => handleFilterChange('entryType', e.target.value)}
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
            value={localFilters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All</option>
            <option value="posted">Posted</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="px-3 py-1.5 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors flex items-center gap-1.5 h-[32px]"
          >
            <FiFilter size={14} />
            Apply Filter
          </button>
          
          <button
            type="button"
            onClick={handleClearClick}
            className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-xs font-medium hover:bg-gray-300 transition-colors h-[32px]"
          >
            Clear Filter
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterSection;