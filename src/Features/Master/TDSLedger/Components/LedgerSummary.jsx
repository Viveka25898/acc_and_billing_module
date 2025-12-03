export default function LedgerSummary({ info }) {
  const metrics = [
    { label: 'Total Gross Amount', key: 'totalGross' },
    { label: 'Total TDS Deducted', key: 'totalTds' },
    { label: 'TDS Outstanding', key: 'tdsOutstanding' },
    { label: 'Net Amount Payable', key: 'netPayable' },
  ]

  return (
    <div className="bg-gray-100 p-4 border-t-4 border-indigo-600">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((item, i) => (
          <div key={i} className="text-center bg-white p-3 rounded-lg shadow">
            <p className="text-gray-500 text-[11px] uppercase">{item.label}</p>
            <h3 className="text-lg font-bold text-blue-900">{info[0][item.key]}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
