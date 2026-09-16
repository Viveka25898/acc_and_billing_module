import React, { useState, useEffect } from 'react'

const AMInvoiceFilter = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters)

  // Keep local filters synced if parent filters reset or change externally
  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLocalFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyFilter = (e) => {
    if (e) e.preventDefault()
    setFilters(localFilters)
  }

  const handleClearFilter = () => {
    const clearedFilters = {
      invoiceNumber: '',
      vendorName: '',
      date: '',
    }
    setLocalFilters(clearedFilters)
    setFilters(clearedFilters)
  }

  return (
    <form onSubmit={handleApplyFilter} className="bg-white rounded-2xl border border-green-100 shadow-sm p-4 sm:p-5 mb-6">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
        <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
          <span className="text-green-600">🔍</span> Filter Invoices
        </h3>
        {(localFilters.invoiceNumber || localFilters.vendorName || localFilters.date) && (
          <span className="text-xs font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            Filter Active
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        {/* Invoice Number Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Invoice Number / ID
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={localFilters.invoiceNumber || ''}
            onChange={handleInputChange}
            placeholder="e.g. INV-20260915094402"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
        </div>

        {/* Vendor Name Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Vendor Name
          </label>
          <input
            type="text"
            name="vendorName"
            value={localFilters.vendorName || ''}
            onChange={handleInputChange}
            placeholder="e.g. Reliance Office Supplies"
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wider">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={localFilters.date || ''}
            onChange={handleInputChange}
            className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-700"
          />
        </div>
      </div>

      {/* Filter Action Buttons */}
      <div className="flex justify-end gap-3 flex-wrap pt-2 border-t border-gray-50">
        <button
          type="button"
          onClick={handleClearFilter}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-200"
        >
          Clear Filter
        </button>
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-xl text-sm shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5"
        >
          <span>Apply Filter</span>
        </button>
      </div>
    </form>
  )
}

export default AMInvoiceFilter
