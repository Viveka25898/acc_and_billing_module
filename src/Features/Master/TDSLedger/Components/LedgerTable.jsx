export default function LedgerTable({ rows }) {
  return (
    <div className="overflow-x-auto p-4">
      <table className="w-full text-xs border bg-white rounded-lg shadow">
        <thead className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white sticky top-0">
          <tr>
            {[
              'Line No',
              'Posting Date',
              'Particulars',
              'TDS Section',
              'Gross Amt',
              'TDS Amt (Cr)',
              'Net Payable',
              'Vendor',
              'Customer',
              'Site',
              'State',
              'Status',
            ].map((col, i) => (
              <th key={i} className="px-2 py-2 whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t hover:bg-gray-50 duration-100">
              <td className="px-2 py-2 text-center">{row.lineNo}</td>
              <td className="px-2 py-2">{row.postingDate}</td>
              <td className="px-2 py-2">{row.particulars}</td>
              <td className="px-2 py-2">{row.section}</td>
              <td className="px-2 py-2 text-right font-semibold">₹{row.gross}</td>
              <td className="px-2 py-2 text-right font-semibold text-green-700">₹{row.tds}</td>
              <td className="px-2 py-2 text-right font-semibold">₹{row.net}</td>
              <td className="px-2 py-2">{row.vendor}</td>
              <td className="px-2 py-2">{row.customer || '-'}</td>
              <td className="px-2 py-2">{row.site || '-'}</td>
              <td className="px-2 py-2">{row.state || '-'}</td>
              <td className="px-2 py-2">
                <span
                  className={`px-2 py-1 rounded text-[10px] font-semibold ${
                    row.status === 'Paid'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-700'
                  }`}
                >
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
