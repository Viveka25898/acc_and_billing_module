import React from 'react'

const LeaveEncashmentControls = ({ filters, onFilterChange }) => {
  const handleExport = () => {
    console.log('Exporting data')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-gray-800 p-4 border-b border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-gray-300 mb-1">Period</label>
            <select
              value={filters.period}
              onChange={(e) => onFilterChange('period', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white min-w-[140px]"
            >
              <option>FY 2024-25</option>
              <option>FY 2023-24</option>
              <option>Q1 (Apr-Jun)</option>
              <option>Q2 (Jul-Sep)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">Transaction Type</label>
            <select
              value={filters.transactionType}
              onChange={(e) => onFilterChange('transactionType', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white min-w-[140px]"
            >
              <option>All Transactions</option>
              <option>Provisions Only</option>
              <option>Payments Only</option>
              <option>Adjustments Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">From Date</label>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onFilterChange('fromDate', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-300 mb-1">To Date</label>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => onFilterChange('toDate', e.target.value)}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-sm text-white"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
            Generate Report
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  )
}

export default LeaveEncashmentControls
