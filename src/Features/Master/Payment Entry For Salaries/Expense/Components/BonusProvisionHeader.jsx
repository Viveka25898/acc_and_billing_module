import React from 'react'

const BonusProvisionHeader = ({ accountInfo }) => {
  return (
    <div className="bg-gray-800 text-white p-5 border-b-4 border-blue-600">
      <h1 className="text-xl md:text-2xl font-bold mb-2">EXPENSE ACCOUNT LEDGER</h1>
      <p className="text-blue-200 text-sm md:text-base">
        Bonus Provision Expense - Profit & Loss Account
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">GL Code</div>
          <div className="font-bold">{accountInfo.glCode}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Account Name</div>
          <div className="font-bold">{accountInfo.accountName}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Account Type</div>
          <div className="font-bold">{accountInfo.accountType}</div>
        </div>
        <div className="bg-gray-700 p-3 rounded">
          <div className="text-xs text-gray-400">Statutory Act</div>
          <div className="font-bold">{accountInfo.statutoryAct}</div>
        </div>
      </div>
    </div>
  )
}

export default BonusProvisionHeader
