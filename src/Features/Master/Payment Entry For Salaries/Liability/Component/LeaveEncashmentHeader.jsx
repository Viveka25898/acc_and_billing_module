import React from 'react'

const LeaveEncashmentHeader = () => {
  return (
    <div className="bg-green-900 text-white p-6 border-b-4 border-green-600">
      <h1 className="text-2xl font-bold mb-2">LIABILITY ACCOUNT LEDGER</h1>
      <p className="text-green-200">Provision for Leave Encashment - Balance Sheet Account</p>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-800/50 p-3 rounded">
          <div className="text-xs text-green-300">GL Code</div>
          <div className="font-bold">L2001012</div>
        </div>
        <div className="bg-green-800/50 p-3 rounded">
          <div className="text-xs text-green-300">Account Name</div>
          <div className="font-bold">PROVISION FOR LEAVE ENCASHMENT</div>
        </div>
        <div className="bg-green-800/50 p-3 rounded">
          <div className="text-xs text-green-300">Account Type</div>
          <div className="font-bold">Liability</div>
        </div>
        <div className="bg-green-800/50 p-3 rounded">
          <div className="text-xs text-green-300">Financial Statement</div>
          <div className="font-bold">Balance Sheet</div>
        </div>
      </div>
    </div>
  )
}

export default LeaveEncashmentHeader
