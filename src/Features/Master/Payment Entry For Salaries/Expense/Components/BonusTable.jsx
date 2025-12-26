import React from 'react'

const BonusTable = ({ ledgerData }) => {
  // Format currency
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return '-'
    return `₹${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-600 to-green-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Sr No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Voucher Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Voucher No
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Cost Center
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Counterparty Ledger
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Approved By
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider max-w-xs">
                Narration
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                Debit (₹)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                Credit (₹)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-white uppercase tracking-wider">
                Running Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerData && ledgerData.length > 0 ? (
              ledgerData.map((entry, index) => (
                <tr key={index} className="hover:bg-green-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-900">{index + 1}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.voucherType}</td>
                  <td className="px-4 py-3 text-sm font-medium text-green-600">
                    {entry.voucherNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.costCenter}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.department}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.counterpartyLedger}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.approvedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{entry.paymentMethod}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                    {entry.narration}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-red-600">
                    {formatCurrency(entry.debit)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-medium text-green-600">
                    {formatCurrency(entry.credit)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-gray-900">
                    {formatCurrency(entry.runningBalance)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="13" className="px-4 py-8 text-center text-gray-500">
                  No ledger entries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default BonusTable
