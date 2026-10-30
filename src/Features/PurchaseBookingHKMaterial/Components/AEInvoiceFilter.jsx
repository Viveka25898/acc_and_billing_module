import React from 'react'
import { Search, Building2, Calendar, X, Filter } from 'lucide-react'

const AEInvoiceFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  const handleClear = () => {
    setFilters({
      invoiceNumber: '',
      vendorName: '',
      date: '',
    })
  }

  const hasActiveFilters = Boolean(filters.invoiceNumber || filters.vendorName || filters.date)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-5 mb-6 transition-all duration-200">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-green-600" />
          <span className="text-gray-800 font-semibold text-sm">
            Filter Invoices
          </span>
          {hasActiveFilters && (
            <span className="bg-green-100 text-green-700 text-xs px-2.5 py-0.5 rounded-full font-medium">
              Active Filters
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={handleClear}
            type="button"
            className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1.5 transition-colors font-medium cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Invoice Number */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Invoice Number
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="invoiceNumber"
              value={filters.invoiceNumber || ''}
              onChange={handleChange}
              placeholder="Search by invoice #..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Vendor Name */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Vendor Name
          </label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              name="vendorName"
              value={filters.vendorName || ''}
              onChange={handleChange}
              placeholder="Search by vendor..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Submission Date */}
        <div>
          <label className="block mb-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Submission Date
          </label>
          <div className="relative">
            <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="date"
              name="date"
              value={filters.date || ''}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-600 focus:bg-white transition-all text-gray-800 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AEInvoiceFilter
