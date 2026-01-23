import React, { useState } from 'react'
import { FiDownload, FiCalendar } from 'react-icons/fi'
import PLReportExcelService from '../Services/PLReportExcelService'

const ReportCard = ({ title, description, onOpen, selectedPeriod, reportType }) => {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  const handleOpen = () => {
    try {
      if (onOpen) {
        onOpen()
      }
    } catch (err) {
      console.error('ReportCard: handleOpen error', err)
    }
  }

  const handleDownload = async () => {
    if (!selectedPeriod) {
      setDownloadError('Please select a period first')
      return
    }

    try {
      setDownloading(true)
      setDownloadError(null)

      await PLReportExcelService.generateAndDownloadPLReport(selectedPeriod)
    } catch (err) {
      console.error('ReportCard: handleDownload error', err)
      setDownloadError(err.message || 'Failed to download report. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  const getPeriodDisplayText = () => {
    if (!selectedPeriod) return null

    let periodText = ''
    if (selectedPeriod.periodType === 'monthly') {
      periodText = `${selectedPeriod.monthName} ${selectedPeriod.year}`
    } else if (selectedPeriod.periodType === 'quarterly') {
      periodText = `${selectedPeriod.quarterLabel} ${selectedPeriod.year}`
    } else {
      periodText = `FY ${selectedPeriod.year} - ${selectedPeriod.year + 1}`
    }

    // Add client and state info if not "All"
    const filters = []
    if (selectedPeriod.clientName && selectedPeriod.clientName !== 'All') {
      filters.push(`Client: ${selectedPeriod.clientName}`)
    }
    if (selectedPeriod.stateName && selectedPeriod.stateName !== 'All') {
      filters.push(`State: ${selectedPeriod.stateName}`)
    }

    if (filters.length > 0) {
      return `${periodText} (${filters.join(', ')})`
    }

    return periodText
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={handleOpen}
              className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              {selectedPeriod ? 'Change Period' : 'Select Period'}
            </button>
          </div>
        </div>

        {/* Selected Period Display */}
        {selectedPeriod && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FiCalendar className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Selected Period:</span>
              <span className="text-sm text-gray-900 font-semibold">{getPeriodDisplayText()}</span>
            </div>

            {downloadError && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-md">
                <p className="text-xs text-red-600">{downloadError}</p>
              </div>
            )}

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Generating Excel...</span>
                </>
              ) : (
                <>
                  <FiDownload className="w-4 h-4" />
                  <span>Download Excel Report</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReportCard
