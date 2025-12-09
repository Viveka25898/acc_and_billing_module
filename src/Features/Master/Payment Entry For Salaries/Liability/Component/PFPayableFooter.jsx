/* eslint-disable no-unused-vars */
import React from 'react'

const PFPayableFooter = ({
  closingBalance,
  totalTransactions,
  totalLiability,
  totalUnpaidAmount,
  overdueAmount,
  penaltyAmount,
}) => {
  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-green-600">{closingBalance}</span>
          <span className="text-xs text-gray-500 mt-1">(Liability to EPFO)</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Unpaid PF Liability</span>
          <span className="text-2xl font-bold text-red-600">
            ₹ {totalUnpaidAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Due to EPFO</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-amber-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Overdue Amount</span>
          <span className="text-2xl font-bold text-amber-600">
            ₹ {overdueAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Past Due Date</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Penalties Incurred</span>
          <span className="text-2xl font-bold text-purple-600">
            ₹ {penaltyAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Late Payments</span>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">EPFO Compliance Status:</span>
              {totalUnpaidAmount > 0
                ? ` ₹ ${totalUnpaidAmount.toLocaleString('en-IN')} payable to EPFO. `
                : ' All PF payments are up to date. '}
              {overdueAmount > 0 && `₹ ${overdueAmount.toLocaleString('en-IN')} is overdue.`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Next ECR due: 15th of following month | Late fee: ₹ 1000/day | Penalty: 1% per month
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Pay EPFO Dues
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Generate ECR
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Download Compliance Report
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} XYZ Pvt. Ltd. | PF Payable Liability Ledger
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This ledger tracks liability to EPFO for Employee PF, Employer PF, EPS, Admin & EDLI
            contributions
          </p>
        </div>
      </div>
    </footer>
  )
}

export default PFPayableFooter
