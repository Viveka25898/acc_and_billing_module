import React, { useState } from 'react'

const ESICPayableFilterBar = ({
  filters,
  onFilterChange,
  months,
  paymentStatuses,
  voucherTypes,
}) => {
  const [showFilters, setShowFilters] = useState(true)

  return (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-green-600 mb-6">
      <div className="p-5 border-b border-green-200 flex justify-between items-center">
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
            Filter & Search
          </h3>
          <p className="text-sm text-gray-600 mt-1">Filter employer ESIC payable transactions</p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
        >
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <div className={`p-5 transition-all duration-300 ${showFilters ? 'block' : 'hidden'}`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ESIC Month</label>
          <select
            value={filters.month}
            onChange={(e) => onFilterChange('month', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
          <select
            value={filters.paymentStatus}
            onChange={(e) => onFilterChange('paymentStatus', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {paymentStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
          <select
            value={filters.voucherType}
            onChange={(e) => onFilterChange('voucherType', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {voucherTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Show Only</label>
          <select
            value={filters.showOnly}
            onChange={(e) => onFilterChange('showOnly', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Transactions</option>
            <option value="credit">Liability Entries (Credit)</option>
            <option value="debit">Payment Entries (Debit)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ESI Wages Range (₹)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min Wages"
              value={filters.minWages}
              onChange={(e) => onFilterChange('minWages', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="number"
              placeholder="Max Wages"
              value={filters.maxWages}
              onChange={(e) => onFilterChange('maxWages', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            TRRN / Challan Search
          </label>
          <input
            type="text"
            placeholder="Search by TRRN or Challan number..."
            value={filters.challanSearch}
            onChange={(e) => onFilterChange('challanSearch', e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  )
}

export default ESICPayableFilterBar
