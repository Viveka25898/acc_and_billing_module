import { useState } from 'react'
import ReportCard from './ReportCard'

const ReportTabs = ({ initial = 'pnl' }) => {
  const [active, setActive] = useState(initial)

  const openReport = (key) => {
    try {
      // Placeholder - in production open modal or navigate to detailed report
      alert(`Open report: ${key}`)
    } catch (err) {
      console.error('openReport error', err)
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActive('pnl')}
          className={`px-4 py-2 rounded-md ${active === 'pnl' ? 'bg-green-600 text-white' : 'bg-white border'}`}
        >
          Profit & Loss
        </button>
        <button
          onClick={() => setActive('bs')}
          className={`px-4 py-2 rounded-md ${active === 'bs' ? 'bg-green-600 text-white' : 'bg-white border'}`}
        >
          Balance Sheet
        </button>
        <button
          onClick={() => setActive('cash')}
          className={`px-4 py-2 rounded-md ${active === 'cash' ? 'bg-green-600 text-white' : 'bg-white border'}`}
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
            />
            <ReportCard
              title="Quarterly P&L"
              description="Quarterly profit & loss"
              onOpen={() => openReport('quarterly-pnl')}
            />
            <ReportCard
              title="Yearly P&L"
              description="Yearly consolidated P&L"
              onOpen={() => openReport('yearly-pnl')}
            />
          </div>
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
    </div>
  )
}

export default ReportTabs
