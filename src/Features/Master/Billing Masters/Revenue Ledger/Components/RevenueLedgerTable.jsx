// Revenue Ledger Transaction Table Component
import React from 'react'
import { FileText, Download, Eye, CheckCircle } from 'lucide-react'

const RevenueLedgerTable = ({ transactions }) => {
  const getEntryTypeStyle = (type) => {
    switch (type) {
      case 'Sales Invoice':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'Credit Note':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'Debit Note':
        return 'bg-orange-100 text-orange-800 border-orange-300'
      case 'Journal Entry':
        return 'bg-purple-100 text-purple-800 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const handleViewAttachment = (attachment) => {
    alert(`Viewing attachment: ${attachment}`)
  }

  const handleDownloadAttachment = (attachment) => {
    alert(`Downloading attachment: ${attachment}`)
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop View */}
      <div className="hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b-2 border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Voucher
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Entry Type
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Credit (₹)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Debit (₹)
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Balance (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Narration
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Ref No / Invoice
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Counterparty
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Approved By
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Attachments
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Cost Center
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Site
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                State
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                  {transaction.date}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-blue-600 whitespace-nowrap">
                  {transaction.voucher}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getEntryTypeStyle(transaction.entryType)}`}
                  >
                    {transaction.entryType}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-green-600 whitespace-nowrap">
                  {transaction.credit}
                </td>
                <td className="px-4 py-3 text-sm text-right font-semibold text-red-600 whitespace-nowrap">
                  {transaction.debit}
                </td>
                <td className="px-4 py-3 text-sm text-right font-bold text-gray-900 whitespace-nowrap">
                  {transaction.balance}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">
                  {transaction.narration}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.refNo}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.counterparty}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.type}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-600" />
                    {transaction.approvedBy}
                  </div>
                </td>
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  {transaction.attachments && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleViewAttachment(transaction.attachments)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Attachment"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDownloadAttachment(transaction.attachments)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Download Attachment"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.costCenter}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.customer || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.site || '-'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                  {transaction.state || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet View */}
      <div className="lg:hidden space-y-4 p-4">
        {transactions.map((transaction) => (
          <div
            key={transaction.id}
            className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-sm font-medium text-blue-600">{transaction.voucher}</div>
                <div className="text-xs text-gray-500 mt-1">{transaction.date}</div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full border ${getEntryTypeStyle(transaction.entryType)}`}
              >
                {transaction.entryType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <div className="text-xs text-gray-500">Credit</div>
                <div className="text-sm font-semibold text-green-600">{transaction.credit}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Debit</div>
                <div className="text-sm font-semibold text-red-600">{transaction.debit}</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-500">Balance</div>
              <div className="text-sm font-bold text-gray-900">{transaction.balance}</div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-gray-500">Narration</div>
              <div className="text-sm text-gray-700">{transaction.narration}</div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div>
                <span className="text-gray-500">Ref: </span>
                <span className="text-gray-700">{transaction.refNo}</span>
              </div>
              <div>
                <span className="text-gray-500">Type: </span>
                <span className="text-gray-700">{transaction.type}</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-500">Counterparty: </span>
                <span className="text-gray-700">{transaction.counterparty}</span>
              </div>
              <div>
                <span className="text-gray-500">Cost Center: </span>
                <span className="text-gray-700">{transaction.costCenter}</span>
              </div>
              <div>
                <span className="text-gray-500">Customer: </span>
                <span className="text-gray-700">{transaction.customer || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Site: </span>
                <span className="text-gray-700">{transaction.site || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">State: </span>
                <span className="text-gray-700">{transaction.state || '-'}</span>
              </div>
              <div>
                <span className="text-gray-500">Approved: </span>
                <span className="text-gray-700">{transaction.approvedBy}</span>
              </div>
            </div>

            {transaction.attachments && (
              <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-600">{transaction.attachments}</span>
                <button
                  onClick={() => handleViewAttachment(transaction.attachments)}
                  className="ml-auto p-1 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDownloadAttachment(transaction.attachments)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RevenueLedgerTable
