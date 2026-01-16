// HouseKeeping Charges Ledger Header Component
import React from 'react'

const HKChargesLedgerHeader = ({ ledgerInfo }) => {
  if (!ledgerInfo) {
    return <div>Loading ledger details...</div>
  }

  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <div className="text-2xl sm:text-3xl font-bold mb-2">HOUSE KEEPING CHARGES LEDGER</div>
          <div className="text-sm opacity-90">{ledgerInfo.company}</div>
        </div>
        <div className="mt-4 sm:mt-0">
          <div className="bg-blue-700 bg-opacity-50 px-4 py-2 rounded-lg">
            <div className="text-xs opacity-90">Financial Year</div>
            <div className="text-lg font-bold">{ledgerInfo.financialYear}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">GL Account Code</div>
          <div className="text-base font-semibold">{ledgerInfo.glAccount}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Account Type</div>
          <div className="text-base font-semibold">{ledgerInfo.accountType}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Period</div>
          <div className="text-base font-semibold">{ledgerInfo.period}</div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs opacity-90 mb-1">Total Products</div>
          <div className="text-base font-semibold">221 Products</div>
        </div>
      </div>

      <div className="bg-blue-900 bg-opacity-30 p-4 rounded-lg">
        <div className="text-xs opacity-90 mb-1">Opening Balance (01-Apr-2025)</div>
        <div className="text-2xl font-bold">{ledgerInfo.openingBalance}</div>
      </div>
    </div>
  )
}

export default HKChargesLedgerHeader
