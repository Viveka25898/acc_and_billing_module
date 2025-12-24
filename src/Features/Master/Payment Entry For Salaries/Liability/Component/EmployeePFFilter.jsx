import React, { useState } from 'react'

const EmployeePFFilter = ({ filters, filterOptions, onFilterChange }) => {
  const [showFilters, setShowFilters] = useState(true)

  const handleApplyFilter = () => {
    console.log('Applying filters:', filters)
  }

  const handleResetFilters = () => {
    onFilterChange('dateFrom', '2024-01-01')
    onFilterChange('dateTo', '2024-12-31')
    onFilterChange('month', 'all')
    onFilterChange('voucherType', 'all')
    onFilterChange('status', 'all')
    onFilterChange('voucherSearch', '')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-600 mb-6">
      <div className="p-5 border-b border-green-200 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filter & Search
          </h2>
          <p className="text-sm text-gray-600 mt-1">Filter PF payable transactions</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <div className={`p-5 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={filters.month}
              onChange={(e) => onFilterChange('month', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.months.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
            <select
              value={filters.voucherType}
              onChange={(e) => onFilterChange('voucherType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.voucherTypes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {filterOptions.statuses.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher No.</label>
            <input
              type="text"
              value={filters.voucherSearch}
              onChange={(e) => onFilterChange('voucherSearch', e.target.value)}
              placeholder="Search voucher..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleApplyFilter}
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-600 shadow-md"
          >
            Apply Filter
          </button>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 shadow-md"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeePFFilter
