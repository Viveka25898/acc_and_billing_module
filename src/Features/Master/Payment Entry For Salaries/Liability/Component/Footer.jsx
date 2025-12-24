import React from 'react'

const LiabilityFooter = ({
  closingBalance,
  totalTransactions,
  totalPayable,
  totalPending,
  totalPaid,
}) => {
  // Safely parse numeric values with error handling
  const safeParseAmount = (value) => {
    try {
      if (typeof value === 'number') return value
      if (typeof value === 'string') {
        // Remove currency symbols, commas, and CR/DR suffixes
        const cleanValue = value
          .replace(/[₹,]/g, '')
          .replace(/(CR|DR)/g, '')
          .trim()
        const parsed = parseFloat(cleanValue)
        return isNaN(parsed) ? 0 : parsed
      }
      return 0
    } catch {
      return 0
    }
  }

  const payableAmount = safeParseAmount(totalPayable)
  const pendingAmount = safeParseAmount(totalPending)
  const paidAmount = safeParseAmount(totalPaid)

  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6 border-t-4 border-green-600">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-green-600">{closingBalance || '0.00 CR'}</span>
          <span className="text-xs text-gray-500 mt-1">(Liability)</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-green-50 to-white rounded-lg border border-green-200">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-600">Total Payable</span>
          <span className="text-2xl font-bold text-green-700">
            ₹{' '}
            {payableAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-gray-500 mt-1">Total Credit Amount</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200">
          <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-600">Pending Payments</span>
          <span className="text-2xl font-bold text-amber-600">
            ₹{' '}
            {pendingAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
          <span className="text-xs text-gray-500 mt-1">Unpaid Liability</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center mb-2">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <span className="text-sm font-medium text-gray-600">Total Transactions</span>
          <span className="text-2xl font-bold text-gray-700">{totalTransactions || 0}</span>
          <span className="text-xs text-gray-500 mt-1">Records</span>
        </div>
      </div>

      <div className="pt-6 border-t border-green-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-green-700">Liability Summary:</span> Total unpaid
              salary liability is ₹{' '}
              {pendingAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.
              {paidAmount > 0 &&
                ` ₹ ${paidAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} has been paid.`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Payment terms: Monthly salary processed on last working day | Settlement within 3
              working days
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Export Report
            </button>
          </div>
        </div>

        <div className="mt-6 text-center bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} iSmart Business Solutions | Salary Payable Ledger -
            Liability Account
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This is a liability account reflecting amounts owed to employees. Credit entries
            increase liability, debit entries decrease liability (payments made).
          </p>
        </div>
      </div>
    </footer>
  )
}

export default LiabilityFooter
