import React from 'react';

const FilterSection = ({ filters, onFilterChange, onPrint }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-gray-50 p-6 border-b border-gray-200 rounded-md mb-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Entry Type
          </label>
          <select
            value={filters.entryType}
            onChange={(e) => handleInputChange('entryType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option>All</option>
            <option>Expenses Only</option>
            <option>Payments Only</option>
          </select>
        </div>
        
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option>All</option>
            <option>Pending</option>
            <option>Posted</option>
            <option>Paid</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => console.log('Apply filter logic')}
            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={onPrint}
            className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
