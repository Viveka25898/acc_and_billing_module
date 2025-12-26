/* eslint-disable no-unused-vars */
import React from 'react'

const PFFooter = ({
  closingBalance,
  totalTransactions,
  totalEmployerContribution,
  totalPendingAmount,
  totalPaidAmount,
  totalEmployees,
}) => {
  return (
    <footer className="mt-8 bg-white rounded-lg shadow-lg border-t-4 border-blue-600">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">PF Contribution Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-lg border border-red-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Closing Balance</span>
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-red-600">{closingBalance}</p>
            <p className="text-xs text-gray-600 mt-1">Employer PF Expense</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Employer PF</span>
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-green-700">
              ₹ {totalEmployerContribution.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-600 mt-1">Current Financial Year</p>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-lg border border-amber-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Pending Payments</span>
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              ₹ {totalPendingAmount.toLocaleString('en-IN')}
            </p>
            <p className="text-xs text-gray-600 mt-1">Unpaid Amount</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Covered Employees</span>
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalEmployees}</p>
            <p className="text-xs text-gray-600 mt-1">PF Eligible Staff</p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">PF Compliance Status:</span>
                {totalPendingAmount > 0
                  ? ` ₹ ${totalPendingAmount.toLocaleString('en-IN')} pending payment. `
                  : ' All payments are up to date. '}
                Next due date: 15th of following month.
              </p>
              <p className="text-xs text-gray-600 mt-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>EPF Act 1952 | Admin: 0.5% | EDLI: 0.5% | Wage Ceiling: ₹ 15,000</span>
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md text-sm font-medium">
                📄 Generate ECR File
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-md text-sm font-medium">
                📊 Download PF Report
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-md text-sm font-medium">
                ✅ View Compliance
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} iSmart Accounts & Billing System | Employer PF Contribution
          Expense Ledger
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Data as of {new Date().toLocaleDateString()} | Generated at{' '}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </footer>
  )
}

export default PFFooter
