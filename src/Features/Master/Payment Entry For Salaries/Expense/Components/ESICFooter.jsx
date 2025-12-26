/* eslint-disable no-unused-vars */
import React from 'react'

const ESICFooter = ({ closingBalance, totalDebit, totalCredit, transactionCount }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border-t-4 border-green-600 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Closing Balance</h4>
            <span className="text-green-600">💰</span>
          </div>
          <p className="text-2xl font-bold text-green-700">{closingBalance}</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Debit</h4>
            <span className="text-emerald-600">📊</span>
          </div>
          <p className="text-2xl font-bold text-emerald-700">{totalDebit}</p>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-4 rounded-lg border border-teal-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-600">Total Credit</h4>
            <span className="text-teal-600">⏳</span>
          </div>
          <p className="text-2xl font-bold text-teal-700">{totalCredit}</p>
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
          <button className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:from-green-700 hover:to-green-800 transition-all">
            Export Report
          </button>
        </div>
      </div>

      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-xs text-gray-600 leading-relaxed">
          <span className="font-semibold text-green-700">Note:</span> ESIC must be deposited by 15th
          of following month. Ensure timely payment to avoid penalties. Current employer
          contribution rate is 3.25% of ESI wages (capped at ₹21,000/month).
        </p>
      </div>
    </div>
  )
}

export default ESICFooter
