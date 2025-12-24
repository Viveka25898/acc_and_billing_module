import React from 'react'

const EmployeeLWFTable = ({ summaryData, ledgerData }) => {
  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`)
  }

  const handlePrint = () => {
    window.print()
  }

  const formatCurrency = (value) => {
    return value === '-' || value === '' ? value : `₹ ${value}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border-t-4 border-green-600">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border-b border-green-200">
        {summaryData.map((card) => (
          <div
            key={card.id}
            className={`bg-gradient-to-br p-4 rounded-lg ${
              card.type === 'paid'
                ? 'from-green-50 to-green-100 border-l-4 border-green-600'
                : card.type === 'unpaid'
                  ? 'from-red-50 to-red-100 border-l-4 border-red-600'
                  : 'from-green-50 to-white border-l-4 border-green-500'
            }`}
          >
            <h3 className="text-xs uppercase text-gray-600 font-medium mb-2">{card.title}</h3>
            <div
              className={`text-xl font-semibold ${
                card.type === 'paid'
                  ? 'text-green-700'
                  : card.type === 'unpaid'
                    ? 'text-red-700'
                    : 'text-green-800'
              }`}
            >
              {card.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table Header */}
      <div className="p-5 border-b border-green-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            LWF Payable Ledger Entries
          </h2>
          <p className="text-sm text-gray-600 mt-1">{ledgerData.length} transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 shadow-md"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 shadow-md"
          >
            Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-green-700 text-white text-sm rounded hover:bg-green-800 shadow-md"
          >
            Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-green-700 to-green-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Voucher No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Voucher Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Period
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                State
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Particulars
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Debit (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Credit (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Balance (₹)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Due Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Payment Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Receipt No.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerData.map((row, index) => (
              <tr
                key={row.id}
                className={`hover:bg-green-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">{row.voucherNo}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.voucherType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.period}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.state}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.particulars}</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">
                  {formatCurrency(row.debit)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">
                  {formatCurrency(row.credit)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-purple-700">
                  {formatCurrency(row.balance)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.dueDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.paymentDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.receiptNo}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      row.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {row.status === 'paid' ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          Showing 1 to {ledgerData.length} of {ledgerData.length} entries | Current Liability:
          ₹23,100.00
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-purple-700 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            4
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeLWFTable
