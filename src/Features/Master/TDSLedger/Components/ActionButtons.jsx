import React, { useState } from 'react'
import { FaDownload, FaSearch } from 'react-icons/fa'
import { FiFilter, FiPrinter, FiRefreshCw } from 'react-icons/fi'
import TDSRealDataService from '../../utils/TDSLedgerService'

const ActionButtons = ({ onRefresh, dataCount = 0, onFilterClick }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = () => {
    setIsExporting(true)
    try {
      const csvContent = TDSRealDataService.exportToCSV()
      if (csvContent) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute('download', `TDS_Ledger_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Show success message
        alert('TDS Ledger exported successfully!')
      } else {
        alert('No data to export')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export TDS Ledger')
    } finally {
      setIsExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
    // You can implement search filtering here
    // or pass the search term to parent component
  }

  return (
    <div className="px-6 py-4 bg-white border-b border-gray-200 md:px-8">
      <div className="flex flex-wrap gap-3">
        {/* Transaction Count */}
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
          <span className="font-bold">{dataCount}</span>
          <span className="hidden sm:inline">Transactions</span>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting || dataCount === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            isExporting || dataCount === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="hidden sm:inline">Exporting...</span>
            </>
          ) : (
            <>
              <FaDownload size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </>
          )}
        </button>

        {/* Print Button */}
        <button
          onClick={handlePrint}
          disabled={dataCount === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
            dataCount === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <FiPrinter size={16} />
          <span className="hidden sm:inline">Print</span>
        </button>

        {/* Refresh Button */}
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <FiRefreshCw size={16} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Filter Button */}
        <button
          onClick={onFilterClick}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
        >
          <FiFilter size={16} />
          <span className="hidden sm:inline">Filter</span>
        </button>

        {/* Search Input */}
        <div className="flex-1 min-w-[200px] relative">
          <FaSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by vendor, invoice, voucher..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Bar */}
      {dataCount > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="text-xs text-gray-600">
            Showing <span className="font-semibold">{dataCount}</span> TDS entries
          </div>
          <div className="text-xs text-gray-400">|</div>
          <div className="text-xs text-gray-600">
            Last updated: <span className="font-semibold">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ActionButtons
