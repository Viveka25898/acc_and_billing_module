/* eslint-disable no-unused-vars */
import React from 'react'

const ESICLedgerHeader = ({ accountInfo, complianceInfo, medicalBenefits }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 uppercase mb-6">
        Employer ESIC Contribution - Expense Ledger
      </h2>

      {/* Main Account Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">GL Code:</span>
          <span className="text-gray-900 font-medium">{accountInfo.glCode}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Account Name:</span>
          <span className="text-gray-900 font-medium">{accountInfo.accountName}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Account Type:</span>
          <span className="text-red-600 font-bold">Expense (P&L)</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Parent Account:</span>
          <span className="text-gray-900">{accountInfo.parentAccount}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">ESI Reg. No:</span>
          <span className="text-gray-900 font-mono">{accountInfo.esiRegistrationNo}</span>
        </div>
        <div className="flex flex-col">
          <span className="font-semibold text-gray-700">Opening Balance:</span>
          <span className="text-red-600 font-bold">{accountInfo.openingBalance}</span>
        </div>
      </div>

      {/* ESIC Compliance Section */}
    </div>
  )
}

export default ESICLedgerHeader
