/* eslint-disable no-unused-vars */
import React from 'react';

const FilterSection = ({ filters, onFilterChange, onApplyFilter, onResetFilter, onPrint }) => {
  const handleInputChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
      page: 1, // reset to page 1 on filter tweak
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onApplyFilter) {
      onApplyFilter();
    }
  };

  return (
    <div className="bg-white p-4 md:p-6 border border-gray-200 rounded-lg mb-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Ledger Entries
        </h3>
        {onPrint && (
          <button
            onClick={onPrint}
            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Ledger
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end" onKeyDown={handleKeyDown}>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50/50"
          />
        </div>
      </div>


      <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          type="button"
          onClick={onResetFilter}
          className="px-4 py-2 bg-gray-100 text-gray-700 text-xs md:text-sm font-medium rounded-md hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          Reset Filters
        </button>
        <button
          type="button"
          onClick={onApplyFilter}
          className="px-5 py-2 bg-emerald-600 text-white text-xs md:text-sm font-medium rounded-md hover:bg-emerald-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Apply Filter
        </button>
      </div>
    </div>
  );
};

export default FilterSection;

