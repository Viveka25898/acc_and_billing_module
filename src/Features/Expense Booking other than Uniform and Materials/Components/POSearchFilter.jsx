import React from 'react'

export default function POSearchFilter({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  vendorStatusFilter,
  setVendorStatusFilter,
  poTypeFilter,
  setPoTypeFilter,
}) {
  const clearFilters = () => {
    setSearch('')
    setStatusFilter('all')
    setVendorStatusFilter('all')
    setPoTypeFilter('all')
  }

  const hasActiveFilters =
    search !== '' ||
    statusFilter !== 'all' ||
    vendorStatusFilter !== 'all' ||
    poTypeFilter !== 'all'

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Search Input */}
      <div>
        <input
          type="text"
          placeholder="Search by Vendor Name, PO Number, or Description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded p-3 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {/* Overall Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Overall Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Vendor Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Vendor Status</label>
          <select
            value={vendorStatusFilter}
            onChange={(e) => setVendorStatusFilter(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Vendor Status</option>
            <option value="po-sent">PO Sent</option>
            <option value="invoice-pending">Invoice Pending</option>
            <option value="invoice-uploaded">Invoice Uploaded</option>
            <option value="under-review">Under Review</option>
            <option value="approved">Vendor Approved</option>
            <option value="rejected">Vendor Rejected</option>
          </select>
        </div>

        {/* PO Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">PO Type</label>
          <select
            value={poTypeFilter}
            onChange={(e) => setPoTypeFilter(e.target.value)}
            className="w-full border rounded p-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="all">All Types</option>
            <option value="one-time">One-time</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`w-full px-3 py-2 rounded text-sm font-medium transition-colors ${
              hasActiveFilters
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          <span className="text-xs font-medium text-gray-600">Active filters:</span>
          {search && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
              Search: "{search}"
            </span>
          )}
          {statusFilter !== 'all' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
              Status: {statusFilter}
            </span>
          )}
          {vendorStatusFilter !== 'all' && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
              Vendor: {vendorStatusFilter}
            </span>
          )}
          {poTypeFilter !== 'all' && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-xs">
              Type: {poTypeFilter}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
