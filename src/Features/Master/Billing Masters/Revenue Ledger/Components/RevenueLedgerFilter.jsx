// Revenue Ledger Filter Component
import React, { useState } from 'react'
import { Search, Filter, Calendar, Download, RefreshCw } from 'lucide-react'

const RevenueLedgerFilter = ({ onFilterChange }) => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [entryType, setEntryType] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        fromDate,
        toDate,
        entryType,
        searchTerm,
      })
    }
  }

  const handleReset = () => {
    setFromDate('')
    setToDate('')
    setEntryType('All')
    setSearchTerm('')
    if (onFilterChange) {
      onFilterChange({
        fromDate: '',
        toDate: '',
        entryType: 'All',
        searchTerm: '',
      })
    }
  }

  const handleExport = () => {
    alert('Export functionality will be implemented')
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Transaction Filters</h3>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* From Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* To Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Calendar className="w-4 h-4 inline mr-1" />
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Entry Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
          <select
            value={entryType}
            onChange={(e) => setEntryType(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="All">All</option>
            <option value="Sales Invoice">Sales Invoice</option>
            <option value="Credit Note">Credit Note</option>
            <option value="Debit Note">Debit Note</option>
            <option value="Journal Entry">Journal Entry</option>
          </select>
        </div>

        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Search className="w-4 h-4 inline mr-1" />
            Search
          </label>
          <input
            type="text"
            placeholder="Voucher, Narration..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={handleFilterChange}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Apply
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            title="Reset Filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Total Credit</div>
          <div className="text-lg font-semibold text-green-600">₹15,25,400</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Total Debit</div>
          <div className="text-lg font-semibold text-red-600">₹2,18,500</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Net Revenue</div>
          <div className="text-lg font-semibold text-blue-600">₹13,06,900</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Transactions</div>
          <div className="text-lg font-semibold text-gray-600">6</div>
        </div>
      </div>
    </div>
  )
}

export default RevenueLedgerFilter
