import React from 'react'

const AEInvoiceFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    setFilters({ ...filters, [name]: value })
  }

  return (
    <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4">
        {/* Invoice Number */}
        <div className="w-full sm:w-1/3">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Invoice Number
          </label>
          <input
            type="text"
            name="invoiceNumber"
            value={filters.invoiceNumber}
            onChange={handleChange}
            placeholder="Search by invoice number"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Vendor Name */}
        <div className="w-full sm:w-1/3">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Vendor Name
          </label>
          <input
            type="text"
            name="vendorName"
            value={filters.vendorName}
            onChange={handleChange}
            placeholder="Search by vendor name"
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>

        {/* Submission Date */}
        <div className="w-full sm:w-1/3">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Submission Date
          </label>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
          />
        </div>
      </div>
    </div>
  )
}

export default AEInvoiceFilter
