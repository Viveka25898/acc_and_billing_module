import React from 'react'

const OtherDeductionsHeader = ({ accountInfo }) => {
  return (
    <div className="bg-gray-800 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Other Deductions Expense Ledger</h1>
          <p className="text-gray-300">Payroll Expense Management System</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">GL Code</div>
            <div className="text-lg font-semibold">{accountInfo.glCode}</div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">Account Name</div>
            <div className="text-lg font-semibold">{accountInfo.accountName}</div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">Parent Account</div>
            <div className="text-lg font-semibold">{accountInfo.parentAccount}</div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">Account Type</div>
            <div className="text-lg font-semibold">{accountInfo.accountType}</div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">
              Financial Statement
            </div>
            <div className="text-lg font-semibold">{accountInfo.financialStatement}</div>
          </div>

          {/* <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">Cost Center</div>
            <div className="text-lg font-semibold">{accountInfo.costCenter}</div>
          </div> */}

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">Department</div>
            <div className="text-lg font-semibold">{accountInfo.department}</div>
          </div>

          <div className="bg-gray-700/50 p-4 rounded-lg">
            <div className="text-xs text-gray-400 uppercase font-medium mb-1">
              Nature of Account
            </div>
            <div className="text-lg font-semibold">{accountInfo.natureOfAccount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtherDeductionsHeader
