import React from 'react'
import { FiPaperclip } from 'react-icons/fi'
import { CounterpartyBadge } from './CounterPartyBadge'
import { EntryTypeBadge } from './EntryTypeBadge'

const LedgerTable = ({ entries = [] }) => {
  const formatDate = (dateString) => {
    try {
      if (!dateString || dateString === '-') return '-'
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      })
    } catch {
      return dateString;
    }
  }

  const formatAmount = (amount) => {
    if (amount === undefined || amount === null || amount === 'N/A' || amount === '-') return '-'
    const num = typeof amount === 'string' ? parseFloat(amount) : amount
    if (isNaN(num)) return '-'
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  const hasNonEmptyValue = (val) => {
    return val !== undefined && val !== null && String(val).trim() !== '' && String(val).trim() !== '-'
  }

  return (
    <div className="px-8 py-6 overflow-x-auto bg-white">
      <table className="w-full border-collapse" style={{ minWidth: '1800px' }}>
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Date
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Voucher No
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Entry Type
            </th>
            <th className="px-3 py-3 text-right text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Debit (₹)
            </th>
            <th className="px-3 py-3 text-right text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Credit (₹)
            </th>
            <th className="px-3 py-3 text-right text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Balance (₹)
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Narration
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Ref No
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Counterparty
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Type
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Approved By
            </th>
            <th className="px-3 py-3 text-center text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Attachments
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Cost Center
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Customer
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              Site
            </th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-gray-600 uppercase whitespace-nowrap border-b-2 border-gray-200">
              State
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry, index) => {
            const entryTypeLower = String(entry.entryType || '').toLowerCase()
            const balanceType = entry.balanceType || 'DR'
            const isPayment = entryTypeLower === 'payment'
            const isReceipt = entryTypeLower === 'receipt'
            const isOpening = entryTypeLower === 'opening' || entry.id === 'opening-balance-sys' || entry.voucherNo === 'OB-2024'
            
            // Map counterparty badges
            let counterpartyType = entry.counterpartyType || 'other'
            const counterpartyLower = String(entry.counterparty || '').toLowerCase()
            if (counterpartyLower.includes('bank') || counterpartyLower.includes('cash')) {
              counterpartyType = 'bank'
            } else if (counterpartyLower.includes('travel') || counterpartyLower.includes('food') || counterpartyLower.includes('salary')) {
              counterpartyType = 'expense'
            } else if (counterpartyLower.includes('emp')) {
              counterpartyType = 'employee'
            }

            return (
              <tr key={entry.id || index} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <td className="px-3 py-3 text-[13px] text-gray-900 whitespace-nowrap align-top">
                  {formatDate(entry.date)}
                </td>
                <td className="px-3 py-3 text-[13px] whitespace-nowrap align-top">
                  <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                    {entry.voucherNo || '-'}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap align-top">
                  <EntryTypeBadge type={isOpening ? 'opening' : entryTypeLower} />
                </td>
                <td className="px-3 py-3 text-[13px] text-right font-semibold font-mono whitespace-nowrap align-top">
                  {hasNonEmptyValue(entry.debit) ? (
                    <span className="text-red-600">{formatAmount(entry.debit)}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 text-[13px] text-right font-semibold font-mono whitespace-nowrap align-top">
                  {hasNonEmptyValue(entry.credit) ? (
                    <span className="text-green-600">{formatAmount(entry.credit)}</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 text-[13px] text-right font-bold font-mono whitespace-nowrap align-top">
                  <span className={balanceType === 'DR' ? 'text-red-600' : 'text-green-600'}>
                    {formatAmount(entry.balance)} {balanceType}
                  </span>
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 align-top">
                  <div className="max-w-[300px] leading-5">{entry.narration || '-'}</div>
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {entry.refNo || '-'}
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 align-top">
                  <div className="max-w-[180px]">
                    {entry.counterparty || '-'}
                    <div>
                      <CounterpartyBadge type={counterpartyType} />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {isOpening ? 'Opening' : (isPayment ? 'Payment' : 'Receipt')}
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {entry.approvedBy || '-'}
                </td>
                <td className="px-3 py-3 text-center whitespace-nowrap align-top">
                  {entry.attachments > 0 ? (
                    <button className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center gap-1 mx-auto">
                      <FiPaperclip size={16} />
                      {entry.attachments}
                    </button>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {entry.costCenter || '-'}
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {entry.customer || '-'}
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {entry.site || '-'}
                </td>
                <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                  {entry.state || '-'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default LedgerTable
