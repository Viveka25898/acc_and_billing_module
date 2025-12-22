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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-900">
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
                  className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction, index) => (
              <tr
                key={transaction.id}
                className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.srNo}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{transaction.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.paymentDueDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.voucherType}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                  {transaction.voucherNo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.costCenter}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.department}</td>
                <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                  {transaction.referenceDocNo}
                </td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate"
                  title={transaction.narration}
                >
                  {transaction.narration}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-mono">{transaction.batchId}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.postedBy}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.paymentMethod}</td>
                <td
                  className={`px-4 py-3 text-sm font-medium ${transaction.debit === '-' ? 'text-gray-500' : 'text-red-600'}`}
                >
                  {transaction.debit}
                </td>
                <td
                  className={`px-4 py-3 text-sm font-medium ${transaction.credit === '-' ? 'text-gray-500' : 'text-green-600'}`}
                >
                  {transaction.credit}
                </td>
                <td
                  className={`px-4 py-3 text-sm font-bold ${
                    transaction.balance.includes('CR')
                      ? 'text-green-600'
                      : transaction.balance.includes('DR')
                        ? 'text-red-600'
                        : 'text-gray-600'
                  }`}
                >
                  {transaction.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LiabilityLedgerTable
