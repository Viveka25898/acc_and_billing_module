// src/components/FilterSection.jsx
import React, { useState } from 'react';

const FilterSection = ({ filterOptions, onFilterChange }) => {
  const [filters, setFilters] = useState({
    fromDate: '2024-04-01',
    toDate: '2024-05-31',
    employee: '',
    costCenter: '',
    entryType: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);
  };

  return (
    <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 items-center">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">From Date</label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => handleFilterChange('fromDate', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">To Date</label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => handleFilterChange('toDate', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Employee</label>
        <select
          value={filters.employee}
          onChange={(e) => handleFilterChange('employee', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {filterOptions.employees.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Cost Center</label>
        <select
          value={filters.costCenter}
          onChange={(e) => handleFilterChange('costCenter', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {filterOptions.costCenters.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Entry Type</label>
        <select
          value={filters.entryType}
          onChange={(e) => handleFilterChange('entryType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm"
        >
          {filterOptions.entryTypes.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      
      <button 
        onClick={handleApplyFilter}
        className="px-4 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 self-end"
      >
        Apply Filter
      </button>
      
      <div className="ml-auto flex gap-2">
        <button className="px-4 py-2 bg-white text-green-500 border border-green-500 rounded text-sm hover:bg-green-50">
          Export to Excel
        </button>
        <button className="px-4 py-2 bg-white text-green-500 border border-green-500 rounded text-sm hover:bg-green-50">
          Print
        </button>
      </div>
    </div>
  );
};

export default FilterSection;