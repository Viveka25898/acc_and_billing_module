/* eslint-disable no-unused-vars */
import React from 'react'

const PFFooter = ({
  closingBalance,
  totalTransactions,
  totalEmployerContribution,
  totalPendingAmount,
  totalPaidAmount,
  totalEmployees,
}) => {
  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-red-600">{closingBalance}</span>
          <span className="text-xs text-gray-500 mt-1">Employer PF Liability</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Total Employer PF</span>
          <span className="text-2xl font-bold text-green-700">
            ₹ {totalEmployerContribution.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Current Financial Year</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Pending PF Payments</span>
          <span className="text-2xl font-bold text-amber-600">
            ₹ {totalPendingAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Unpaid Amount</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Covered Employees</span>
          <span className="text-2xl font-bold text-blue-600">{totalEmployees}</span>
          <span className="text-xs text-gray-500 mt-1">PF Eligible Staff</span>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">PF Compliance Status:</span>
              {totalPendingAmount > 0
                ? ` ₹ ${totalPendingAmount.toLocaleString('en-IN')} pending payment. `
                : ' All payments are up to date. '}
              Next due date: 15th of following month.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              EPF Act Compliance | Admin Charges: 0.5% | EDLI Charges: 0.01% | Wage Ceiling: ₹
              15,000
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate ECR File
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Download PF Report
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              View Compliance
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} XYZ Pvt. Ltd. | Employer PF Contribution Expense Ledger
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This ledger tracks Employer's PF, EPS, Admin & EDLI contributions as per EPF Act, 1952
          </p>
        </div>
      </div>
    </footer>
  )
}

export default PFFooter
