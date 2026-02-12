import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import MISReportCard from '../Components/MISReportCard'
import MISMonthSelectionModal from '../Components/MISMonthSelectionModal'
import DateRangeSelectionModal from '../Components/DateRangeSelectionModal'
import { generateCompleteMISExcel } from '../Services/MISSummaryActualExcelService'
import { generateBOCostReportExcel } from '../Services/BOCostReportExcelService'
import { generateTBReportExcel } from '../Services/TBReportExcelService'
import { generateTBDetailedReportExcel } from '../Services/TBDetailedReportExcelService'
import { generateTBDetailedDateRangeReportExcel } from '../Services/TBDetailedDateRangeReportExcelService'

/**
 * MIS Reports Page
 * Displays all MIS report cards with month selection functionality
 */
const MISReportPage = () => {
  const navigate = useNavigate()
  const [monthModalOpen, setMonthModalOpen] = useState(false)
  const [dateRangeModalOpen, setDateRangeModalOpen] = useState(false)
  const [currentReportKey, setCurrentReportKey] = useState(null)
  const [selectedPeriods, setSelectedPeriods] = useState({})
  const [loading, setLoading] = useState(false)
  const [tbReportExpanded, setTbReportExpanded] = useState(false)

  // MIS Report Definitions
  const misReports = [
    {
      key: 'mis_summary_actual',
      title: 'MIS Summary Actual',
      description: 'Comprehensive summary of actual MIS data with key performance indicators',
    },
    {
      key: 'comparison',
      title: 'Comparison',
      description: 'Month-over-month and year-over-year comparison analysis',
    },
    {
      key: 'bo_cost',
      title: 'BO Cost',
      description: 'Back Office cost analysis and breakdown',
    },
    {
      key: 'tb_24_25',
      title: 'TB 24-25',
      description: 'Trial Balance report for FY 2024-25',
    },
    {
      key: 'rev_sum',
      title: 'Rev Sum',
      description: 'Revenue summary with detailed breakdown by category',
    },
    {
      key: 'pph',
      title: 'PPH',
      description: 'Per Person Hour analysis and metrics',
    },
    {
      key: 'bo_cost_details',
      title: 'BO Cost Details',
      description: 'Detailed breakdown of Back Office costs with granular analysis',
    },
  ]

  const handleSelectMonth = (reportKey) => {
    try {
      setCurrentReportKey(reportKey)
      setMonthModalOpen(true)
    } catch (err) {
      console.error('MISReportPage: handleSelectMonth error', err)
    }
  }

  const handleMonthSelect = (monthData) => {
    try {
      if (!currentReportKey) return

      console.log('Selected month data for', currentReportKey, ':', monthData)

      setSelectedPeriods((prev) => ({
        ...prev,
        [currentReportKey]: monthData,
      }))

      setMonthModalOpen(false)
      setCurrentReportKey(null)
    } catch (err) {
      console.error('MISReportPage: handleMonthSelect error', err)
    }
  }

  const handleViewReport = async (reportKey, periodData) => {
    try {
      setLoading(true)

      // Navigate to report viewer with state
      navigate(`/reports/mis/${reportKey}`, {
        state: { reportKey, periodData },
      })
    } catch (err) {
      console.error('MISReportPage: handleViewReport error', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadReport = async (reportKey, periodData) => {
    try {
      console.log('Downloading MIS report:', reportKey, periodData)

      // Route to appropriate Excel generation service based on report key
      if (reportKey === 'mis_summary_actual') {
        await generateCompleteMISExcel(periodData)
      } else if (reportKey === 'bo_cost') {
        await generateBOCostReportExcel(periodData)
      } else {
        // Other reports not yet implemented
        await new Promise((resolve) => setTimeout(resolve, 1500))
        throw new Error(`Download functionality for ${reportKey} will be implemented in next phase`)
      }
    } catch (err) {
      console.error('MISReportPage: handleDownloadReport error', err)
      throw err
    }
  }

  const handleTBReportGenerate = async (reportType) => {
    try {
      console.log('Generating TB Report:', reportType)

      if (reportType === 'TB Report') {
        // Generate basic TB Report - No loading state needed (instant client-side generation)
        await generateTBReportExcel()
      } else if (reportType === 'TB Detailed') {
        // Generate TB Detailed Report - Instant client-side generation
        await generateTBDetailedReportExcel()
      } else if (reportType === 'TB Detailed in Date Range') {
        // Open date range selection modal
        setDateRangeModalOpen(true)
      }
    } catch (err) {
      console.error('MISReportPage: handleTBReportGenerate error', err)
      alert(`Error: ${err.message}`)
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    try {
      setMonthModalOpen(false)
      setCurrentReportKey(null)
    } catch (err) {
      console.error('MISReportPage: handleCloseModal error', err)
    }
  }

  const handleDateRangeDownload = async (dateRange) => {
    try {
      console.log('Downloading TB Detailed Date Range Report:', dateRange)
      setLoading(true)

      // Generate TB Detailed Date Range Report
      await generateTBDetailedDateRangeReportExcel(dateRange)

      console.log('TB Detailed Date Range Report generated successfully')
      setLoading(false)

      return { success: true }
    } catch (err) {
      console.error('MISReportPage: handleDateRangeDownload error', err)
      setLoading(false)
      alert(`Error generating report: ${err.message}`)
      throw err
    }
  }

  const handleCloseDateRangeModal = () => {
    try {
      setDateRangeModalOpen(false)
    } catch (err) {
      console.error('MISReportPage: handleCloseDateRangeModal error', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-green-600 to-green-700 rounded-full"></div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">MIS Reports</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 ml-7">
            Management Information System reports for comprehensive business analysis
          </p>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
              <p className="text-gray-700 font-medium">Loading report...</p>
            </div>
          </div>
        )}

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {misReports.map((report) => (
            <MISReportCard
              key={report.key}
              title={report.title}
              description={report.description}
              reportKey={report.key}
              selectedPeriod={selectedPeriods[report.key]}
              onSelectMonth={handleSelectMonth}
              onViewReport={handleViewReport}
              onDownloadReport={handleDownloadReport}
              isTBReport={report.key === 'tb_24_25'}
              tbReportExpanded={tbReportExpanded}
              onTBGenerateReport={() => setTbReportExpanded(!tbReportExpanded)}
              onTBReportTypeClick={handleTBReportGenerate}
            />
          ))}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">How to use MIS Reports</h4>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Click "Select Month" to choose the reporting period</li>
                <li>• Use "View Report" to see the detailed report on screen</li>
                <li>• Click "Download" to export the report as Excel</li>
                <li>• For TB Report, click "Generate Report" to see report options</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Month Selection Modal */}
      <MISMonthSelectionModal
        isOpen={monthModalOpen}
        onClose={handleCloseModal}
        onSelect={handleMonthSelect}
      />

      {/* Date Range Selection Modal */}
      <DateRangeSelectionModal
        isOpen={dateRangeModalOpen}
        onClose={handleCloseDateRangeModal}
        onDownload={handleDateRangeDownload}
        loading={loading}
      />
    </div>
  )
}

export default MISReportPage
