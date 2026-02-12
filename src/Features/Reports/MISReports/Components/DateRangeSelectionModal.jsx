import React, { useState } from 'react'
import { FiX, FiCalendar, FiDownload } from 'react-icons/fi'

/**
 * Date Range Selection Modal
 * Allows selection of From Date and To Date for TB Detailed Date Range Report
 */
const DateRangeSelectionModal = ({ isOpen, onClose, onDownload, loading }) => {
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      setError(null)

      // Validation
      if (!fromDate || !toDate) {
        setError('Both From Date and To Date are required')
        return
      }

      // Validate that From Date is before To Date
      const from = new Date(fromDate)
      const to = new Date(toDate)

      if (from > to) {
        setError('From Date must be before or equal to To Date')
        return
      }

      // Call the download handler with date range
      if (onDownload) {
        onDownload({ fromDate, toDate })
      }
    } catch (err) {
      console.error('DateRangeSelectionModal: handleSubmit error', err)
      setError('Failed to process date range')
    }
  }

  const handleClose = () => {
    try {
      setError(null)
      setFromDate('')
      setToDate('')
      if (onClose) {
        onClose()
      }
    } catch (err) {
      console.error('DateRangeSelectionModal: handleClose error', err)
    }
  }

  // Check if download button should be enabled
  const isDownloadEnabled = fromDate && toDate && !loading

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <FiCalendar className="w-6 h-6" />
            <h2 className="text-xl font-bold">Select Date Range</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* From Date */}
          <div className="mb-4">
            <label htmlFor="fromDate" className="block text-sm font-semibold text-gray-700 mb-2">
              From Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="fromDate"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* To Date */}
          <div className="mb-6">
            <label htmlFor="toDate" className="block text-sm font-semibold text-gray-700 mb-2">
              To Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                id="toDate"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value)
                  setError(null)
                }}
                disabled={loading}
                min={fromDate || undefined}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>
          </div>

          {/* Download Button */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDownloadEnabled}
              className={`
                                px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2
                                ${
                                  isDownloadEnabled
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-lg'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }
                            `}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Downloading...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-5 h-5" />
                  <span>Download Report</span>
                </>
              )}
            </button>
          </div>

          {/* Info Text */}
          {!fromDate || !toDate ? (
            <p className="text-xs text-gray-500 mt-4 text-center">
              Please select both From Date and To Date to enable download
            </p>
          ) : null}
        </form>
      </div>
    </div>
  )
}

export default DateRangeSelectionModal
