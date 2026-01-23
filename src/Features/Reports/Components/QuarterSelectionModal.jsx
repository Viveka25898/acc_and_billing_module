import React, { useState, useEffect } from 'react'
import { FiX, FiCalendar } from 'react-icons/fi'

const QuarterSelectionModal = ({ isOpen, onClose, onSelect }) => {
  const [selectedQuarter, setSelectedQuarter] = useState('')
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Generate years (current year and 5 years back)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i)

  const quarters = [
    { value: 'Q1', label: 'Q1 (April - June)', months: ['04', '05', '06'] },
    { value: 'Q2', label: 'Q2 (July - September)', months: ['07', '08', '09'] },
    { value: 'Q3', label: 'Q3 (October - December)', months: ['10', '11', '12'] },
    { value: 'Q4', label: 'Q4 (January - March)', months: ['01', '02', '03'] },
  ]

  // Set default to current quarter
  useEffect(() => {
    if (isOpen) {
      const now = new Date()
      const currentMonth = now.getMonth() + 1
      
      // Determine current quarter (Indian financial year: April to March)
      let currentQuarter = 'Q1'
      if (currentMonth >= 4 && currentMonth <= 6) currentQuarter = 'Q1'
      else if (currentMonth >= 7 && currentMonth <= 9) currentQuarter = 'Q2'
      else if (currentMonth >= 10 && currentMonth <= 12) currentQuarter = 'Q3'
      else currentQuarter = 'Q4'

      setSelectedQuarter(currentQuarter)
      setSelectedYear(now.getFullYear())
      setError(null)
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedQuarter) {
      setError('Please select a quarter')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const quarterInfo = quarters.find(q => q.value === selectedQuarter)
      const quarterData = {
        quarter: selectedQuarter,
        year: selectedYear,
        quarterLabel: quarterInfo?.label || '',
        months: quarterInfo?.months || [],
        periodType: 'quarterly',
      }

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 300))

      if (onSelect) {
        onSelect(quarterData)
      }
      
      onClose()
    } catch (err) {
      console.error('QuarterSelectionModal: handleSubmit error', err)
      setError('Failed to process selection. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError(null)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiCalendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Select Quarter</h2>
              <p className="text-sm text-gray-500">Choose quarter for P&L Report</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close modal"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Year Selection */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Financial Year <span className="text-red-500">*</span>
              </label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year} - {year + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Quarter Selection */}
            <div>
              <label htmlFor="quarter" className="block text-sm font-medium text-gray-700 mb-2">
                Quarter <span className="text-red-500">*</span>
              </label>
              <select
                id="quarter"
                value={selectedQuarter}
                onChange={(e) => setSelectedQuarter(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              >
                <option value="">Select Quarter</option>
                {quarters.map((quarter) => (
                  <option key={quarter.value} value={quarter.value}>
                    {quarter.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Financial year starts from April (Q1) to March (Q4)
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedQuarter}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FiCalendar className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuarterSelectionModal
