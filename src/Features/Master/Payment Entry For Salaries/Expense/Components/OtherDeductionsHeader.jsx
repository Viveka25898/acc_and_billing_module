import React from 'react'
import { MinusCircle } from 'lucide-react'

const OtherDeductionsHeader = () => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header Section */}
        <div className="border-t-4 border-green-600 bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <MinusCircle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Other Deductions Expense Ledger
              </h1>
              <p className="text-gray-600">
                Track all other statutory and non-statutory deductions from employee salaries
              </p>
            </div>
          </div>

          {/* Account Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                GL Code
              </div>
              <div className="text-lg font-bold text-green-900">X2001001008</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                Account Type
              </div>
              <div className="text-lg font-bold text-green-900">Expense</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                Nature
              </div>
              <div className="text-lg font-bold text-green-900">Debit</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
              <div className="text-xs font-semibold text-green-700 uppercase tracking-wide mb-1">
                Statement
              </div>
              <div className="text-lg font-bold text-green-900">P&L Account</div>
            </div>
          </div>

          {/* Deduction Details */}
          <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-sm font-semibold text-green-900 mb-4 flex items-center gap-2">
              <MinusCircle className="w-4 h-4" />
              Other Deductions Coverage
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">💼</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Professional Tax (PT)</div>
                  <div className="text-xs text-gray-600">State-wise PT deductions</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">🏦</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Loan Recoveries</div>
                  <div className="text-xs text-gray-600">Employee loan EMI deductions</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">🎯</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Advance Adjustments</div>
                  <div className="text-xs text-gray-600">Salary advance recoveries</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">⚖️</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">TDS (Tax Deduction)</div>
                  <div className="text-xs text-gray-600">Income tax at source</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">🏛️</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Court Orders</div>
                  <div className="text-xs text-gray-600">Garnishments & attachments</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">📋</span>
                <div>
                  <div className="font-medium text-gray-900 text-sm">Other Statutory</div>
                  <div className="text-xs text-gray-600">Misc. statutory deductions</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OtherDeductionsHeader
