import React from 'react'

const LiabilityLedgerHeader = ({ accountInfo }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 uppercase mb-6">
        Salary Payable - Liability Ledger
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Account Name:</span>
          <span className="text-gray-900 font-medium">{accountInfo.accountName}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">GL Code:</span>
          <span className="text-gray-900 font-medium">{accountInfo.glCode}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Opening Balance:</span>
          <span className="text-green-600 font-bold">{accountInfo.openingBalance}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Company:</span>
          <span className="text-gray-900">{accountInfo.company}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Fiscal Period:</span>
          <span className="text-gray-900">{accountInfo.fiscalPeriod}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Currency:</span>
          <span className="text-gray-900">{accountInfo.currency}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-gray-200">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Account Type:</span>
          <span className="text-gray-900">{accountInfo.accountType}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Category:</span>
          <span className="text-gray-900">{accountInfo.category}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Credit Days:</span>
          <span className="text-gray-900">{accountInfo.creditDays} days</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Tax Applicable:</span>
          <span className="text-gray-900">{accountInfo.taxApplicable}</span>
        </div>
      </div>
    </div>
  )
}

export default LiabilityLedgerHeader
