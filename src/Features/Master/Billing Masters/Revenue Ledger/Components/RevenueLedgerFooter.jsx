/* eslint-disable no-unused-vars */
// Revenue Ledger Footer Component
import React from 'react'
import { TrendingUp, TrendingDown, BarChart3, DollarSign } from 'lucide-react'

const RevenueLedgerFooter = ({ summary, ledgerDetails }) => {
  // Provide default values for missing data
  const monthlyStats = summary?.monthlyStats || {
    november: '₹0.00',
    december: '₹0.00',
  }

  const averageTransaction = summary?.averageTransaction || summary?.avgTransactionValue || '₹0.00'

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300 p-4 sm:p-6">
      {/* Summary Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Credit (Revenue)</div>
              <div className="text-2xl font-bold text-green-600">{summary.totalCredit}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Debit (Reversals)</div>
              <div className="text-2xl font-bold text-red-600">{summary.totalDebit}</div>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Net Revenue</div>
              <div className="text-2xl font-bold text-blue-600">{summary.netRevenue}</div>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Total Transactions</div>
          <div className="text-xl font-bold text-gray-600">{summary.transactionCount}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Average Transaction</div>
          <div className="text-xl font-bold text-blue-600">{averageTransaction}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Revenue Type</div>
          <div className="text-xl font-bold text-green-600">Service Revenue</div>
        </div>
      </div>

      {/* Monthly Stats */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue Breakdown</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs text-gray-600 mb-1">November 2025</div>
            <div className="text-lg font-bold text-blue-700">{monthlyStats.november}</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-gray-600 mb-1">December 2025</div>
            <div className="text-lg font-bold text-green-700">{monthlyStats.december}</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">Revenue Growth</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-green-600">+26%</div>
            <span className="text-xs text-gray-600">(Dec vs Nov)</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-2">Reversal Rate</div>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold text-orange-600">14.3%</div>
            <span className="text-xs text-gray-600">of total revenue</span>
          </div>
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-4 text-center text-xs text-gray-500">
        Last Updated:{' '}
        {new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </div>
    </div>
  )
}

export default RevenueLedgerFooter
