// Service Tax Summary Footer Component
import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, FileText } from 'lucide-react'

const ServiceTaxSummaryFooter = ({ summary, ledgerDetails }) => {
  if (!summary || !ledgerDetails) return null

  return (
    <div className="border-t bg-gradient-to-r from-slate-50 to-gray-50 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Total Debit (Payments)
              </div>
              <div className="text-2xl font-bold text-red-600">
                ₹ {ledgerDetails.totalDebit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-red-100 p-2 rounded-lg">
              <TrendingUp className="text-red-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Total Credit (Collected)
              </div>
              <div className="text-2xl font-bold text-green-600">
                ₹ {ledgerDetails.totalCredit.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <TrendingDown className="text-green-600" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-violet-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                Closing Balance (Payable)
              </div>
              <div className="text-2xl font-bold text-violet-800">
                ₹ {ledgerDetails.closingBalance}
              </div>
            </div>
            <div className="bg-violet-100 p-2 rounded-lg">
              <DollarSign className="text-violet-600" size={20} />
            </div>
          </div>
        </div>
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
      <div className="mt-4 bg-violet-50 border border-violet-200 rounded-lg p-4">
        <div className="text-sm text-violet-800">
          <strong>Note:</strong> Service Tax @ 15% applicable on specific services (SEZ/EOU
          contracts). Payment due by 6th of following month via Challan GAR-7.
        </div>
      </div>
    </div>
  )
}

export default ServiceTaxSummaryFooter
