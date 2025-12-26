/* eslint-disable no-unused-vars */
import React from 'react'

const LWFFooter = ({ closingBalance, totalDebit, totalCredit, transactionCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border-t-4 border-blue-600 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Closing Balance</h4>
            <span className="text-blue-600">💰</span>
          </div>
          <p className="text-2xl font-bold text-blue-700">{closingBalance}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Debit</h4>
            <span className="text-indigo-600">📈</span>
          </div>
          <p className="text-2xl font-bold text-indigo-700">{totalDebit}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Credit</h4>
            <span className="text-purple-600">⏳</span>
          </div>
          <p className="text-2xl font-bold text-purple-700">{totalCredit}</p>
        </div>

        <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-4 rounded-lg border border-cyan-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Transactions</h4>
            <span className="text-cyan-600">📝</span>
          </div>
          <p className="text-2xl font-bold text-cyan-700">{transactionCount}</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Last Updated: {new Date().toLocaleString()}</span>
          <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-blue-700">Note:</span> LWF contribution rates and
          payment schedules vary by state. Ensure compliance with state-specific Labour Welfare Fund
          Acts. Contributions are typically half-yearly or annual.
        </p>
      </div>
    </div>
  )
}

export default LWFFooter
