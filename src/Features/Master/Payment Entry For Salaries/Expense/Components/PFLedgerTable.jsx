import React from 'react'

const PFLedgerTable = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Late Paid':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDelayDaysColor = (days) => {
    if (days === 0 || days === '-') return 'text-green-600'
    if (days > 0) return 'text-red-600'
    return 'text-blue-600' // early payment
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Sr No
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                PF Month
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Voucher Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Employee Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Wage Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                PF Calculations
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ECR & Challan
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amounts
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-blue-50">
                {/* Column 1: Sr No */}
                <td className="px-4 py-3 text-sm text-center text-gray-900">{transaction.id}</td>

                {/* Column 2: PF Month */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{transaction.pfPostingMonth}</div>
                  <div className="text-xs text-gray-500">{transaction.siteCostCenter}</div>
                </td>

                {/* Column 3: Voucher Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-blue-600">{transaction.voucherNo}</div>
                  <div className="text-xs text-gray-600">{transaction.voucherType}</div>
                  <div className="text-xs text-gray-500">{transaction.voucherDate}</div>
                </td>

                {/* Column 4: Employee Details */}
                <td className="px-4 py-3 text-sm">
                  {transaction.employeeUan !== '-' ? (
                    <>
                      <div className="font-medium text-gray-900">{transaction.employeeName}</div>
                      <div className="text-xs text-gray-600">ID: {transaction.employeeId}</div>
                      <div className="text-xs text-gray-500">UAN: {transaction.employeeUan}</div>
                      <div className="text-xs text-gray-500">PF: {transaction.pfAccountNo}</div>
                    </>
                  ) : (
                    <div className="text-gray-500 text-sm">Consolidated Entry</div>
                  )}
                </td>

                {/* Column 5: Wage Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="grid grid-cols-2 gap-1">
                    <span className="text-xs text-gray-600">Basic Wage:</span>
                    <span className="text-xs font-medium">{transaction.basicWage}</span>
                    <span className="text-xs text-gray-600">PF Wage:</span>
                    <span className="text-xs font-medium">{transaction.pfWage}</span>
                  </div>
                </td>

                {/* Column 6: PF Calculations */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Emp PF:</span>
                      <span className="font-medium">{transaction.employeePfContribution}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Empr PF:</span>
                      <span className="font-medium text-green-600">
                        {transaction.employerPfContribution}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Empr EPS:</span>
                      <span className="font-medium text-purple-600">
                        {transaction.employerEpsContribution}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Column 7: ECR & Challan */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div>
                      <div className="text-xs text-gray-600">ECR:</div>
                      <div className="text-xs font-mono">{transaction.ecrNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Challan:</div>
                      <div className="text-xs font-mono">{transaction.challanNo}</div>
                    </div>
                  </div>
                </td>

                {/* Column 8: Payment Status */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.paymentStatus)}`}
                    >
                      {transaction.paymentStatus}
                    </span>
                    <div className="text-xs">
                      <div className="text-gray-600">Due: {transaction.dueDate}</div>
                      <div className="text-gray-600">Paid: {transaction.paymentDate}</div>
                      <div
                        className={`text-xs font-medium ${getDelayDaysColor(transaction.delayDays)}`}
                      >
                        {transaction.delayDays !== '-'
                          ? `Delay: ${transaction.delayDays} days`
                          : ''}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 9: Amounts */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Employer Total:</span>
                      <span className="text-sm font-bold text-red-600">
                        {transaction.totalEmployerContribution}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Total PF:</span>
                      <span className="text-xs font-medium">{transaction.totalPfAmount}</span>
                    </div>
                    <div className="pt-1 border-t border-gray-200">
                      <div className="text-xs text-gray-500 truncate" title={transaction.narration}>
                        {transaction.narration}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PFLedgerTable
