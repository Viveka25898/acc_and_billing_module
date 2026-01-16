// HK Material Transaction Table Component
import React from 'react'
import Badge from '../../Components/Badge'
import { FileText, MapPin, Package } from 'lucide-react'

const HKMaterialTransactionTable = ({ transactions = [] }) => {
  if (transactions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No transactions found.</p>
        <p className="text-sm mt-2">HK Material billing transactions will appear here.</p>
      </div>
    )
  }

  return (
    <div className="p-6 overflow-x-auto">
      <table className="w-full min-w-[2300px]">
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
              Product Name
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Items Included
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-28">
              Service Charge
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              Quantity
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-32">
              GST (₹)
            </th>
            <th className="px-3 py-3 text-left text-xs font-semibold text-slate-600 uppercase border-b-2 border-slate-200 w-36">
              Site Location
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
                <span className="text-purple-600 font-semibold cursor-pointer hover:underline flex items-center gap-1">
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
              <td className="px-3 py-4 text-sm font-bold font-mono text-right text-purple-800">
                {txn.balance}
              </td>
              <td className="px-3 py-4 text-sm text-gray-700 leading-relaxed">{txn.narration}</td>
              <td className="px-3 py-4 text-sm">
                <Badge type="client">{txn.counterparty}</Badge>
              </td>
              <td className="px-3 py-4 text-sm font-medium text-gray-900">{txn.productName}</td>
              <td className="px-3 py-4 text-sm">
                <div className="flex items-center gap-1">
                  <Package size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-600">{txn.itemsIncluded}</span>
                </div>
              </td>
              <td className="px-3 py-4 text-sm text-center">
                {txn.serviceCharge && (
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded text-xs font-medium">
                    {txn.serviceCharge}
                  </span>
                )}
              </td>
              <td className="px-3 py-4 text-sm">{txn.quantity}</td>
              <td className="px-3 py-4 text-sm font-mono text-right text-purple-600">
                {txn.gstAmount}
              </td>
              <td className="px-3 py-4 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-gray-400" />
                  {txn.siteLocation}
                </div>
              </td>
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

export default HKMaterialTransactionTable
