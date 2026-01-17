// Client Ledger Footer Component
import React from 'react'
import { TrendingUp, TrendingDown, Clock, AlertTriangle } from 'lucide-react'

const ClientLedgerFooter = ({ summary, ledgerDetails }) => {
  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300 p-4 sm:p-6">
      {/* Summary Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Invoices (Debit)</div>
              <div className="text-2xl font-bold text-red-600">{summary.totalDebit}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Total Payments (Credit)</div>
              <div className="text-2xl font-bold text-green-600">{summary.totalCredit}</div>
            </div>
            <TrendingDown className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-gray-500 mb-1">Closing Balance</div>
              <div className="text-2xl font-bold text-blue-600">{summary.closingBalance}</div>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">₹</span>
            </div>
          </div>
        </div>
      </div>

      {/* Aging Analysis */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-800">Aging Analysis</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-xs text-gray-600 mb-1">Current (0-30 days)</div>
            <div className="text-lg font-bold text-green-700">{summary.agingAnalysis.current}</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-xs text-gray-600 mb-1">31-60 days</div>
            <div className="text-lg font-bold text-yellow-700">{summary.agingAnalysis.days_30}</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-xs text-gray-600 mb-1">61-90 days</div>
            <div className="text-lg font-bold text-orange-700">{summary.agingAnalysis.days_60}</div>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="text-xs text-gray-600 mb-1">Above 90 days</div>
            <div className="text-lg font-bold text-red-700">{summary.agingAnalysis.above_60}</div>
          </div>
        </div>
      </div>

      {/* Transaction Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Total Invoices</div>
          <div className="text-xl font-bold text-blue-600">{ledgerDetails.totalInvoices}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Total Payments Received</div>
          <div className="text-xl font-bold text-green-600">{ledgerDetails.totalPayments}</div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="text-xs text-gray-500 mb-1">Current Outstanding</div>
          <div className="text-xl font-bold text-red-600">{ledgerDetails.currentOutstanding}</div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div>
          <div className="text-sm font-semibold text-yellow-800 mb-1">Payment Terms Notice</div>
          <div className="text-xs text-yellow-700">
            Payment terms for this client: <strong>Net 30 Days</strong>. Outstanding amount of{' '}
            <strong>₹1,67,080</strong> is past due (31-60 days). Please follow up for timely
            collection.
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

export default ClientLedgerFooter
