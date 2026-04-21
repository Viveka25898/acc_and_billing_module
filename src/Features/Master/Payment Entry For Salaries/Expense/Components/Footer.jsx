/* eslint-disable no-unused-vars */
import React from 'react'

const Footer = ({ closingBalance, totalTransactions, transactions, summary }) => {
  return (
    <footer className="mt-8 bg-white rounded-lg shadow-lg border-t-4 border-blue-600">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ledger Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <p className="text-xs text-gray-600 mt-1">
              Current balance as of {new Date().toLocaleDateString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Transactions</span>
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-blue-600">{totalTransactions}</p>
            <p className="text-xs text-gray-600 mt-1">Total transaction entries</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Expense</span>
              <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-purple-600">{summary?.totalDebit || '₹ 0'}</p>
            <p className="text-xs text-gray-600 mt-1">Total debit amount</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Total Credit</span>
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <p className="text-2xl font-bold text-green-600">{summary?.totalCredit || '₹ 0'}</p>
            <p className="text-xs text-gray-600 mt-1">Total credit amount</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          © {new Date().getFullYear()} iSmart Accounts & Billing System. All rights reserved.
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Data as of {new Date().toLocaleDateString()} | Generated at{' '}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </footer>
  )
}

export default Footer
