// src/components/FilterSection.jsx
import React, { useState } from 'react';

const FilterSection = ({ filterOptions = {}, onFilterChange }) => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    employee: '',
    costCenter: '',
    entryType: '',
    search: ''
  });

  const employeesList = filterOptions?.employees || [{ value: '', label: 'All Employees' }];
  const costCentersList = filterOptions?.costCenters || [{ value: '', label: 'All' }];
  const entryTypesList = filterOptions?.entryTypes || [{ value: '', label: 'All' }];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApplyFilter = () => {
    onFilterChange(filters);
  };

  const handleResetFilter = () => {
    const reset = {
      fromDate: '',
      toDate: '',
      employee: '',
      costCenter: '',
      entryType: '',
      search: ''
    };
    setFilters(reset);
    onFilterChange(reset);
  };

  return (
    <div className="p-5 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4 items-center">
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">From Date</label>
        <input
          type="date"
          value={filters.fromDate}
          onChange={(e) => handleFilterChange('fromDate', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">To Date</label>
        <input
          type="date"
          value={filters.toDate}
          onChange={(e) => handleFilterChange('toDate', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">Employee</label>
        <select
          value={filters.employee}
          onChange={(e) => handleFilterChange('employee', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          {employeesList.map((option, idx) => (
            <option key={option.value || idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">Cost Center</label>
        <select
          value={filters.costCenter}
          onChange={(e) => handleFilterChange('costCenter', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          {costCentersList.map((option, idx) => (
            <option key={option.value || idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">Entry Type</label>
        <select
          value={filters.entryType}
          onChange={(e) => handleFilterChange('entryType', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        >
          {entryTypesList.map((option, idx) => (
            <option key={option.value || idx} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-600 mb-1">Search</label>
        <input
          type="text"
          placeholder="Search voucher, narration..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 self-end mt-2 sm:mt-0">
        <button
          onClick={handleApplyFilter}
          className="px-4 py-2 bg-green-600 text-white rounded text-sm font-semibold hover:bg-green-700 transition cursor-pointer"
        >
          Apply Filter
        </button>
        <button
          onClick={handleResetFilter}
          className="px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm font-semibold hover:bg-gray-300 transition cursor-pointer"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterSection;