import React from 'react'

const ESICPayableLedgerTable = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Accrued':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Late Paid':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getBalanceColor = (balanceType) => {
    switch (balanceType) {
      case 'Cr':
        return 'text-green-600 font-bold'
      case 'Dr':
        return 'text-red-600 font-bold'
      default:
        return 'text-gray-600'
    }
  }

  const getDelayDaysColor = (days) => {
    if (days === '-' || days === undefined) return 'text-gray-400'
    if (days < 0) return 'text-green-600'
    if (days === 0) return 'text-blue-600'
    if (days <= 5) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-700 to-green-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Voucher Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Particulars / Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                ESIC Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Debit (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Credit (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Balance (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Bal Type
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr
                key={transaction.id}
                className={`hover:bg-green-50 ${transaction.voucherType === 'Opening Balance' ? 'bg-gray-50' : ''}`}
              >
                {/* Column 1: Date */}
                <td className="px-4 py-3 text-sm text-gray-900">
                  <div className="font-medium">{transaction.date}</div>
                  {transaction.esicMonth !== '-' && (
                    <div className="text-xs text-gray-500">{transaction.esicMonth}</div>
                  )}
                </td>

                {/* Column 2: Voucher Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="font-medium text-blue-600">{transaction.voucherNo}</div>
                  <div className="text-xs text-gray-600">{transaction.voucherType}</div>
                  <div className="text-xs text-gray-500">Ref: {transaction.journalRef}</div>
                </td>

                {/* Column 3: Particulars / Description */}
                <td className="px-4 py-3 text-sm">
                  <div className="text-gray-900 font-medium">{transaction.particulars}</div>
                  {transaction.esiWages !== '-' && (
                    <div className="text-xs text-gray-600 mt-1">
                      Wages: {transaction.esiWages} @ {transaction.employerRate}
                    </div>
                  )}
                  <div
                    className="text-xs text-gray-500 mt-1 truncate max-w-xs"
                    title={transaction.narration}
                  >
                    {transaction.narration}
                  </div>
                  {transaction.esicChallanNo !== '-' && (
                    <div className="text-xs font-mono mt-1">
                      Challan: {transaction.esicChallanNo}
                    </div>
                  )}
                </td>

                {/* Column 4: ESIC Details */}
                <td className="px-4 py-3 text-sm">
                  <div className="space-y-1">
                    <div
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(transaction.paymentStatus)}`}
                    >
                      {transaction.paymentStatus}
                    </div>
                    {transaction.dueDate !== '-' && (
                      <div className="text-xs">
                        <div className="text-gray-600">Due: {transaction.dueDate}</div>
                        <div className="text-gray-600">Paid: {transaction.paymentDate}</div>
                        {transaction.delayDays !== '-' && (
                          <div
                            className={`text-xs font-medium ${getDelayDaysColor(transaction.delayDays)}`}
                          >
                            {transaction.delayDays < 0
                              ? `${Math.abs(transaction.delayDays)} days early`
                              : transaction.delayDays === 0
                                ? 'On time'
                                : `${transaction.delayDays} days late`}
                          </div>
                        )}
                      </div>
                    )}
                    {transaction.penaltyAmount !== '-' && transaction.penaltyAmount !== '₹ 0' && (
                      <div className="text-xs text-red-600 font-medium">
                        Penalty: {transaction.penaltyAmount}
                      </div>
                    )}
                  </div>
                </td>

                {/* Column 5: Debit (₹) */}
                <td className="px-4 py-3 text-sm">
                  {transaction.debit !== '-' ? (
                    <div className="font-bold text-red-600 text-right">{transaction.debit}</div>
                  ) : (
                    <div className="text-gray-400 text-center">-</div>
                  )}
                </td>

                {/* Column 6: Credit (₹) */}
                <td className="px-4 py-3 text-sm">
                  {transaction.credit !== '-' ? (
                    <div className="font-bold text-green-600 text-right">{transaction.credit}</div>
                  ) : (
                    <div className="text-gray-400 text-center">-</div>
                  )}
                </td>

                {/* Column 7: Balance (₹) */}
                <td className="px-4 py-3 text-sm">
                  <div
                    className={`text-right font-bold ${getBalanceColor(transaction.balanceType)}`}
                  >
                    {transaction.balance}
                  </div>
                </td>

                {/* Column 8: Balance Type */}
                <td className="px-4 py-3 text-sm">
                  <div
                    className={`text-center font-bold ${getBalanceColor(transaction.balanceType)}`}
                  >
                    {transaction.balanceType || '-'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

          {/* Total Row */}
          <tfoot className="bg-gradient-to-r from-blue-50 to-purple-50">
            <tr>
              <td colSpan="4" className="px-4 py-4 text-right text-sm font-bold text-gray-900">
                TOTAL
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-red-600">
                ₹{' '}
                {transactions
                  .reduce((sum, t) => sum + parseInt(t.debit.replace(/[^0-9]/g, '') || 0), 0)
                  .toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-green-600">
                ₹{' '}
                {transactions
                  .reduce((sum, t) => sum + parseInt(t.credit.replace(/[^0-9]/g, '') || 0), 0)
                  .toLocaleString('en-IN')}
              </td>
              <td className="px-4 py-4 text-right text-sm font-bold text-blue-900">
                ₹ {transactions.length > 0 ? transactions[transactions.length - 1].balance : '0.00'}
              </td>
              <td className="px-4 py-4 text-center text-sm font-bold text-blue-900">
                {transactions.length > 0
                  ? transactions[transactions.length - 1].balanceType || '-'
                  : '-'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}

export default ESICPayableLedgerTable
