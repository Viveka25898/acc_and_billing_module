// src/components/TransactionTable.jsx
import React from 'react'
import Badge from './Badge'

const TransactionTable = ({ transactions = [] }) => {
  const getRowClass = (rowClass) => {
    const baseClasses = 'hover:bg-gray-50 transition-colors'
    const specificClasses = {
      'opening-row': 'bg-amber-50/60',
      'expense-row': 'bg-red-50/30',
      'payment-row': 'bg-green-50/30',
    }

    return `${baseClasses} ${specificClasses[rowClass] || ''}`
  }

  const formatAmount = (amount, type = null) => {
    if (amount === null || amount === undefined) return '-'

    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)

    if (type === 'debit') {
      return <span className="text-red-600 font-semibold font-mono">{formatted}</span>
    } else if (type === 'credit') {
      return <span className="text-emerald-600 font-semibold font-mono">{formatted}</span>
    }

    return <span className="font-semibold font-mono">{formatted}</span>
  }

  const formatBalance = (balance, type) => {
    if (balance === null || balance === undefined) return '-'

    const formatted = new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(balance)

    if (type === 'zero') {
      return <span className="text-gray-600 font-bold font-mono">{formatted}</span>
    }

    return (
      <span className="text-emerald-700 font-bold font-mono">
        {formatted} {type === 'credit' ? 'CR' : 'DR'}
      </span>
    )
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="p-12 text-center bg-white">
        <div className="text-5xl mb-3">📊</div>
        <h3 className="text-base font-semibold text-gray-800">No Conveyance Payable Transactions Found</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          There are no ledger entries matching your active date or filter criteria.
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 overflow-x-auto">
      <div className="min-w-[1300px]">
        <table className="w-full border-collapse text-left text-xs sm:text-sm">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Date</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Voucher No</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Entry Type</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-right">Debit (₹)</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-right">Credit (₹)</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-right">Balance (₹)</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 min-w-[200px]">Narration</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Claim ID</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Visits</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Period</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Counterparty</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Approved By</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200 text-center">Attach</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Cost Center</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Customer</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Site</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">State</th>
              <th className="px-3 py-3 font-semibold text-gray-600 uppercase tracking-wider border-b-2 border-gray-200">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className={getRowClass(transaction.rowClass)}>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap font-medium">{transaction.date || '-'}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {transaction.voucherNo && transaction.voucherNo !== '-' ? (
                    transaction.voucherLink ? (
                      <a
                        href={transaction.voucherLink}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 font-semibold hover:text-emerald-700 underline focus:outline-none"
                      >
                        {transaction.voucherNo}
                      </a>
                    ) : (
                      <span className="text-emerald-600 font-semibold">{transaction.voucherNo}</span>
                    )
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <Badge type={transaction.entryType} />
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  {formatAmount(transaction.debit, 'debit')}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  {formatAmount(transaction.credit, 'credit')}
                </td>
                <td className="px-3 py-3 text-right whitespace-nowrap">
                  {formatBalance(transaction.balance, transaction.balanceType)}
                </td>
                <td className="px-3 py-3 text-gray-900 leading-relaxed">{transaction.narration || '-'}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  {transaction.claimId && transaction.claimId !== '-' ? (
                    <span className="text-emerald-600 font-medium">{transaction.claimId}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 text-gray-900 text-center whitespace-nowrap font-medium">
                  {transaction.visits !== undefined && transaction.visits !== null ? transaction.visits : '-'}
                </td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.period || '-'}</td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.counterparty || '-'}</td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.approvedBy || '-'}</td>
                <td className="px-3 py-3 text-center whitespace-nowrap">
                  {transaction.hasAttachment ? (
                    transaction.attachmentBundleUrl ? (
                      <a
                        href={transaction.attachmentBundleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-600 hover:text-emerald-700 text-base"
                        title="View attachment"
                      >
                        📎
                      </a>
                    ) : (
                      <span className="text-emerald-600 text-base" title="Has attachment">
                        📎
                      </span>
                    )
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.costCenter || '-'}</td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.customer || '-'}</td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.site || '-'}</td>
                <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{transaction.state || '-'}</td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <Badge type={transaction.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionTable