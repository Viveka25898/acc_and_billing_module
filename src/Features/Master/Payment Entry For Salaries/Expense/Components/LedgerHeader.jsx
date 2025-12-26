import React from 'react'

const LedgerHeader = ({ accountInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-blue-600 mb-6">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Salary & Wages Expense Ledger</h2>
            <p className="text-sm text-gray-600 mt-1">{accountInfo.accountName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">GL Account Code</p>
            <p className="text-lg font-semibold text-blue-600">{accountInfo.glAccountCode}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Opening Balance</p>
            <p className="text-lg font-semibold text-red-600">{accountInfo.openingBalance}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Financial Year</p>
            <p className="text-lg font-semibold text-gray-800">{accountInfo.financialYear}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Category</p>
            <p className="text-lg font-semibold text-gray-800">{accountInfo.category}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> This ledger tracks all salary and wage
            expenses including basic pay, allowances, and other compensation components.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LedgerHeader
