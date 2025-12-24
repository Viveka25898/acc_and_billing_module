/* eslint-disable no-unused-vars */
import React from 'react'

const LiabilityLedgerTable = ({ transactions }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'Overdue':
        return 'bg-red-100 text-red-800'
      case 'Partially Paid':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 border-green-600">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-700 to-green-600">
            <tr>
              {[
                'Sr No',
                'Date',
                'Payment Due',
                'Voucher Type',
                'Voucher No',
                'Cost Center',
                'Department',
                'Reference Doc',
                'Narration',
                'Batch',
                'Posted By',
                'Payment Method',
                'Debit (₹)',
                'Credit (₹)',
                'Running Balance',
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => {
              const isOpeningBalance = transaction.entryType === 'opening'
              const rowBgColor = isOpeningBalance
                ? 'bg-green-50 font-semibold'
                : index % 2 === 0
                  ? 'bg-white'
                  : 'bg-gray-50'

              return (
                <tr
                  key={transaction.id || index}
                  className={`hover:bg-green-50 transition-colors ${rowBgColor}`}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {transaction.srNo || index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium whitespace-nowrap">
                    {transaction.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {transaction.paymentDueDate || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {transaction.voucherType}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-700 font-medium whitespace-nowrap">
                    {transaction.voucherNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {transaction.costCenter || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {transaction.department || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono whitespace-nowrap">
                    {transaction.referenceDocNo || '-'}
                  </td>
                  <td
                    className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate"
                    title={transaction.narration}
                  >
                    {transaction.narration}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-mono whitespace-nowrap">
                    {transaction.batchId || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {transaction.postedBy || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {transaction.paymentMethod || '-'}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                      transaction.debit === '-' || !transaction.debit
                        ? 'text-gray-400'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.debit || '-'}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                      transaction.credit === '-' || !transaction.credit
                        ? 'text-gray-400'
                        : 'text-green-600'
                    }`}
                  >
                    {transaction.credit || '-'}
                  </td>
                  <td
                    className={`px-4 py-3 text-sm font-bold whitespace-nowrap ${
                      String(transaction.runningBalance || transaction.balance || '').includes('CR')
                        ? 'text-green-600'
                        : String(transaction.runningBalance || transaction.balance || '').includes(
                              'DR'
                            )
                          ? 'text-red-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {transaction.runningBalance || transaction.balance || '-'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiabilityLedgerTable
