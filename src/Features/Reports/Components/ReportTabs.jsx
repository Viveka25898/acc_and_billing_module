import { useState } from 'react'
import ReportCard from './ReportCard'
import MonthSelectionModal from './MonthSelectionModal'
import QuarterSelectionModal from './QuarterSelectionModal'
import YearSelectionModal from './YearSelectionModal'
import MISReportPage from '../MISReports/Pages/MISReportPage'

const ReportTabs = ({ initial = 'pnl', onView }) => {
  const [active, setActive] = useState(initial)
  const [monthModalOpen, setMonthModalOpen] = useState(false)
  const [quarterModalOpen, setQuarterModalOpen] = useState(false)
  const [yearModalOpen, setYearModalOpen] = useState(false)

  // Track selected periods for each report type
  const [selectedPeriods, setSelectedPeriods] = useState({
    monthly: null,
    quarterly: null,
    yearly: null,
  })

  const openReport = (key) => {
    try {
      // Handle P&L report types
      if (key === 'monthly-pnl') {
        setMonthModalOpen(true)
      } else if (key === 'quarterly-pnl') {
        setQuarterModalOpen(true)
      } else if (key === 'yearly-pnl') {
        setYearModalOpen(true)
      } else {
        // Placeholder for other report types
        console.log('Opening report:', key)
      }
    } catch (err) {
      console.error('openReport error', err)
    }
  }

  const handleMonthSelect = (monthData) => {
    try {
      console.log('Selected month data:', monthData)
      setSelectedPeriods((prev) => ({
        ...prev,
        monthly: monthData,
      }))
    } catch (err) {
      console.error('handleMonthSelect error', err)
    }
  }

  const handleQuarterSelect = (quarterData) => {
    try {
      console.log('Selected quarter data:', quarterData)
      setSelectedPeriods((prev) => ({
        ...prev,
        quarterly: quarterData,
      }))
    } catch (err) {
      console.error('handleQuarterSelect error', err)
    }
  }

  const handleYearSelect = (yearData) => {
    try {
      console.log('Selected year data:', yearData)
      setSelectedPeriods((prev) => ({
        ...prev,
        yearly: yearData,
      }))
    } catch (err) {
      console.error('handleYearSelect error', err)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setActive('pnl')}
          className={`px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${active === 'pnl'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
          Profit & Loss
        </button>
        <button
          onClick={() => setActive('mis')}
          className={`px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${active === 'mis'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
          MIS Reports
        </button>
        <button
          onClick={() => setActive('bs')}
          className={`px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${active === 'bs'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActive('cash')}
          className={`px-4 py-2 rounded-md text-sm sm:text-base transition-colors ${active === 'cash'
            ? 'bg-green-600 text-white shadow-md'
            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
        >
          Cashflow
        </button>
      </div>

      <div>
        {active === 'pnl' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard
              title="Monthly P&L"
              description="Summary of monthly profit & loss"
              onOpen={() => openReport('monthly-pnl')}
              selectedPeriod={selectedPeriods.monthly}
              reportType="monthly"
              onView={onView}
            />
            <ReportCard
              title="Quarterly P&L"
              description="Quarterly profit & loss"
              onOpen={() => openReport('quarterly-pnl')}
              selectedPeriod={selectedPeriods.quarterly}
              reportType="quarterly"
              onView={onView}
            />
            <ReportCard
              title="Yearly P&L"
              description="Yearly consolidated P&L"
              onOpen={() => openReport('yearly-pnl')}
              selectedPeriod={selectedPeriods.yearly}
              reportType="yearly"
              onView={onView}
            />
          </div>
        )}

        {active === 'mis' && (
          <MISReportPage />
        )}

        {active === 'bs' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard
              title="Current Assets"
              description="Assets snapshot"
              onOpen={() => openReport('assets')}
            />
            <ReportCard
              title="Liabilities"
              description="Liabilities snapshot"
              onOpen={() => openReport('liabilities')}
            />
            <ReportCard
              title="Equity"
              description="Equity summary"
              onOpen={() => openReport('equity')}
            />
          </div>
        )}

        {active === 'cash' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard
              title="Cashflow Statement"
              description="Operating, investing and financing"
              onOpen={() => openReport('cashflow')}
            />
            <ReportCard
              title="Bank Reconciliation"
              description="Bank statement vs ledger"
              onOpen={() => openReport('bank-reco')}
            />
            <ReportCard
              title="Receivables Aging"
              description="Customer aging report"
              onOpen={() => openReport('aging')}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <MonthSelectionModal
        isOpen={monthModalOpen}
        onClose={() => setMonthModalOpen(false)}
        onSelect={handleMonthSelect}
      />
      <QuarterSelectionModal
        isOpen={quarterModalOpen}
        onClose={() => setQuarterModalOpen(false)}
        onSelect={handleQuarterSelect}
      />
      <YearSelectionModal
        isOpen={yearModalOpen}
        onClose={() => setYearModalOpen(false)}
        onSelect={handleYearSelect}
      />
    </div>
  )
}

export default ReportTabs
