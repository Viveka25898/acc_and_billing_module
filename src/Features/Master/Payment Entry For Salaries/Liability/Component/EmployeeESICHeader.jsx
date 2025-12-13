import React from 'react'

const EmployeeESICHeader = ({ accountInfo }) => {
  return (
    <div className="bg-green-700 text-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-1">Employee Contribution towards ESIC Payable</h1>
          <p className="text-teal-200">
            Current Liability Account - Employee State Insurance Corporation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-800/50 p-4 rounded-lg">
            <div className="text-xs text-teal-300 uppercase font-medium mb-1">GL Code</div>
            <div className="text-lg font-semibold">{accountInfo.glCode}</div>
          </div>

          <div className="bg-green-800/50 p-4 rounded-lg">
            <div className="text-xs text-teal-300 uppercase font-medium mb-1">Account Name</div>
            <div className="text-lg font-semibold">{accountInfo.accountName}</div>
          </div>

          <div className="bg-green-800/50 p-4 rounded-lg">
            <div className="text-xs text-teal-300 uppercase font-medium mb-1">Account Type</div>
            <div className="text-lg font-semibold">{accountInfo.accountType}</div>
          </div>

          <div className="bg-green-800/50 p-4 rounded-lg">
            <div className="text-xs text-teal-300 uppercase font-medium mb-1">Statutory Act</div>
            <div className="text-lg font-semibold">{accountInfo.statutoryAct}</div>
          </div>

          <div className="bg-green-800/50 p-4 rounded-lg">
            <div className="text-xs text-teal-300 uppercase font-medium mb-1">
              Contribution Rate
            </div>
            <div className="text-lg font-semibold">{accountInfo.contributionRate}</div>
          </div>

          <div className="bg-green-800/50 p-4 rounded-lg">
            <div className="text-xs text-teal-300 uppercase font-medium mb-1">Due Date</div>
            <div className="text-lg font-semibold">{accountInfo.dueDate}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeESICHeader
