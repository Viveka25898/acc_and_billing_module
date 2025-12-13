import React from 'react'
import { ledgerData } from '../data/lwfLedgerData'

const LedgerTable = () => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="status-badge status-paid">Paid</span>
      case 'pending':
        return <span className="status-badge status-pending">Pending</span>
      case 'overdue':
        return <span className="status-badge status-overdue">Overdue</span>
      default:
        return status
    }
  }

  return (
    <div className="p-6 md:p-8 overflow-x-auto">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                {[
                  'Date',
                  'Voucher No.',
                  'Type',
                  'State',
                  'Particulars / Narration',
                  'Emp Count',
                  'Debit (₹)\nPayment',
                  'Credit (₹)\nAccrual',
                  'Balance (₹)',
                  'Bal Type',
                  'Status',
                  'Due Date',
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className="px-4 py-4 text-xs font-bold uppercase tracking-wider text-center border-r border-gray-700 last:border-r-0 whitespace-nowrap"
                  >
                    {header.split('\n').map((line, i) => (
                      <React.Fragment key={i}>
                        {line}
                        {i < header.split('\n').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ledgerData.map((row, index) => {
                if (row.isHeader) {
                  return (
                    <tr key={index} className="bg-gradient-to-r from-yellow-50 to-orange-50">
                      <td
                        colSpan={12}
                        className="px-4 py-3 font-bold text-amber-800 text-left border-t-2 border-b-2 border-amber-400"
                      >
                        📅 {row.month}
                      </td>
                    </tr>
                  )
                }

                if (row.isAging) {
                  return (
                    <tr
                      key={index}
                      className="bg-gradient-to-r from-red-50 to-pink-100 hover:from-red-100 hover:to-pink-200"
                    >
                      <td colSpan={6} className="px-4 py-3 font-semibold text-red-700 text-left">
                        {row.category}
                      </td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3">-</td>
                      <td className="px-4 py-3 font-bold text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50">
                        {row.balance}
                      </td>
                      <td className="px-4 py-3">{row.balType}</td>
                      <td className="px-4 py-3">{getStatusBadge('pending')}</td>
                      <td className="px-4 py-3">{row.dueDate}</td>
                    </tr>
                  )
                }

                if (row.isTotal) {
                  return (
                    <tr
                      key={index}
                      className="bg-gradient-to-r from-blue-50 to-cyan-100 border-t-4 border-blue-500"
                    >
                      <td colSpan={6} className="px-4 py-4 font-bold text-blue-900 text-right">
                        {row.label}
                      </td>
                      <td className="px-4 py-4 font-bold text-green-700">{row.debit}</td>
                      <td className="px-4 py-4 font-bold text-red-700">{row.credit}</td>
                      <td className="px-4 py-4 font-bold text-blue-700">{row.balance}</td>
                      <td className="px-4 py-4 font-bold">{row.balType}</td>
                      <td colSpan={2} className="px-4 py-4 font-bold text-blue-900">
                        {row.status}
                      </td>
                    </tr>
                  )
                }

                return (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 even:bg-gray-50 transition-all duration-200 hover:scale-[1.002] hover:shadow-md"
                  >
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                      {row.voucherNo}
                    </td>
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">{row.type}</td>
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">{row.state}</td>
                    <td className="px-4 py-3 text-left text-sm max-w-xs">
                      <div>{row.particulars}</div>
                      {row.details && (
                        <div className="text-xs text-gray-500 mt-1">{row.details}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{row.empCount}</td>
                    <td
                      className={`px-4 py-3 text-center text-sm font-bold ${row.debit !== '-' ? 'text-green-700' : ''}`}
                    >
                      {row.debit}
                    </td>
                    <td
                      className={`px-4 py-3 text-center text-sm font-bold ${row.credit !== '-' ? 'text-red-700' : ''}`}
                    >
                      {row.credit}
                    </td>
                    <td className="px-4 py-3 text-center text-sm font-bold text-blue-700 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
                      {row.balance}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{row.balType}</td>
                    <td className="px-4 py-3 text-center text-sm">{getStatusBadge(row.status)}</td>
                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                      {row.dueDate}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LedgerTable
