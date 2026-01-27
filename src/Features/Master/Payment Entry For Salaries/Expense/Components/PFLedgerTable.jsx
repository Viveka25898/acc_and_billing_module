import React from 'react'

const PFLedgerTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
            <tr>
              {[
                'Sr No',
                'Date',
                'Voucher Type',
                'Voucher No',
                'Cost Center',
                'Department',
                'Customer',
                'Site',
                'State',
                'Counterparty Ledger',
                'Approved By',
                'Payment Method',
                'Narration',
                'Debit (₹)',
                'Credit (₹)',
                'Running Balance',
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider"
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
                className={`transition-colors ${index % 2 === 0 ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 hover:bg-blue-50'}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">{transaction.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {transaction.date}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.voucherType}</td>
                <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                  {transaction.voucherNo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.costCenter}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.department}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.customer || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.site || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.state || '-'}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.counterpartyLedger}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.approvedBy}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.paymentMethod}</td>
                <td
                  className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate"
                  title={transaction.narration}
                >
                  {transaction.narration}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 font-semibold">
                  {transaction.debit}
                </td>
                <td className="px-4 py-3 text-sm text-green-600 font-semibold">
                  {transaction.credit}
                </td>
                <td className="px-4 py-3 text-sm font-semibold text-red-600 whitespace-nowrap">
                  {transaction.balanceFormatted}
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
