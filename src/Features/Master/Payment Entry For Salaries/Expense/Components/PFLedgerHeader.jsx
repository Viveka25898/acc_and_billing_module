import React from 'react'

const PFLedgerHeader = ({ accountInfo, pfRates }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 uppercase mb-6">
        Employer PF Contribution - Expense Ledger
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
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
          <span className="text-red-600 font-bold">{accountInfo.openingBalance}</span>
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
          <span className="font-semibold text-gray-700">PF Reg. No:</span>
          <span className="text-gray-900">{accountInfo.pfRegistrationNo}</span>
        </div>
      </div>

      {/* PF Rates Section */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">PF Contribution Rates</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-blue-700">Employee PF</span>
            <span className="text-sm font-bold text-blue-900">{pfRates.employeePfRate}</span>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-green-700">Employer PF</span>
            <span className="text-sm font-bold text-green-900">{pfRates.employerPfRate}</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-purple-700">Employer EPS</span>
            <span className="text-sm font-bold text-purple-900">{pfRates.employerEpsRate}</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-amber-700">Admin Charges</span>
            <span className="text-sm font-bold text-amber-900">{pfRates.adminChargesRate}</span>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-red-700">EDLI Charges</span>
            <span className="text-sm font-bold text-red-900">{pfRates.edliChargesRate}</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Wage Ceiling: {pfRates.wageCeiling} | PF Office: {accountInfo.pfOffice}
        </div>
      </div>
    </div>
  )
}

export default PFLedgerHeader
