/* eslint-disable no-unused-vars */
import React from 'react'

const ESICLedgerHeader = ({ accountInfo, complianceInfo, medicalBenefits }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 mb-6">
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Employer ESIC Contribution - Expense Ledger
            </h2>
            <p className="text-sm text-gray-600 mt-1">{accountInfo.accountName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">GL Account Code</p>
            <p className="text-lg font-semibold text-green-600">{accountInfo.glAccountCode}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Opening Balance</p>
            <p className="text-lg font-semibold text-red-600">{accountInfo.openingBalance}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Financial Year</p>
            <p className="text-lg font-semibold text-gray-800">{accountInfo.financialYear}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Category</p>
            <p className="text-lg font-semibold text-gray-800">{accountInfo.category}</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path
                fillRule="evenodd"
                d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            ESIC Contribution Rates (as per ESI Act, 1948)
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <span className="block text-xs font-medium text-green-700">Employee ESIC</span>
              <span className="text-lg font-bold text-green-900">0.75%</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-emerald-200">
              <span className="block text-xs font-medium text-emerald-700">Employer ESIC</span>
              <span className="text-lg font-bold text-emerald-900">3.25%</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-teal-200">
              <span className="block text-xs font-medium text-teal-700">Total ESIC</span>
              <span className="text-lg font-bold text-teal-900">4.00%</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-amber-200">
              <span className="block text-xs font-medium text-amber-700">Wage Ceiling</span>
              <span className="text-lg font-bold text-amber-900">₹ 21,000</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600 flex items-center gap-4">
            <span>🏥 Medical Benefits Covered</span>
            <span>💊 Maternity Benefits Included</span>
            <span>♿ Disability Benefits Available</span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">Note:</span> This ledger tracks employer's ESIC
            contributions. Due date: 15th of following month. Benefits include medical care, sick
            leave, maternity, and disability coverage.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ESICLedgerHeader
