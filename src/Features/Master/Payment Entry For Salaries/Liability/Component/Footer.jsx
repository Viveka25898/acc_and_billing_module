import React from 'react'

const LiabilityFooter = ({
  closingBalance,
  totalTransactions,
  totalPayable,
  totalPending,
  totalPaid,
}) => {
  return (
    <footer className="mt-8 bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Closing Balance</span>
          <span className="text-2xl font-bold text-green-600">{closingBalance}</span>
          <span className="text-xs text-gray-500 mt-1">(Liability)</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Total Payable</span>
          <span className="text-2xl font-bold text-green-700">
            ₹ {totalPayable.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Total Credit Amount</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Pending Payments</span>
          <span className="text-2xl font-bold text-amber-600">
            ₹ {totalPending.toLocaleString('en-IN')}
          </span>
          <span className="text-xs text-gray-500 mt-1">Unpaid Liability</span>
        </div>

        <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium text-gray-600">Total Transactions</span>
          <span className="text-2xl font-bold text-blue-600">{totalTransactions}</span>
          <span className="text-xs text-gray-500 mt-1">Records</span>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Liability Summary:</span>
              Total unpaid salary liability is ₹ {totalPending.toLocaleString('en-IN')}.
              {totalPaid > 0 && ` ₹ ${totalPaid.toLocaleString('en-IN')} has been paid.`}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Next payroll cycle: 30-04-2025 | Payment terms: 10 days from month end
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex gap-2">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Generate Payment Schedule
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} XYZ Pvt. Ltd. | Salary Payable Ledger - Liability Account
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This is a liability account reflecting amounts owed to employees. Credit entries
            increase liability, debit entries decrease liability.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default LiabilityFooter
