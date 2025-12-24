import React, { useState } from 'react'

const LiabilityFilterBar = ({
  filters,
  onFilterChange,
  departments,
  costCenters,
  statusOptions,
  paymentMethods,
}) => {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6 border-l-4 border-green-600">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <div>
          <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Liability Filters
          </h3>
          <p className="text-sm text-gray-600">Filter salary payable transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={
                  showFilters
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                }
              />
            </svg>
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() =>
              onFilterChange('status', filters.status === 'Pending' ? 'All' : 'Pending')
            }
            className={`px-4 py-2 rounded-lg transition-colors shadow-md ${
              filters.status === 'Pending'
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
            }`}
          >
            {filters.status === 'Pending' ? 'Show All' : 'Show Pending Only'}
          </button>
        </div>
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onFilterChange('department', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
          <select
            value={filters.costCenter}
            onChange={(e) => onFilterChange('costCenter', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            {costCenters.map((center) => (
              <option key={center} value={center}>
                {center}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
          <select
            value={filters.paymentMethod}
            onChange={(e) => onFilterChange('paymentMethod', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          >
            {paymentMethods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Batch ID Search
          </label>
          <input
            type="text"
            placeholder="Search by batch ID..."
            value={filters.batchSearch}
            onChange={(e) => onFilterChange('batchSearch', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <svg
              className="w-4 h-4 inline mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            />
            <span className="flex items-center text-gray-500">to</span>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiabilityFilterBar
