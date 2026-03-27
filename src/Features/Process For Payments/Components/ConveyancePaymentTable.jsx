import React, { useState } from 'react'

const ConveyancePaymentTable = ({ data, onApprove }) => {
  const [selectedRows, setSelectedRows] = useState({})

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const all = {}
      data.forEach((r) => (all[r.id] = true))
      setSelectedRows(all)
    } else {
      setSelectedRows({})
    }
  }

  const handleSelectRow = (id) => {
    setSelectedRows((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleApprove = () => {
    const selected = data.filter((r) => selectedRows[r.id])
    if (selected.length > 0) {
      onApprove(selected)
      setSelectedRows({})
    }
  }

  const selectedCount = Object.values(selectedRows).filter(Boolean).length

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-3">🛵</div>
        <p className="text-sm font-semibold text-gray-600">No pending conveyance payments</p>
        <p className="text-xs text-gray-400 mt-1">Conveyance requests marked as 'Pending Payment' will appear here.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-sm text-left whitespace-nowrap min-w-[700px]">
          <thead className="bg-purple-50 text-gray-600 font-semibold border-b border-purple-100 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-center w-12">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedCount === data.length && data.length > 0}
                  className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-600"
                />
              </th>
              <th className="px-4 py-3 border-l border-purple-100/50">Employee</th>
              <th className="px-4 py-3 border-l border-purple-100/50">Request Date</th>
              <th className="px-4 py-3 border-l border-purple-100/50">Client</th>
              <th className="px-4 py-3 border-l border-purple-100/50">Purpose</th>
              <th className="px-4 py-3 border-l border-purple-100/50 text-right pr-6">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row) => (
              <tr key={row.id} className="hover:bg-purple-50/50 transition-colors">
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={!!selectedRows[row.id]}
                    onChange={() => handleSelectRow(row.id)}
                    className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer accent-purple-600"
                  />
                </td>
                <td className="px-4 py-3 border-l border-gray-50">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">{row['Employee Name']}</span>
                    <span className="text-[10px] text-gray-400 font-mono">{row['Employee ID']}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-gray-500 border-l border-gray-50">
                  {new Date(row.requestDate).toLocaleDateString('en-GB')}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 border-l border-gray-50">
                  <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">
                    {row.Client}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 truncate max-w-[200px] border-l border-gray-50" title={row.Purpose}>
                  {row.Purpose}
                </td>
                <td className="px-4 py-3 text-right pr-6 font-bold text-gray-800 border-l border-gray-50">
                  {Number(row.Amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <span className="text-xs text-purple-700 font-medium bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
          {selectedCount} item(s) selected
        </span>
        <button
          onClick={handleApprove}
          disabled={selectedCount === 0}
          className={`text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm ${
            selectedCount > 0
              ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-md active:scale-[0.98]'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Approve Selected
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  )
}

export default ConveyancePaymentTable
