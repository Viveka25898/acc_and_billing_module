// Rent on Machinery Transaction Table Component
import React from 'react'
import Badge from '../../Components/Badge'
import { FileText, MapPin, Settings } from 'lucide-react'

const MachineryRentTransactionTable = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No transactions found.</p>
        <p className="text-sm mt-2">Machinery rental billing transactions will appear here.</p>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full min-w-[2400px]">
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-24">
              Date
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Voucher No
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">
              Entry Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Debit (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Credit (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Balance (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-96">
              Narration
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-40">
              Client
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-48">
              Equipment Type
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">
              Equipment Code
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Rental Period
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">
              Rate/Day (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              GST (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">
              Site Location
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Approved By
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index} className="hover:bg-slate-50 border-b border-slate-100">
              <td className="px-3 py-4 text-sm">{txn.date}</td>
              <td className="px-3 py-4 text-sm">
                <span className="text-orange-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
                  {txn.voucherNo}
                  {txn.attachments > 0 && <FileText size={14} className="text-gray-400" />}
                </span>
              </td>
              <td className="px-3 py-4 text-sm">
                <Badge type={txn.entryType.toLowerCase()}>{txn.entryType}</Badge>
              </td>
              <td
                className={`px-3 py-4 text-sm font-semibold font-mono text-right ${
                  txn.debit !== 0 ? 'text-red-600' : 'text-gray-400'
                }`}
              >
                {txn.debit !== 0
                  ? txn.debit.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                  : '-'}
              </td>
              <td
                className={`px-3 py-4 text-sm font-semibold font-mono text-right ${
                  txn.credit !== 0 ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {txn.credit !== 0
                  ? txn.credit.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                  : '-'}
              </td>
              <td className="px-3 py-4 text-sm font-bold font-mono text-right text-orange-800">
                {txn.balance}
              </td>
              <td className="px-3 py-4 text-sm text-gray-700 leading-relaxed">{txn.narration}</td>
              <td className="px-3 py-4 text-sm">
                <Badge type="client">{txn.counterparty}</Badge>
              </td>
              <td className="px-3 py-4 text-sm font-medium text-gray-900">
                <div className="flex items-center gap-1">
                  <Settings size={14} className="text-gray-400" />
                  {txn.productName}
                </div>
              </td>
              <td className="px-3 py-4 text-sm">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-mono">
                  {txn.equipmentCode}
                </span>
              </td>
              <td className="px-3 py-4 text-sm text-xs">{txn.rentalPeriod}</td>
              <td className="px-3 py-4 text-sm font-mono text-right">{txn.rate}</td>
              <td className="px-3 py-4 text-sm font-mono text-right text-purple-600">
                {txn.gstAmount}
              </td>
              <td className="px-3 py-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-gray-400" />
                  {txn.siteLocation}
                </div>
              </td>
              <td className="px-3 py-4 text-sm">{txn.approvedBy}</td>
              <td className="px-3 py-4 text-sm">
                <Badge type={txn.status.toLowerCase()}>{txn.status}</Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MachineryRentTransactionTable
