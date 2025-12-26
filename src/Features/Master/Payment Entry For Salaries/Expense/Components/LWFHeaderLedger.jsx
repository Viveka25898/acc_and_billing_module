import React from 'react'

const LWFLedgerHeader = ({ accountInfo }) => {
  if (!accountInfo) return null

  return (
    <div className="bg-white rounded-xl shadow-md border-t-4 border-green-600 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-blue-50 p-3 rounded-lg">
          <span className="text-3xl">🏢</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{accountInfo.ledgerName}</h1>
          <p className="text-sm text-gray-600">Employer Labour Welfare Fund Contribution Expense</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-xs font-medium text-gray-600 uppercase mb-1">GL Code</div>
          <div className="text-lg font-bold text-blue-700">{accountInfo.glCode}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-xs font-medium text-gray-600 uppercase mb-1">Opening Balance</div>
          <div className="text-lg font-bold text-gray-800">{accountInfo.openingBalance}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-xs font-medium text-gray-600 uppercase mb-1">Financial Year</div>
          <div className="text-lg font-bold text-gray-800">{accountInfo.financialYear}</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-xs font-medium text-gray-600 uppercase mb-1">Category</div>
          <div className="text-lg font-bold text-gray-800">{accountInfo.category}</div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-blue-800 mb-3">📝 LWF Contribution Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-600 mb-1">State-wise Rates</div>
            <div className="text-sm font-semibold text-blue-700">Varies by State</div>
            <div className="text-xs text-gray-500 mt-1">Half-yearly or Annual</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Typical Range</div>
            <div className="text-sm font-semibold text-blue-700">₹20-60 per employee</div>
            <div className="text-xs text-gray-500 mt-1">Per contribution period</div>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <div className="text-xs text-gray-600 mb-1">Tax Treatment</div>
            <div className="text-sm font-semibold text-blue-700">Deductible</div>
            <div className="text-xs text-gray-500 mt-1">U/s 43B when paid</div>
          </div>
        </div>
        <div className="mt-3 p-3 bg-blue-100 border border-blue-300 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-blue-700">Note:</span> LWF is applicable in states
            like Maharashtra, Karnataka, Gujarat, Tamil Nadu, Andhra Pradesh, and others.
            Contribution rates and payment frequency vary by state legislation.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LWFLedgerHeader
