import React from 'react'

const LedgerTable = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              {[
                'Sr No',
                'Date',
                'Voucher Type',
                'Voucher No',

                'Cost Center',
                'Department',
                'Counterparty Ledger',
                'Approved By',
                'Payment Mode',
                'Narration',
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
                className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-gray-100'}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.date}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.voucherType}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {transaction.voucherNo}
                </td>
                {/* <td className="px-4 py-3 text-sm text-gray-900">{transaction.employeeId}</td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                  {transaction.employeeName}
                </td> */}
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.costCenter}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.department}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {transaction.counterpartyLedger}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.approvedBy}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.paymentMode}</td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {transaction.narration}
                </td>
                <td className="px-4 py-3 text-sm text-red-600 font-medium">{transaction.debit}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{transaction.credit}</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">
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

export default LedgerTable
