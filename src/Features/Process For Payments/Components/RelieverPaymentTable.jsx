import React, { useState } from 'react'

const RelieverPaymentTable = ({ data, onApprove }) => {
  const [selectedRows, setSelectedRows] = useState({})

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const all = {}
      data.forEach((r) => (all[r.id || r.requestId] = true))
      setSelectedRows(all)
    } else {
      setSelectedRows({})
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleApprove = () => {
    const selected = data.filter((r) => selectedRows[r.id || r.requestId])
    if (selected.length > 0) {
      onApprove(selected)
      setSelectedRows({})
    }
  }

  const selectedCount = Object.values(selectedRows).filter(Boolean).length

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-4xl mb-3">👔</div>
        <p className="text-sm font-semibold text-gray-600">No pending reliever payment requests</p>
        <p className="text-xs text-gray-400 mt-1">
          Pending reliever requests will appear here once approved by managers.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-xs sm:text-sm text-left whitespace-nowrap min-w-[850px]">
          <thead className="bg-blue-50 text-gray-600 font-semibold border-b border-blue-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-3 text-center w-12">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedCount === data.length && data.length > 0}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                />
              </th>
              <th className="px-3 py-3">Reliever Name</th>
              <th className="px-3 py-3">Employee ID</th>
              <th className="px-3 py-3">Site</th>
              <th className="px-3 py-3 text-center">Document</th>
              <th className="px-3 py-3">Bank Account</th>
              <th className="px-3 py-3">IFSC Code</th>
              <th className="px-3 py-3 text-right pr-6">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, idx) => {
              const rowId = row.id || row.requestId || `rel-${idx}`
              const nameDisplay = row['Reliever Name'] || row.relieverName || '-'
              const empIdDisplay = row['Employee ID'] || row.employeeId || '-'
              const siteDisplay = row.Site || row.site || '-'
              const docUrl = row.documentUrl

              return (
                <tr key={rowId} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-3 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={!!selectedRows[rowId]}
                      onChange={() => handleSelectRow(rowId)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer accent-blue-600"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-semibold text-gray-800">{nameDisplay}</span>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500 font-mono">{empIdDisplay}</td>
                  <td className="px-3 py-3 text-xs text-gray-600">{siteDisplay}</td>
                  <td className="px-3 py-3 text-center">
                    {docUrl ? (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-800 hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                        title="View Document Attachment"
                      >
                        📎 View File
                      </a>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs font-mono text-gray-600">
                    {row['Account No'] || 'N/A'}
                  </td>
                  <td className="px-3 py-3 text-xs font-mono text-gray-500 uppercase">
                    {row['IFSC Code'] || 'N/A'}
                  </td>
                  <td className="px-3 py-3 text-right pr-6 font-semibold text-gray-800">
                    ₹{(parseFloat(row.Amount || row.amount) || 0).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <span className="text-xs text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
          {selectedCount} item(s) selected
        </span>
        <button
          onClick={handleApprove}
          disabled={selectedCount === 0}
          className={`text-xs sm:text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-sm ${
            selectedCount > 0
              ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Approve Selected ({selectedCount})
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export default RelieverPaymentTable
