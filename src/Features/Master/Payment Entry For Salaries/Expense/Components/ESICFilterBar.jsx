import React, { useState } from 'react'

const ESICFilterBar = ({ filters, onFilterChange, onReset }) => {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <div className="bg-white rounded-lg shadow-lg mb-6">
      <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-t-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              ESIC Contribution Filters
            </h3>
            <p className="text-sm text-green-100 mt-1">
              Filter ESIC transactions by various criteria
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-colors font-medium flex items-center gap-2"
            >
              {showFilters ? '▲ Hide Filters' : '▼ Show Filters'}
            </button>
          </div>
        </div>
      </div>

      <div className={`p-6 border-t border-gray-200 ${showFilters ? 'block' : 'hidden'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterChange('fromDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterChange('toDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
            <select
              value={filters.voucherType}
              onChange={(e) => onFilterChange('voucherType', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Types</option>
              <option value="Payment">Payment</option>
              <option value="Journal">Journal</option>
              <option value="Contra">Contra</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
            <select
              value={filters.costCenter}
              onChange={(e) => onFilterChange('costCenter', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="All">All Centers</option>
              <option value="Main Office">Main Office</option>
              <option value="Branch 1">Branch 1</option>
              <option value="Branch 2">Branch 2</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onReset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  )
}

export default ESICFilterBar
