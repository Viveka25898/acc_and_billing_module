import React from 'react'

const EmployeePFHeader = ({ accountInfo }) => {
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
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-800">Employee PF Payable</h2>
          <p className="text-sm text-gray-600 mt-1">
            Current Liability - Provident Fund (Employee Contribution)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex flex-col bg-green-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">GL Code:</span>
          <span className="text-green-700 font-bold">
            {accountInfo?.glCode || accountInfo?.glAccountCode || 'L2002006'}
          </span>
        </div>
        <div className="flex flex-col bg-green-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Account Name:</span>
          <span className="text-gray-900 font-medium">
            {accountInfo?.accountName || 'Employee PF Payable'}
          </span>
        </div>
        <div className="flex flex-col bg-green-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Account Type:</span>
          <span className="text-gray-900">{accountInfo?.accountType || 'Current Liability'}</span>
        </div>
        <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Parent Account:</span>
          <span className="text-gray-900">
            {accountInfo?.parentAccount || 'Statutory Liabilities'}
          </span>
        </div>
        <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Statutory Act:</span>
          <span className="text-gray-900">{accountInfo?.statutoryAct || 'EPF Act 1952'}</span>
        </div>
        <div className="flex flex-col bg-gray-50 p-3 rounded-lg">
          <span className="font-semibold text-gray-700">Nature of Account:</span>
          <span className="text-gray-900">{accountInfo?.natureOfAccount || 'Credit'}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-green-200">
        <p className="text-xs text-gray-500 text-center">
          Employee contribution @ 12% of Basic + DA, deducted from salary and remitted to EPFO by
          15th of next month
        </p>
      </div>
    </div>
  )
}

export default EmployeePFHeader
