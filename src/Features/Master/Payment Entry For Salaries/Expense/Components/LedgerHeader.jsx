import React from 'react'

const LedgerHeader = ({ accountInfo }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 uppercase mb-6">
        Expense Ledger - Salary & Wages
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Account Name:</span>
          <span className="text-gray-900">{accountInfo.accountName}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">GL Code:</span>
          <span className="text-gray-900">{accountInfo.glCode}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Opening Balance:</span>
          <span className="text-red-600 font-medium">{accountInfo.openingBalance}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Company:</span>
          <span className="text-gray-900">{accountInfo.company}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Financial Year:</span>
          <span className="text-gray-900">{accountInfo.financialYear}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Currency:</span>
          <span className="text-gray-900">{accountInfo.currency}</span>
        </div>
      </div>
    </div>
  )
}

export default LedgerHeader
