// TDS Receivable Ledger Table — 26AS Status column removed
const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '—'
  return `₹${Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

const TDSReceivableLedgerTable = ({ entries }) => {
  if (!entries || entries.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="text-gray-300 mb-3">
          <svg className="w-14 h-14 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm font-medium">No TDS Receivable entries found.</p>
        <p className="text-gray-400 text-xs mt-1">TDS entries will appear here when clients deduct TDS before payment.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-green-50 border-b border-green-200">
          <tr>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">#</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Date</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Particulars</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Client Name</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Client TAN</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Client PAN</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Section</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Voucher No.</th>
            <th className="text-left px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Quarter</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Gross Amount (₹)</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-green-700 uppercase tracking-wide whitespace-nowrap">TDS Debit (₹)</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-green-800 uppercase tracking-wide whitespace-nowrap">Credit (₹)</th>
            <th className="text-right px-4 py-3 text-xs font-semibold text-green-900 uppercase tracking-wide whitespace-nowrap">Running Balance (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {entries.map((entry, idx) => (
            <tr
              key={entry.id || idx}
              className={`hover:bg-green-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
            >
              <td className="px-4 py-3 text-gray-500 text-xs">{idx + 1}</td>
              <td className="px-4 py-3 text-gray-700 whitespace-nowrap text-xs">{entry.date}</td>
              <td className="px-4 py-3 text-gray-800 text-xs max-w-[180px] truncate" title={entry.particulars}>
                {entry.particulars}
              </td>
              <td className="px-4 py-3 text-gray-800 font-medium text-xs whitespace-nowrap">{entry.clientName}</td>
              <td className="px-4 py-3 font-mono text-green-700 text-xs whitespace-nowrap">{entry.clientTAN}</td>
              <td className="px-4 py-3 font-mono text-gray-600 text-xs whitespace-nowrap">{entry.clientPAN || '—'}</td>
              <td className="px-4 py-3 text-xs">
                <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded text-xs font-medium">
                  {entry.section}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{entry.voucherNo || '—'}</td>
              <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{entry.quarter || '—'}</td>
              <td className="px-4 py-3 text-right text-gray-700 text-xs whitespace-nowrap">
                {formatCurrency(entry.grossAmount)}
              </td>
              <td className="px-4 py-3 text-right text-green-700 font-semibold text-xs whitespace-nowrap">
                {formatCurrency(entry.tdsDebit)}
              </td>
              <td className="px-4 py-3 text-right text-gray-500 text-xs whitespace-nowrap">
                {formatCurrency(entry.credit)}
              </td>
              <td className="px-4 py-3 text-right font-semibold text-xs whitespace-nowrap">
                <span className={entry.runningBalance >= 0 ? 'text-green-700' : 'text-red-600'}>
                  {formatCurrency(entry.runningBalance)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TDSReceivableLedgerTable
