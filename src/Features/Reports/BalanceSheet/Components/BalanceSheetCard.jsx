import React, { useState } from 'react'
import { FiDownload, FiFileText, FiAlertCircle } from 'react-icons/fi'
import { generateBSReportExcel } from '../Services/BSReportExcelService'

/**
 * BalanceSheetCard
 * Standalone card for the Balance Sheet report download.
 * Single responsibility: trigger Excel generation with loader + error handling.
 * API INTEGRATION: When backend is ready, replace generateBSReportExcel body — UI stays unchanged.
 */
const BalanceSheetCard = () => {
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleDownload = async () => {
    try {
      setDownloading(true)
      setError(null)
      setSuccess(false)
      await generateBSReportExcel()
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('BalanceSheetCard: download error', err)
      setError(err.message || 'Failed to generate Balance Sheet. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Card header accent */}
      <div className="h-1 w-full bg-gradient-to-r from-green-600 to-blue-600" />

      <div className="p-5">
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg border border-green-200">
            <FiFileText className="w-7 h-7 text-green-700" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800">Balance Sheet</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              I Smart Facitech Private Limited — As on 31st March 2024
            </p>
          </div>
        </div>

        {/* Content breakdown */}
        <div className="mb-5 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { label: 'BS', desc: 'Main Balance Sheet' },
            { label: 'BS Schedule', desc: 'Notes 2–14' },
            { label: 'PL', desc: 'Profit & Loss Statement' },
            { label: 'PL Schedule', desc: 'Notes 15–20' },
            { label: 'FA Note 9', desc: 'Fixed Assets & Depreciation' },
          ].map((sheet) => (
            <div
              key={sheet.label}
              className="flex items-center gap-2 bg-gray-50 rounded-md px-3 py-2 border border-gray-100"
            >
              <span className="text-xs font-bold text-green-700 bg-green-100 rounded px-1.5 py-0.5 min-w-[68px] text-center">
                {sheet.label}
              </span>
              <span className="text-xs text-gray-600 truncate">{sheet.desc}</span>
            </div>
          ))}
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <FiAlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Success message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs text-green-700 font-medium">
              ✓ Balance Sheet downloaded successfully!
            </p>
          </div>
        )}

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-semibold rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              <span>Generating Excel... Please wait</span>
            </>
          ) : (
            <>
              <FiDownload className="w-4 h-4" />
              <span>Download Balance Sheet (Excel)</span>
            </>
          )}
        </button>

        <p className="mt-2.5 text-center text-xs text-gray-400">
          5-sheet workbook · FY 2023-24 · Dummy data (API-ready)
        </p>
      </div>
    </div>
  )
}

export default BalanceSheetCard
