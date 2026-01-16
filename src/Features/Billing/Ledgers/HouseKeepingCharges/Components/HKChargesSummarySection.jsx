// HouseKeeping Charges Summary Section Component
import React from 'react'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const HKChargesSummarySection = ({ summary, ledgerDetails }) => {
  if (!summary || !ledgerDetails) {
    return null
  }

  return (
    <div className="border-t bg-gradient-to-r from-slate-50 to-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Debit */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Debit</div>
              <div className="text-2xl font-bold text-red-600">
                ₹ {ledgerDetails.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingUp className="text-red-600" size={20} />
            </div>
          </div>
        </div>

        {/* Total Credit */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">Total Credit</div>
              <div className="text-2xl font-bold text-green-600">
                ₹ {ledgerDetails.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingDown className="text-green-600" size={20} />
            </div>
          </div>
        </div>

        {/* Closing Balance */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Closing Balance
              </div>
              <div className="text-2xl font-bold text-blue-800">
                ₹ {ledgerDetails.closingBalance}
              </div>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <DollarSign className="text-blue-600" size={20} />
            </div>
          </div>
        </div>

        {/* Transaction Count */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-purple-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Total Transactions
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {ledgerDetails.entries.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">January 2026</div>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <FileText className="text-purple-600" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="text-sm text-blue-800">
          <strong>Note:</strong> This ledger includes all housekeeping services, management fees,
          overtime charges, equipment cleaning, safety equipment, and other HK-related charges as
          per primary posting category.
        </div>
      </div>
    </div>
  )
}

export default HKChargesSummarySection
