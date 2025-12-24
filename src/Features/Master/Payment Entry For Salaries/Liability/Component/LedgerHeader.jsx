import React from 'react'

const LiabilityLedgerHeader = ({ accountInfo }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6 border-t-4 border-green-600">
      <div className="flex items-center justify-center mb-6">
        <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 uppercase">
          {accountInfo.accountName || 'Liability Ledger'}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex flex-col bg-green-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Account Name:</span>
          <span className="text-gray-900 font-medium">{accountInfo.accountName || 'N/A'}</span>
        </div>
        <div className="flex flex-col bg-green-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">GL Code:</span>
          <span className="text-green-700 font-bold">
            {accountInfo.glAccountCode || accountInfo.glCode || 'N/A'}
          </span>
        </div>
        <div className="flex flex-col bg-green-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Opening Balance:</span>
          <span className="text-green-600 font-bold">
            {accountInfo.openingBalance || '0.00 CR'}
          </span>
        </div>
        <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Company:</span>
          <span className="text-gray-900">
            {accountInfo.company || 'iSmart Business Solutions'}
          </span>
        </div>
        <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Fiscal Period:</span>
          <span className="text-gray-900">
            {accountInfo.fiscalPeriod || accountInfo.financialYear || '2024-25'}
          </span>
        </div>
        <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Currency:</span>
          <span className="text-gray-900">{accountInfo.currency || 'INR'}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-4 border-t border-green-200">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Account Type:</span>
          <span className="text-gray-900 font-medium">
            {accountInfo.accountType || 'Current Liability'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Category:</span>
          <span className="text-gray-900 font-medium">
            {accountInfo.category || 'Employee Payables'}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Normal Balance:</span>
          <span className="text-green-700 font-bold">{accountInfo.normalBalance || 'Credit'}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Tax Applicable:</span>
          <span className="text-gray-900">{accountInfo.taxApplicable || 'No'}</span>
        </div>
      </div>
    </div>
  )
}

export default LiabilityLedgerHeader
