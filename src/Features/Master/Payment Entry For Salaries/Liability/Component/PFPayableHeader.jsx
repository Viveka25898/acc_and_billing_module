/* eslint-disable no-unused-vars */
import React from 'react'

const PFPayableHeader = ({ accountInfo, complianceInfo }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg mb-6">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-900 uppercase mb-6">
        PF Payable - Liability Ledger
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
          <span className="text-green-600 font-bold">{accountInfo.openingBalance}</span>
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

      {/* Compliance Section */}
      {/* <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">EPFO Compliance Rules</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-blue-700">Due Date</span>
            <span className="text-sm font-bold text-blue-900">{complianceInfo.dueDate}</span>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-red-700">Penalty Rate</span>
            <span className="text-sm font-bold text-red-900">{complianceInfo.penaltyRate}</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-amber-700">Late Fee</span>
            <span className="text-sm font-bold text-amber-900">{complianceInfo.lateFee}</span>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-green-700">Grace Period</span>
            <span className="text-sm font-bold text-green-900">{complianceInfo.gracePeriod}</span>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <span className="block text-xs font-medium text-purple-700">Filing Method</span>
            <span className="text-sm font-bold text-purple-900">{complianceInfo.filingMethod}</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          EPFO Office: {accountInfo.pfOffice} | Circle: {accountInfo.epfoCircle}
        </div>
      </div> */}
    </div>
  )
}

export default PFPayableHeader
