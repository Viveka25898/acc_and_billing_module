import React from 'react'
import { TrendingDown, DollarSign, ArrowUpCircle, FileText } from 'lucide-react'

const BonusFooter = ({ summaryData }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '₹0.00'
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Closing Balance Card */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 opacity-80" />
            <TrendingDown className="w-5 h-5 opacity-60" />
          </div>
          <div className="text-sm font-medium opacity-90 mb-1">Closing Balance</div>
          <div className="text-2xl font-bold">
            {formatCurrency(summaryData?.closingBalance || 0)}
          </div>
        </div>

        {/* Total Debit Card */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <ArrowUpCircle className="w-8 h-8 opacity-80" />
            <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Debit</div>
          </div>
          <div className="text-sm font-medium opacity-90 mb-1">Total Debit</div>
          <div className="text-2xl font-bold">{formatCurrency(summaryData?.totalDebit || 0)}</div>
        </div>

        {/* Total Credit Card */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <ArrowUpCircle className="w-8 h-8 opacity-80 rotate-180" />
            <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Credit</div>
          </div>
          <div className="text-sm font-medium opacity-90 mb-1">Total Credit</div>
          <div className="text-2xl font-bold">{formatCurrency(summaryData?.totalCredit || 0)}</div>
        </div>

        {/* Transactions Card */}
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-5 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <FileText className="w-8 h-8 opacity-80" />
            <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Count</div>
          </div>
          <div className="text-sm font-medium opacity-90 mb-1">Total Transactions</div>
          <div className="text-2xl font-bold">{summaryData?.transactions || 0}</div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-1">GL Code: X2001001007 | Bonus Provision Expense Ledger</p>
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} iSmart Accounts & Billing Module • All bonus provisions
            managed as per Payment of Bonus Act
          </p>
        </div>
      </div>
    </div>
  )
}

export default BonusFooter
