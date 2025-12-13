import React from 'react'

const EmployeePFTable = ({ summaryData, ledgerData }) => {
  const handleExport = (format) => {
    console.log(`Exporting data as ${format}`)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border-b border-gray-200">
        {summaryData.map((card) => (
          <div
            key={card.id}
            className={`bg-gray-50 p-4 rounded-lg ${
              card.type === 'paid'
                ? 'border-l-4 border-green-500'
                : card.type === 'unpaid'
                  ? 'border-l-4 border-red-500'
                  : 'border-l-4 border-blue-500'
            }`}
          >
            <h3 className="text-xs uppercase text-gray-600 font-medium mb-2">{card.title}</h3>
            <div
              className={`text-xl font-semibold ${
                card.type === 'paid'
                  ? 'text-green-600'
                  : card.type === 'unpaid'
                    ? 'text-red-600'
                    : 'text-blue-900'
              }`}
            >
              {card.value}
            </div>
            <div className="text-xs text-gray-500 mt-1">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Table Header */}
      <div className="p-5 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-blue-900">PF Payable Ledger Entries</h2>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport('pdf')}
            className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
          >
            Export PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            className="px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
          >
            Export Excel
          </button>
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-blue-900 text-white text-sm rounded hover:bg-blue-800"
          >
            Print
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Voucher No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Voucher Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Month</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Particulars</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Debit (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Credit (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Balance (₹)</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Due Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Payment Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Challan No.</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ledgerData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-900">{row.date}</td>
                <td className="px-4 py-3 text-sm font-medium text-blue-600">{row.voucherNo}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.voucherType}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.month}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.particulars}</td>
                <td className="px-4 py-3 text-sm font-medium text-red-600">{row.debit}</td>
                <td className="px-4 py-3 text-sm font-medium text-green-600">{row.credit}</td>
                <td className="px-4 py-3 text-sm font-medium text-blue-900">{row.balance}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.dueDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.paymentDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{row.challanNo}</td>
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
          ₹60,400.00
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 bg-blue-900 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

export default EmployeePFTable
