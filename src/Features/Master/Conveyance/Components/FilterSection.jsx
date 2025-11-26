// src/Components/ExpenseHeadComponents/FilterSection.jsx - FIXED VERSION
import React, { useState } from 'react'

const FilterSection = ({ filterOptions, onFilterChange }) => {
  const [filters, setFilters] = useState({
    fromDate: '',
    toDate: '',
    employee: '',
    costCenter: '',
    entryType: '',
  })

  const handleInputChange = (field, value) => {
    const updatedFilters = {
      ...filters,
      [field]: value,
    }
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      fromDate: '',
      toDate: '',
      employee: '',
      costCenter: '',
      entryType: '',
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="bg-gray-50 p-6 border-b border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        {/* From Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        {/* Employee - ✅ FIXED: Now uses unique keys */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Employee</label>
          <select
            value={filters.employee}
            onChange={(e) => handleInputChange('employee', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {filterOptions?.employees?.map((emp, index) => (
              <option key={`employee-${emp.value}-${index}`} value={emp.value}>
                {emp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Cost Center - ✅ FIXED: Now uses unique keys */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Cost Center</label>
          <select
            value={filters.costCenter}
            onChange={(e) => handleInputChange('costCenter', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {filterOptions?.costCenters?.map((cc, index) => (
              <option key={`costcenter-${cc.value}-${index}`} value={cc.value}>
                {cc.label}
              </option>
            ))}
          </select>
        </div>

        {/* Entry Type - ✅ FIXED: Now uses unique keys */}
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Entry Type</label>
          <select
            value={filters.entryType}
            onChange={(e) => handleInputChange('entryType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            {filterOptions?.entryTypes?.map((type, index) => (
              <option key={`entrytype-${type.value}-${index}`} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Button */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium"
        >
          Reset Filters
        </button>
      </div>

      {/* Active Filters Display */}
      {(filters.fromDate ||
        filters.toDate ||
        filters.employee ||
        filters.costCenter ||
        filters.entryType) && (
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs font-semibold text-gray-600">Active Filters:</span>
          {filters.fromDate && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
              From: {filters.fromDate}
              <button
                onClick={() => handleInputChange('fromDate', '')}
                className="hover:text-emerald-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.toDate && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
              To: {filters.toDate}
              <button
                onClick={() => handleInputChange('toDate', '')}
                className="hover:text-emerald-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.employee && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              Employee: {filterOptions?.employees?.find((e) => e.value === filters.employee)?.label}
              <button
                onClick={() => handleInputChange('employee', '')}
                className="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.costCenter && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
              Cost Center:{' '}
              {filterOptions?.costCenters?.find((c) => c.value === filters.costCenter)?.label}
              <button
                onClick={() => handleInputChange('costCenter', '')}
                className="hover:text-purple-900"
              >
                ×
              </button>
            </span>
          )}
          {filters.entryType && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
              Type: {filterOptions?.entryTypes?.find((t) => t.value === filters.entryType)?.label}
              <button
                onClick={() => handleInputChange('entryType', '')}
                className="hover:text-orange-900"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default FilterSection
