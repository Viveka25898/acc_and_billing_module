/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { FiFilter, FiCalendar, FiDownload, FiPrinter, FiRefreshCw, FiEye } from 'react-icons/fi'

const ControlsPanelLeaveProvision = ({ filters, onFilterChange, onExport, onPrint }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const periodOptions = [
    { value: 'fy-2024-25', label: 'FY 2024-25' },
    { value: 'fy-2023-24', label: 'FY 2023-24' },
    { value: 'q1-2024', label: 'Q1 (Apr-Jun)' },
    { value: 'q2-2024', label: 'Q2 (Jul-Sep)' },
    { value: 'q3-2024', label: 'Q3 (Oct-Dec)' },
    { value: 'q4-2024', label: 'Q4 (Jan-Mar)' },
    { value: 'custom', label: 'Custom Period' },
  ]

  const departmentOptions = [
    { value: 'all', label: 'All Departments' },
    { value: 'branch-management', label: 'Branch Management' },
    { value: 'operations', label: 'Operations' },
    { value: 'support-staff', label: 'Support Staff' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'sales', label: 'Sales & Marketing' },
  ]

  const viewOptions = [
    { value: 'monthly', label: 'Monthly View' },
    { value: 'quarterly', label: 'Quarterly Summary' },
    { value: 'yearly', label: 'Yearly Summary' },
    { value: 'detailed', label: 'Detailed View' },
  ]

  const handleExport = (format) => {
    if (onExport) {
      onExport(format)
    }
  }

  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 md:p-6 border-y border-gray-700">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Main Filter Controls */}
        <div className="flex-1">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-gray-300" />
              <span className="text-sm font-medium text-gray-300">Filters</span>
            </div>

            <div className="flex flex-wrap gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Period</label>
                <select
                  value={filters.period}
                  onChange={(e) => onFilterChange('period', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[140px]"
                >
                  {periodOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Department</label>
                <select
                  value={filters.department}
                  onChange={(e) => onFilterChange('department', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none min-w-[140px]"
                >
                  {departmentOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">From Date</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={(e) => onFilterChange('fromDate', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">To Date</label>
                <input
                  type="date"
                  value={filters.toDate}
                  onChange={(e) => onFilterChange('toDate', e.target.value)}
                  className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {/* {showAdvanced && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Ledger View</label>
                  <select
                    value={filters.ledgerView}
                    onChange={(e) => onFilterChange('ledgerView', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white focus:border-blue-500"
                  >
                    {viewOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Employee Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white"
                    />
                    <span className="text-gray-400 self-center">to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-sm text-white"
                    />
                  </div>
                </div>

                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={filters.showActuarialDetails}
                      onChange={(e) => onFilterChange('showActuarialDetails', e.target.checked)}
                      className="rounded border-gray-600 text-blue-600 focus:ring-blue-500"
                    />
                    Show Actuarial Details
                  </label>
                </div>
              </div>
            </div>
          )} */}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <FiFilter className="w-4 h-4" />
              Filters
            </button>

            <button
              onClick={() => {
                onFilterChange('period', 'fy-2024-25')
                onFilterChange('department', 'all')
                onFilterChange('fromDate', '2024-04-01')
                onFilterChange('toDate', '2024-09-30')
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors text-sm"
            >
              <FiRefreshCw className="w-4 h-4" />
              Reset
            </button>
          </div>

          {/* <div className="flex gap-2">
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center gap-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              <FiDownload className="w-4 h-4" />
              Export
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <FiPrinter className="w-4 h-4" />
              Print
            </button>

            <button className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm">
              <FiEye className="w-4 h-4" />
              Generate Report
            </button>
          </div> */}
        </div>
      </div>

      {/* Quick Stats Bar */}
      {/* <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-xs text-gray-400">Active Filters:</span>
          <span className="text-xs text-gray-300">
            {filters.period === 'custom'
              ? `${filters.fromDate} to ${filters.toDate}`
              : periodOptions.find((p) => p.value === filters.period)?.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-400">Department:</span>
          <span className="text-xs text-gray-300">
            {departmentOptions.find((d) => d.value === filters.department)?.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span className="text-xs text-gray-400">View:</span>
          <span className="text-xs text-gray-300">
            {viewOptions.find((v) => v.value === filters.ledgerView)?.label}
          </span>
        </div>
      </div> */}
    </div>
  )
}

export default ControlsPanelLeaveProvision
