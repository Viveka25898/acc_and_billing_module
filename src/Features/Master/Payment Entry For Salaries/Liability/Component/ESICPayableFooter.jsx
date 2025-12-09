/* eslint-disable no-unused-vars */
import React from 'react'

const ESICPayableFooter = ({
  closingBalance,
  totalTransactions,
  totalDebit,
  totalCredit,
  pendingLiabilities,
  penaltiesIncurred,
  complianceInfo,
  journalEntries,
}) => {
  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-green-600">{closingBalance}</span>
          <span className="text-xs text-gray-500 mt-1">(Liability to ESIC)</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <span className="text-sm font-medium text-gray-600">Pending ESIC Liability</span>
          <span className="text-2xl font-bold text-red-600">
            ₹ {pendingLiabilities.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Due to ESIC</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg border-l-4 border-amber-500">
          <span className="text-sm font-medium text-gray-600">Total Debit</span>
          <span className="text-2xl font-bold text-amber-600">
            ₹ {totalDebit.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Payments Made</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <span className="text-sm font-medium text-gray-600">Total Credit</span>
          <span className="text-2xl font-bold text-green-600">
            ₹ {totalCredit.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Liability Accrued</span>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Journal Entry Section */}
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Journal Entry Examples</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm font-medium text-gray-700 mb-1">At Payroll Processing:</div>
                <div className="text-xs font-mono">
                  Dr. ESIC Expense - Employer @ 3.25%
                  <br />
                  Cr. ESIC Payable - Employer Share
                </div>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-green-500">
                <div className="text-sm font-medium text-gray-700 mb-1">At Payment:</div>
                <div className="text-xs font-mono">
                  Dr. ESIC Payable - Employer Share
                  <br />
                  Cr. Bank Account
                </div>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-red-500">
                <div className="text-sm font-medium text-gray-700 mb-1">Penalty Entry:</div>
                <div className="text-xs font-mono">
                  Dr. ESIC Penalty Expense
                  <br />
                  Cr. ESIC Payable - Penalties
                </div>
              </div>
            </div>
          </div> */}

          {/* Compliance Requirements */}
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">⚖️ Compliance Requirements</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Payment due within 15 days after month-end
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Applicable to establishments with 10+ employees
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">Wage ceiling: ₹ 21,000 per month</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">File returns online via ESIC portal</span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  Penalties apply for late payment or non-compliance
                </span>
              </li>
            </ul>
          </div> */}

          {/* Action Buttons */}
          {/* <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pay ESIC Dues
              </button>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Generate ESIC Return
              </button>
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                View Compliance Report
              </button>
            </div>
          </div> */}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} XYZ Pvt. Ltd. | ESIC Payable - Employer Share Liability
            Ledger
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This ledger tracks employer's liability to ESIC as per ESI Act, 1948 | Employer Rate:{' '}
            {complianceInfo.employerRate} | Wage Ceiling: {complianceInfo.wageCeiling} | Due Date:{' '}
            {complianceInfo.dueDate}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default ESICPayableFooter
