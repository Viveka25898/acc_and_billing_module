import React from 'react'

export default function EmployeeAdvanceSettlementJV({ data = {}, onClose }) {
  // Extract header with strict fallbacks to '-'
  const header = data.header || {}
  const company = header.company || '-'
  const voucherNo = header.voucherNo || '-'
  const date = header.date || '-'
  const financialYear = header.financialYear || '-'
  const reference = header.reference || '-'

  const lines = data.entries || []
  const narration = data.narration || '-'
  
  const approvals = data.approvals || {}
  const preparer = approvals.preparer || '-'
  const reviewer = approvals.reviewer || '-'
  const approver = approvals.approver || '-'

  // Calculate totals strictly from line items
  const totals = data.totals || {
    debit: lines.reduce((sum, line) => sum + (Number(line.debit) || 0), 0),
    credit: lines.reduce((sum, line) => sum + (Number(line.credit) || 0), 0),
  }

  const employeeInfo = data.employeeInfo || {}
  const employeeName = employeeInfo.employeeName || '-'
  const employeeId = employeeInfo.employeeId || '-'

  const balanceInfo = data.balanceInfo || {}

  const formatCurrency = (val) => {
    if (val === null || val === undefined || isNaN(Number(val))) return '-'
    return `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 0 })}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-5xl w-full bg-white rounded-lg shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header with Close Button */}
        <div className="sticky top-0 bg-green-600 text-white p-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Journal Voucher - Advance Settlement</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-indigo-200 text-2xl"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Company</p>
              <p className="font-medium text-gray-800">{company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Voucher No.</p>
              <p className="font-medium text-gray-800">{voucherNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium text-gray-800">{date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Financial Year</p>
              <p className="font-medium text-gray-800">{financialYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee</p>
              <p className="font-medium text-gray-800">{employeeName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium text-gray-800">{employeeId}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="font-medium text-gray-800">{reference}</p>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="overflow-x-auto mb-6">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 border">
                    Particulars
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 border">
                    GL Code
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border">
                    Debit (₹)
                  </th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 border">
                    Credit (₹)
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.length === 0 ? (
                  <tr>
                    <td className="px-4 py-3 border text-center text-gray-400 text-sm font-medium">-</td>
                    <td className="px-4 py-3 border text-center text-gray-400 text-sm font-medium">-</td>
                    <td className="px-4 py-3 border text-center text-gray-400 text-sm font-medium">-</td>
                    <td className="px-4 py-3 border text-center text-gray-400 text-sm font-medium">-</td>
                  </tr>
                ) : (
                  lines.map((line, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border text-sm text-gray-800">{line.particulars || '-'}</td>
                      <td className="px-4 py-2 border text-sm font-mono text-gray-700">
                        {line.glCode || line.gl || '-'}
                      </td>
                      <td className="px-4 py-2 border text-right text-sm text-gray-800">
                        {line.debit ? `₹${Number(line.debit).toLocaleString('en-IN')}` : '-'}
                      </td>
                      <td className="px-4 py-2 border text-right text-sm text-gray-800">
                        {line.credit ? `₹${Number(line.credit).toLocaleString('en-IN')}` : '-'}
                      </td>
                    </tr>
                  ))
                )}
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={2} className="px-4 py-2 border text-right text-sm text-gray-800">
                    Total
                  </td>
                  <td className="px-4 py-2 border text-right text-sm text-gray-800">
                    {lines.length > 0 ? `₹${totals.debit.toLocaleString('en-IN')}` : '-'}
                  </td>
                  <td className="px-4 py-2 border text-right text-sm text-gray-800">
                    {lines.length > 0 ? `₹${totals.credit.toLocaleString('en-IN')}` : '-'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Balance Information */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Balance Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-blue-600">O/S Balance Before</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(balanceInfo.osBalanceBefore)}
                </p>
              </div>
              <div>
                <p className="text-blue-600">Settlement Amount</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(balanceInfo.settlementAmount)}
                </p>
              </div>
              <div>
                <p className="text-blue-600">O/S Balance After</p>
                <p className="font-medium text-gray-800">
                  {formatCurrency(balanceInfo.osBalanceAfter)}
                </p>
              </div>
            </div>
          </div>

          {/* Narration */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Narration:</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{narration}</p>
          </div>

          {/* Approvals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Preparer</p>
              <p className="font-medium text-gray-800">{preparer}</p>
            </div>
            <div>
              <p className="text-gray-500">Reviewer</p>
              <p className="font-medium text-gray-800">{reviewer}</p>
            </div>
            <div>
              <p className="text-gray-500">Approver</p>
              <p className="font-medium text-gray-800">{approver}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
