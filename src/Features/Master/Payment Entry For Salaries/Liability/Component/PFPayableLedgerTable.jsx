import React from 'react'

const PFPayableLedgerTable = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Unpaid':
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
    if (days === 0 || days === '-' || days < 0) return 'text-green-600'
    if (days > 0 && days <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getDelayText = (days) => {
    if (days === '-') return ''
    if (days < 0) return `${Math.abs(days)} days early`
    if (days === 0) return 'On time'
    return `${days} days late`
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
                Compliance Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Dates
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Amount Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-blue-50">
                {/* Column 1: Sr No */}
                <td className="px-4 py-3 text-sm text-center text-gray-900">{transaction.id}</td>

                {/* Column 2: PF Month & Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-gray-900">{transaction.pfMonth}</div>
                  <div className="text-xs text-gray-600">{transaction.costCenter}</div>
                  <div className="text-xs text-gray-500">
                    Employees: {transaction.employeeCount}
                  </div>
                </td>

                {/* Column 3: Voucher Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-blue-600">{transaction.voucherNo}</div>
                  <div className="text-xs text-gray-600">{transaction.voucherType}</div>
                  <div className="text-xs text-gray-500">{transaction.voucherDate}</div>
                </td>

                {/* Column 4: Compliance Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div>
                      <div className="text-xs text-gray-600">ECR No:</div>
                      <div className="text-xs font-mono font-medium">{transaction.ecrNo}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Challan No:</div>
                      <div
                        className={`text-xs font-mono ${transaction.challanNo === 'Pending' ? 'text-amber-600' : 'font-medium'}`}
                      >
                        {transaction.challanNo}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 5: Dates */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div>
                      <div className="text-xs text-gray-600">Due Date:</div>
                      <div className="text-xs font-medium">{transaction.dueDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Payment Date:</div>
                      <div
                        className={`text-xs ${transaction.paymentDate === '-' ? 'text-gray-500' : 'font-medium'}`}
                      >
                        {transaction.paymentDate}
                      </div>
                    </div>
                    {transaction.delayDays !== '-' && (
                      <div
                        className={`text-xs font-medium ${getDelayDaysColor(transaction.delayDays)}`}
                      >
                        {getDelayText(transaction.delayDays)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Column 6: Status */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.paymentStatus)}`}
                    >
                      {transaction.paymentStatus}
                    </span>
                    <div className="text-xs text-gray-600">
                      {transaction.paymentMode !== '-' && (
                        <div>Mode: {transaction.paymentMode}</div>
                      )}
                      {transaction.transactionId !== '-' && (
                        <div className="font-mono text-xs">TXN: {transaction.transactionId}</div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Column 7: Amount Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Credit:</span>
                      <span
                        className={`text-sm font-bold ${transaction.credit === '-' ? 'text-gray-500' : 'text-green-600'}`}
                      >
                        {transaction.credit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-600">Debit:</span>
                      <span
                        className={`text-sm font-bold ${transaction.debit === '-' ? 'text-gray-500' : 'text-red-600'}`}
                      >
                        {transaction.debit}
                      </span>
                    </div>
                    {transaction.amounts?.penalty && (
                      <div className="pt-1 border-t border-gray-200">
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-600">Penalty:</span>
                          <span className="text-xs font-bold text-red-600">
                            ₹ {transaction.amounts.penalty.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="pt-1 border-t border-gray-200">
                      <div className="text-xs text-gray-500 truncate" title={transaction.narration}>
                        {transaction.narration}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Column 8: Balance */}
                <td className="px-4 py-3 text-sm">
                  <div className="text-center">
                    <div
                      className={`text-sm font-bold ${
                        transaction.balance.includes('Cr')
                          ? 'text-green-600'
                          : transaction.balance.includes('Dr')
                            ? 'text-red-600'
                            : 'text-gray-600'
                      }`}
                    >
                      {transaction.balance}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Posted by: {transaction.postedBy}
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

export default PFPayableLedgerTable
