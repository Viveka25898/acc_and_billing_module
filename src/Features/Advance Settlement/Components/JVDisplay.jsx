import React from 'react'

export default function EmployeeAdvanceSettlementJV({ data = {}, onClose }) {
  // Use the actual data passed from accounting processing
  const header = data.header || {
    company: 'Ismart',
    voucherNo: 'JV-0000',
    financialYear:
      new Date().getFullYear() + '-' + (new Date().getFullYear() + 1).toString().slice(-2),
    date: new Date().toISOString().split('T')[0],
    reference: 'N/A',
    preparedBy: 'System',
  }

  const lines = data.entries || []
  const narration = data.narration || 'No narration provided'
  const approvals = data.approvals || {
    preparer: 'System',
    reviewer: 'Pending',
    approver: 'Pending',
    date: new Date().toISOString().split('T')[0],
  }

  // Calculate totals if not provided
  const totals = data.totals || {
    debit: lines.reduce((sum, line) => sum + (line.debit || 0), 0),
    credit: lines.reduce((sum, line) => sum + (line.credit || 0), 0),
  }

  // Get employee details for display
  const employeeInfo = data.employeeInfo || {}

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
              <p className="font-medium">{header.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Voucher No.</p>
              <p className="font-medium">{header.voucherNo}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{header.date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Financial Year</p>
              <p className="font-medium">{header.financialYear}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee</p>
              <p className="font-medium">{employeeInfo.employeeName || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Employee ID</p>
              <p className="font-medium">{employeeInfo.employeeId || 'N/A'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Reference</p>
              <p className="font-medium">{header.reference}</p>
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
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-sm">{line.particulars || 'N/A'}</td>
                    <td className="px-4 py-2 border text-sm font-mono">
                      {line.glCode || line.gl || 'N/A'}
                    </td>
                    <td className="px-4 py-2 border text-right text-sm">
                      {line.debit ? `₹${line.debit.toLocaleString('en-IN')}` : '-'}
                    </td>
                    <td className="px-4 py-2 border text-right text-sm">
                      {line.credit ? `₹${line.credit.toLocaleString('en-IN')}` : '-'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-medium">
                  <td colSpan={2} className="px-4 py-2 border text-right text-sm">
                    Total
                  </td>
                  <td className="px-4 py-2 border text-right text-sm">
                    ₹{totals.debit.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 py-2 border text-right text-sm">
                    ₹{totals.credit.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Balance Information */}
          {data.balanceInfo && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-800 mb-2">Balance Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-blue-600">O/S Balance Before</p>
                  <p className="font-medium">
                    ₹{(data.balanceInfo.osBalanceBefore || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-blue-600">Settlement Amount</p>
                  <p className="font-medium">
                    ₹{(data.balanceInfo.settlementAmount || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <div>
                  <p className="text-blue-600">O/S Balance After</p>
                  <p className="font-medium">
                    ₹{(data.balanceInfo.osBalanceAfter || 0).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Narration */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-1">Narration:</p>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">{narration}</p>
          </div>

          {/* Approvals */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Preparer</p>
              <p className="font-medium">{approvals.preparer}</p>
            </div>
            <div>
              <p className="text-gray-500">Reviewer</p>
              <p className="font-medium">{approvals.reviewer}</p>
            </div>
            <div>
              <p className="text-gray-500">Approver</p>
              <p className="font-medium">{approvals.approver}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
