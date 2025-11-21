import React from 'react'
import { FiPaperclip } from 'react-icons/fi'
import { CounterpartyBadge } from './CounterPartyBadge'
import { EntryTypeBadge } from './EntryTypeBadge'

const LedgerTable = ({ entries }) => {
  const formatAmount = (amount) => {
    if (!amount) return '-'
    return amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <div className="px-8 py-6 overflow-x-auto">
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
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
              <td className="px-3 py-3 text-[13px] text-gray-900 whitespace-nowrap align-top">
                {entry.date}
              </td>
              <td className="px-3 py-3 text-[13px] whitespace-nowrap align-top">
                <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
                  {entry.voucherNo}
                </span>
              </td>
              <td className="px-3 py-3 whitespace-nowrap align-top">
                <EntryTypeBadge type={entry.entryType} />
              </td>
              <td className="px-3 py-3 text-[13px] text-right font-semibold font-mono whitespace-nowrap align-top">
                {entry.debit ? (
                  <span className="text-red-600">{formatAmount(entry.debit)}</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-3 text-[13px] text-right font-semibold font-mono whitespace-nowrap align-top">
                {entry.credit ? (
                  <span className="text-green-600">{formatAmount(entry.credit)}</span>
                ) : (
                  '-'
                )}
              </td>
              <td className="px-3 py-3 text-[13px] text-right font-bold font-mono whitespace-nowrap align-top">
                <span className={entry.balanceType === 'DR' ? 'text-red-600' : 'text-green-600'}>
                  {formatAmount(entry.balance)} {entry.balanceType}
                </span>
              </td>
              <td className="px-3 py-3 text-[13px] text-gray-700 align-top">
                <div className="max-w-[300px] leading-5">{entry.narration}</div>
              </td>
              <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                {entry.refNo}
              </td>
              <td className="px-3 py-3 text-[13px] text-gray-700 align-top">
                <div className="max-w-[180px]">
                  {entry.counterparty}
                  <div>
                    <CounterpartyBadge type={entry.counterpartyType} />
                  </div>
                </div>
              </td>
              <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                {entry.type}
              </td>
              <td className="px-3 py-3 text-[13px] text-gray-700 whitespace-nowrap align-top">
                {entry.approvedBy}
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
                {entry.costCenter}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default LedgerTable
