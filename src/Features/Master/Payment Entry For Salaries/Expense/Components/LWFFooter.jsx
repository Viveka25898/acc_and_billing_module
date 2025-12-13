/* eslint-disable no-unused-vars */
import React from 'react'

const LWFFooter = ({
  closingBalance,
  totalTransactions,
  totalExpense,
  coveredEmployees,
  statesCovered,
  pendingPayments,
  complianceInfo,
}) => {
  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg border-l-4 border-red-500">
          <span className="text-sm font-medium text-gray-600">Total LWF Expense</span>
          <span className="text-2xl font-bold text-red-600">
            ₹ {totalExpense.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">H1 FY 2024-25</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <span className="text-sm font-medium text-gray-600">Covered Employees</span>
          <span className="text-2xl font-bold text-blue-600">{coveredEmployees}</span>
          <span className="text-xs text-gray-500 mt-1">Across {statesCovered} states</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
          <span className="text-sm font-medium text-gray-600">Pending Payments</span>
          <span className="text-2xl font-bold text-yellow-600">
            ₹ {pendingPayments.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Accrued Liability</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-green-600">{closingBalance}</span>
          <span className="text-xs text-gray-500 mt-1">(Expense Account)</span>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Treatment Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              📊 Account Treatment Guidelines
            </h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-red-500">
                <div className="text-sm font-medium text-gray-700 mb-1">Debit Entry:</div>
                <div className="text-xs text-gray-600">
                  When LWF expense is accrued/recognized (increases expense)
                </div>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-green-500">
                <div className="text-sm font-medium text-gray-700 mb-1">Credit Entry:</div>
                <div className="text-xs text-gray-600">
                  When expense is reversed or adjusted (rare scenarios)
                </div>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                <div className="text-sm font-medium text-gray-700 mb-1">Normal Balance:</div>
                <div className="text-xs text-gray-600">Debit (expense account)</div>
              </div>
            </div>
          </div>

          {/* Journal Entry Patterns */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Journal Entry Pattern</h3>
            <div className="space-y-3">
              <div className="bg-white p-3 rounded border-l-4 border-purple-500">
                <div className="text-sm font-medium text-gray-700 mb-1">Monthly Accrual:</div>
                <div className="text-xs font-mono">
                  Dr. Employer LWF Contribution (Expense)
                  <br />
                  Cr. LWF Payable (Liability)
                </div>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-pink-500">
                <div className="text-sm font-medium text-gray-700 mb-1">At Payment:</div>
                <div className="text-xs font-mono">
                  Dr. LWF Payable (Liability)
                  <br />
                  Cr. Bank Account
                </div>
              </div>
              <div className="bg-white p-3 rounded border-l-4 border-indigo-500">
                <div className="text-sm font-medium text-gray-700 mb-1">Tax Treatment:</div>
                <div className="text-xs text-gray-600">
                  Deductible u/s 43B when actually paid before ITR due date
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🚀 Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pay LWF Dues
              </button>
              <button className="w-full px-4 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Generate State Returns
              </button>
              <button className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
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
          </div>
        </div>

        {/* Important Notes Section */}
        <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L4.342 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h4 className="text-md font-semibold text-yellow-800 mb-2">
                ⚠️ Important Compliance Notes
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-yellow-700">
                <div>
                  • Employer contributions are deductible under Section 43B only when actually paid
                </div>
                <div>• Expense recognized on accrual basis, tax benefit on payment basis</div>
                <div>• Part of total employee cost in cost accounting</div>
                <div>• Monitor state-specific rate revisions and compliance requirements</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} XYZ Pvt. Ltd. | Employer Labour Welfare Fund Contribution
            Expense Ledger
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This ledger tracks employer's statutory contribution to Labour Welfare Fund as per
            various State LWF Acts | Applicable in {complianceInfo.applicableStates} | Tax
            Treatment: {complianceInfo.taxSection}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default LWFFooter
