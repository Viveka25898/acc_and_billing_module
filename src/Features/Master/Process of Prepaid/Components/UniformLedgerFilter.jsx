/* eslint-disable no-unused-vars */
import React from 'react'

const UniformLedgerFilters = ({ filters, onFilterChange, vendors = [] }) => {
  const handleFilterChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // TODO: Implement Excel export
    console.log('Export to Excel functionality to be implemented')
  }

  return (
    <div className="flex flex-wrap items-end gap-4 bg-gray-50 border-b border-gray-200 p-6">
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">From Date</label>
        <input
          type="date"
          className="border rounded-md px-3 py-1.5 text-sm"
          value={filters.fromDate}
          onChange={(e) => handleFilterChange('fromDate', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">To Date</label>
        <input
          type="date"
          className="border rounded-md px-3 py-1.5 text-sm"
          value={filters.toDate}
          onChange={(e) => handleFilterChange('toDate', e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Vendor</label>
        <select
          className="border rounded-md px-3 py-1.5 text-sm"
          value={filters.vendor}
          onChange={(e) => handleFilterChange('vendor', e.target.value)}
        >
          <option>All</option>
          {vendors.map((vendor, idx) => (
            <option key={idx} value={vendor}>
              {vendor}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Entry Type</label>
        <select
          className="border rounded-md px-3 py-1.5 text-sm"
          value={filters.entryType}
          onChange={(e) => handleFilterChange('entryType', e.target.value)}
        >
          <option>All</option>
          <option>Purchase Only</option>
          <option>Amortization Only</option>
        </select>
      </div>

      <div className="ml-auto flex gap-2">
        <button
          className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-md text-sm hover:bg-indigo-50"
          onClick={handleExport}
        >
          Export to Excel
        </button>
        {/* <button 
          className="border border-indigo-500 text-indigo-500 px-4 py-2 rounded-md text-sm hover:bg-indigo-50"
          onClick={handlePrint}
        >
          Print
        </button> */}
      </div>
    </div>
  )
}

export default UniformLedgerFilters
