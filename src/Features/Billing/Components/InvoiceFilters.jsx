import React, { useState } from 'react'
import { Search, Filter, X, Calendar } from 'lucide-react'

const InvoiceFilters = ({ onFilterChange, stats }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    searchTerm: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleReset = () => {
    const resetFilters = {
      searchTerm: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 w-full overflow-hidden">
      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-2 sm:p-3 border border-blue-200">
          <p className="text-xs text-blue-600 font-medium mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-700">{stats?.total || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-2 sm:p-3 border border-gray-200">
          <p className="text-xs text-gray-600 font-medium mb-1">Draft</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-700">{stats?.draft || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-2 sm:p-3 border border-purple-200">
          <p className="text-xs text-purple-600 font-medium mb-1">Sent</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-700">{stats?.sent || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-2 sm:p-3 border border-amber-200">
          <p className="text-xs text-amber-600 font-medium mb-1">Received</p>
          <p className="text-xl sm:text-2xl font-bold text-amber-700">{stats?.received || 0}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-2 sm:p-3 border border-green-200">
          <p className="text-xs text-green-600 font-medium mb-1">Converted</p>
          <p className="text-xl sm:text-2xl font-bold text-green-700">{stats?.converted || 0}</p>
        </div>
      </div>

      {/* Search and Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices..."
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`px-4 py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-all flex-shrink-0 ${
            isOpen ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Filter className="w-4 h-4" />
          <span className="whitespace-nowrap">Filters</span>
          {isOpen && <X className="w-3 h-3" />}
        </button>
      </div>

      {/* Advanced Filters */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="received">Received</option>
              <option value="converted">Converted</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="sm:col-span-3 flex justify-end">
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" />
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default InvoiceFilters
