import { SummaryCard } from './SummeryCard'

export const Summary = ({ data = [] }) => {
  // Safe calculations with fallbacks
  const safeCalculate = (callback) => {
    try {
      return callback()
    } catch (error) {
      console.error('Calculation error:', error)
      return 0
    }
  }

  const totalGross = safeCalculate(() =>
    data.reduce((sum, entry) => sum + (Number(entry.grossAmount) || 0), 0)
  )

  const totalTDS = safeCalculate(() =>
    data.reduce((sum, entry) => {
      const tdsAmount = Math.max(Number(entry.tdsAmountDr) || 0, Number(entry.tdsAmountCr) || 0)
      return sum + tdsAmount
    }, 0)
  )

  const totalNetPayable = safeCalculate(() =>
    data.reduce((sum, entry) => sum + (Number(entry.netPayable) || 0), 0)
  )

  const tdsPaid = safeCalculate(() =>
    data
      .filter((e) => e.paymentStatus === 'Paid' || e.tdsAmountDr > 0)
      .reduce((sum, entry) => sum + (Number(entry.tdsAmountDr) || 0), 0)
  )

  const tdsDeducted = safeCalculate(() =>
    data
      .filter((e) => e.tdsAmountCr > 0)
      .reduce((sum, entry) => sum + (Number(entry.tdsAmountCr) || 0), 0)
  )

  const tdsOutstanding = Math.max(0, tdsDeducted - tdsPaid)

  // Section breakdown
  const sectionBreakdown = safeCalculate(() => {
    const breakdown = {}
    data.forEach((entry) => {
      const section = entry.tdsSection || 'Other'
      if (!breakdown[section]) {
        breakdown[section] = {
          count: 0,
          amount: 0,
        }
      }
      breakdown[section].count++
      breakdown[section].amount += Math.max(
        Number(entry.tdsAmountDr) || 0,
        Number(entry.tdsAmountCr) || 0
      )
    })
    return breakdown
  })

  // Format number safely
  const formatINR = (value) => {
    const num = Number(value || 0)
    return `₹${num.toLocaleString('en-IN')}`
  }

  // Get most common section
  const mostCommonSection = safeCalculate(() => {
    const sections = {}
    data.forEach((entry) => {
      const section = entry.tdsSection || 'Other'
      sections[section] = (sections[section] || 0) + 1
    })

    let maxSection = 'None'
    let maxCount = 0
    Object.entries(sections).forEach(([section, count]) => {
      if (count > maxCount) {
        maxCount = count
        maxSection = section
      }
    })

    return `${maxSection} (${maxCount})`
  })

  return (
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-6 border-t-2 border-purple-600 md:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <SummaryCard
          label="Total Transactions"
          value={data.length.toString()}
          icon="📊"
          color="blue"
        />
        <SummaryCard
          label="Total Gross Amount"
          value={formatINR(totalGross)}
          icon="💰"
          color="green"
        />
        <SummaryCard
          label="Total TDS Deducted"
          value={formatINR(tdsDeducted)}
          icon="📉"
          color="purple"
        />
        <SummaryCard label="TDS Paid to Govt" value={formatINR(tdsPaid)} icon="✅" color="green" />
        <SummaryCard
          label="TDS Outstanding"
          value={formatINR(tdsOutstanding)}
          icon="⏳"
          color={tdsOutstanding > 0 ? 'red' : 'gray'}
        />
      </div>

      {/* Section Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">TDS Section Breakdown</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(sectionBreakdown).map(([section, data]) => (
            <div key={section} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">Section {section}</div>
              <div className="text-lg font-bold text-gray-800">{formatINR(data.amount)}</div>
              <div className="text-xs text-gray-500">
                {data.count} transaction{data.count !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Most Common Section:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
              {mostCommonSection}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Net Payable:</span>
            <span className="text-green-700 font-bold">{formatINR(totalNetPayable)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Avg TDS per Transaction:</span>
            <span>{formatINR(data.length > 0 ? totalTDS / data.length : 0)}</span>
          </div>
        </div>
      </div>

      {/* Data Status */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 flex items-center justify-between">
          <div>
            Data as of: <span className="font-medium">{new Date().toLocaleString()}</span>
          </div>
          <div className="text-green-600 font-medium">
            {data.length > 0 ? '✓ Real-time data loaded' : '⚠️ No transactions found'}
          </div>
        </div>
      </div>
    </div>
  )
}
