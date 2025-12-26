import React, { useState } from 'react'
import { Filter, X } from 'lucide-react'

const LeaveProvisionFilter = ({ filters, onFilterChange, onReset }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-white" />
          <h2 className="text-lg font-semibold text-white">Filters</h2>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:text-green-100 transition-colors"
        >
          {isExpanded ? <X className="w-5 h-5" /> : <Filter className="w-5 h-5" />}
        </button>
      </div>

      {/* Filter Controls */}
      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.fromDate}
                onChange={(e) => onFilterChange('fromDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.toDate}
                onChange={(e) => onFilterChange('toDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Voucher Type</label>
              <select
                value={filters.voucherType}
                onChange={(e) => onFilterChange('voucherType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All">All Types</option>
                <option value="Journal">Journal</option>
                <option value="Payment">Payment</option>
                <option value="Contra">Contra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cost Center</label>
              <select
                value={filters.costCenter}
                onChange={(e) => onFilterChange('costCenter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="All">All Centers</option>
                <option value="CC001">CC001 - Head Office</option>
                <option value="CC002">CC002 - Branch 1</option>
                <option value="CC003">CC003 - Branch 2</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onReset}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveProvisionFilter
