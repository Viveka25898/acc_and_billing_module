/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { periods, states, statuses } from '../data/lwfLedgerData'

const ControlsPanel = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    period: 'fy-2024-25',
    state: 'all',
    status: 'all',
  })

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    if (onFilterChange) {
      onFilterChange(newFilters)
    }
  }

  const handleExport = () => {
    // Implement export functionality
    console.log('Exporting with filters:', filters)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-gray-800 p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6 border-t-3 border-blue-600">
      <div className="flex flex-wrap gap-4 md:gap-6 items-center">
        <div className="flex items-center gap-3">
          <label className="text-gray-200 font-semibold text-sm whitespace-nowrap">Period:</label>
          <select
            value={filters.period}
            onChange={(e) => handleFilterChange('period', e.target.value)}
            className="px-4 py-2 border-2 border-gray-600 rounded-lg text-sm bg-gray-900 text-gray-200 min-w-[160px] focus:border-blue-600 focus:outline-none transition-colors cursor-pointer"
          >
            {periods.map((period) => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-gray-200 font-semibold text-sm whitespace-nowrap">State:</label>
          <select
            value={filters.state}
            onChange={(e) => handleFilterChange('state', e.target.value)}
            className="px-4 py-2 border-2 border-gray-600 rounded-lg text-sm bg-gray-900 text-gray-200 min-w-[160px] focus:border-blue-600 focus:outline-none transition-colors cursor-pointer"
          >
            {states.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-gray-200 font-semibold text-sm whitespace-nowrap">Status:</label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-4 py-2 border-2 border-gray-600 rounded-lg text-sm bg-gray-900 text-gray-200 min-w-[160px] focus:border-blue-600 focus:outline-none transition-colors cursor-pointer"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* <div className="flex gap-3">
        <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-sm hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2">
          📊 Generate Report
        </button>
        <button
          onClick={handleExport}
          className="px-5 py-2.5 bg-gray-700 text-white rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          📥 Export
        </button>
        <button
          onClick={handlePrint}
          className="px-5 py-2.5 bg-gray-700 text-white rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors flex items-center gap-2"
        >
          🖨️ Print
        </button>
      </div> */}
    </div>
  )
}

export default ControlsPanel
