import React from 'react'

const LWFPayableLedgerHeader = ({ accountInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 mb-6">
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-green-50 p-3 rounded-full">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-800 mb-1">
              {accountInfo?.accountName || 'Employer LWF Payable'}
            </h1>
            <p className="text-gray-600">Current Liability Account - Labour Welfare Fund</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <div className="text-xs text-gray-600 uppercase font-medium mb-1">GL Code</div>
            <div className="text-lg font-semibold text-green-700">
              {accountInfo?.glCode || accountInfo?.glAccountCode || 'L2002011'}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <div className="text-xs text-gray-600 uppercase font-medium mb-1">Account Name</div>
            <div className="text-lg font-semibold text-green-700">
              {accountInfo?.accountName || 'Employer LWF Payable'}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <div className="text-xs text-gray-600 uppercase font-medium mb-1">Account Type</div>
            <div className="text-lg font-semibold text-green-700">
              {accountInfo?.accountType || 'Current Liability'}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <div className="text-xs text-gray-600 uppercase font-medium mb-1">Category</div>
            <div className="text-lg font-semibold text-green-700">
              {accountInfo?.category || 'Statutory'}
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-green-700">ℹ️ Note:</span> Employer LWF contribution
            varies by state, typically paid half-yearly to state labour welfare boards.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LWFPayableLedgerHeader
