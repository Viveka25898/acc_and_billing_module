import React from 'react'

const ProfessionalTaxHeader = ({ accountInfo }) => {
  return (
    <div className="bg-green-600 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Professional Tax Payable</h1>
          <p className="text-red-200">Current Liability Account - State Government Tax</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">GL Code</div>
            <div className="text-lg font-semibold">{accountInfo.glCode}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Account Name</div>
            <div className="text-lg font-semibold">{accountInfo.accountName}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Account Type</div>
            <div className="text-lg font-semibold">{accountInfo.accountType}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Statutory Act</div>
            <div className="text-lg font-semibold">{accountInfo.statutoryAct}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Tax Type</div>
            <div className="text-lg font-semibold">{accountInfo.taxType}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Due Date</div>
            <div className="text-lg font-semibold">{accountInfo.dueDate}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Tax Rate</div>
            <div className="text-lg font-semibold">{accountInfo.taxRate}</div>
          </div>

          <div className="bg-green-700/50 p-4 rounded-lg">
            <div className="text-xs text-green-300 uppercase font-medium mb-1">Department</div>
            <div className="text-lg font-semibold">{accountInfo.department}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalTaxHeader
