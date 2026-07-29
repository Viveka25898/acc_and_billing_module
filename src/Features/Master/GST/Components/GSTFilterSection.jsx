/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { FaFilter, FaTimes, FaPrint } from 'react-icons/fa'

const GSTFilterSection = ({ filters, onFilterChange, onPrint }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  // Sync local buffer when parent filter defaults change
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFieldChange = (field, value) => {
    setLocalFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleApply = () => {
    onFilterChange(localFilters)
  }

  const handleClear = () => {
    const cleared = { fromDate: '', toDate: '', status: 'All', search: '' }
    setLocalFilters(cleared)
    onFilterChange(cleared)
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-green-100 shadow-sm mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end mb-4">
        {/* From Date */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            From Date
          </label>
          <input
            type="date"
            value={localFilters.fromDate}
            onChange={(e) => handleFieldChange('fromDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            To Date
          </label>
          <input
            type="date"
            value={localFilters.toDate}
            onChange={(e) => handleFieldChange('toDate', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Status
          </label>
          <select
            value={localFilters.status}
            onChange={(e) => handleFieldChange('status', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50 cursor-pointer"
          >
            <option value="All">All Transactions</option>
            <option value="Posted">Posted</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
            Search Keyword
          </label>
          <input
            type="text"
            placeholder="Search voucher, counterparty..."
            value={localFilters.search}
            onChange={(e) => handleFieldChange('search', e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition bg-gray-50"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <button
            onClick={handleApply}
            className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs px-4 py-2 rounded-lg shadow-sm hover:shadow transition duration-150"
          >
            <FaFilter className="w-3 h-3" /> Apply Filters
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-250 text-gray-700 font-semibold text-xs px-4 py-2 rounded-lg border border-gray-250 transition duration-150"
          >
            <FaTimes className="w-3 h-3" /> Clear Filters
          </button>
        </div>

        <button
          onClick={onPrint}
          className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs px-4 py-2 rounded-lg border border-gray-250 shadow-sm transition duration-150"
        >
          <FaPrint className="w-3.5 h-3.5 text-gray-500" /> Print Ledger
        </button>
      </div>
    </div>
  )
}

export default GSTFilterSection

