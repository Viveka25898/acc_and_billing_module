// Revenue Ledger Header Component
import React from 'react'
import { TrendingUp, Layers, FileText, Calendar } from 'lucide-react'

const RevenueLedgerHeader = ({ ledgerInfo }) => {
  if (!ledgerInfo) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
      {/* Top Section - Account Name & Type */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-6 h-6" />
            <h1 className="text-2xl sm:text-3xl font-bold">Revenue Ledger</h1>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold">{ledgerInfo.accountName}</h2>
          <div className="flex items-center gap-2 mt-1 text-blue-100">
            <Layers className="w-4 h-4" />
            <span className="text-sm">{ledgerInfo.category}</span>
          </div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
          <div className="text-xs text-blue-100">Net Revenue</div>
          <div className="text-2xl sm:text-3xl font-bold">₹13,06,900.00</div>
          <div className="text-xs text-blue-100">Credit Balance</div>
        </div>
      </div>

      {/* Grid Section - Account Details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Account Code */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-blue-100 mb-1">Account Code</div>
          <div className="font-semibold text-lg">{ledgerInfo.accountCode}</div>
        </div>

        {/* Account Name */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-blue-100 mb-1">Account Name</div>
          <div className="font-semibold text-sm">{ledgerInfo.accountName}</div>
        </div>

        {/* Account Type */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-blue-100 mb-1">Account Type</div>
          <div className="font-semibold">{ledgerInfo.accountType}</div>
        </div>

        {/* Parent Account */}
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-blue-100 mb-1">Parent Account</div>
          <div className="font-semibold text-sm">
            {ledgerInfo.parentCode} - {ledgerInfo.parentAccount}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="w-4 h-4 text-blue-100" />
          <div className="text-xs text-blue-100">Description</div>
        </div>
        <div className="text-sm">{ledgerInfo.description}</div>
      </div>

      {/* Opening Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-100" />
            <div className="text-xs text-blue-100">Opening Balance (01 Apr 2025)</div>
          </div>
          <div className="font-semibold text-lg">{ledgerInfo.openingBalance}</div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm p-3 rounded-lg">
          <div className="text-xs text-blue-100 mb-1">Current Period Revenue</div>
          <div className="font-semibold text-lg">₹13,06,900.00 CR</div>
        </div>
      </div>
    </div>
  )
}

export default RevenueLedgerHeader
