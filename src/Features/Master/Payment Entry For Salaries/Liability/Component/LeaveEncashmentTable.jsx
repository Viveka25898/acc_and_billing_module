import React from 'react'

const LeaveEncashmentTable = () => {
  const ledgerData = [
    {
      date: '01-Apr-24',
      voucherNo: 'OB-001',
      type: 'Opening',
      particulars: 'Opening Balance B/F - Provision for Leave Encashment',
      employeeDetails: 'All Employees',
      debit: '-',
      credit: '-',
      balance: '12,50,000.00',
      balType: 'Cr',
      journalRef: '-',
    },
    {
      date: '30-Jun-24',
      voucherNo: 'JV-210',
      type: 'Journal',
      particulars: 'Quarterly provision for leave encashment - Q1 FY 2024-25',
      employeeDetails: '87 Employees',
      debit: '-',
      credit: '1,90,480.00',
      balance: '14,40,480.00',
      balType: 'Cr',
      journalRef: 'JV-210',
    },
    {
      date: '15-Jun-24',
      voucherNo: 'PAY-025',
      type: 'Payment',
      particulars: 'Leave encashment payment to employees',
      employeeDetails: '3 Employees',
      debit: '85,000.00',
      credit: '-',
      balance: '13,55,480.00',
      balType: 'Cr',
      journalRef: 'PAY-025',
    },
  ]

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-green-900 text-white">
          <tr>
            <th className="border border-green-800 p-3 text-xs font-medium">Date</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Voucher No.</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Type</th>
            <th className="border border-green-800 p-3 text-xs font-medium">
              Particulars / Narration
            </th>
            <th className="border border-green-800 p-3 text-xs font-medium">Employee Details</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Debit (₹)</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Credit (₹)</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Balance (₹)</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Bal Type</th>
            <th className="border border-green-800 p-3 text-xs font-medium">Journal Ref</th>
          </tr>
        </thead>
        <tbody>
          {ledgerData.map((row, index) => (
            <tr
              key={index}
              className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <td className="border border-gray-300 p-3 text-sm">{row.date}</td>
              <td className="border border-gray-300 p-3 text-sm">{row.voucherNo}</td>
              <td className="border border-gray-300 p-3 text-sm">{row.type}</td>
              <td className="border border-gray-300 p-3 text-sm text-left">
                <div>{row.particulars}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {row.type === 'Opening' && 'As per actuarial valuation report dated 31-Mar-2024'}
                  {row.type === 'Journal' && 'Monthly accrual for Apr-Jun 2024'}
                  {row.type === 'Payment' && 'Tax deduction u/s 43B applicable'}
                </div>
              </td>
              <td className="border border-gray-300 p-3 text-sm">{row.employeeDetails}</td>
              <td className="border border-gray-300 p-3 text-sm font-bold text-green-700">
                {row.debit}
              </td>
              <td className="border border-gray-300 p-3 text-sm font-bold text-red-700">
                {row.credit}
              </td>
              <td className="border border-gray-300 p-3 text-sm font-bold text-blue-700">
                {row.balance}
              </td>
              <td className="border border-gray-300 p-3 text-sm">{row.balType}</td>
              <td className="border border-gray-300 p-3 text-sm">{row.journalRef}</td>
            </tr>
          ))}

          {/* Total Row */}
          <tr className="bg-green-50 font-bold border-t-2 border-green-500">
            <td colSpan="5" className="border border-gray-300 p-3 text-right">
              TOTAL MOVEMENTS (Q1 FY 2024-25)
            </td>
            <td className="border border-gray-300 p-3 text-green-700">85,000.00</td>
            <td className="border border-gray-300 p-3 text-red-700">1,90,480.00</td>
            <td className="border border-gray-300 p-3 text-blue-700">13,55,480.00</td>
            <td className="border border-gray-300 p-3">Cr</td>
            <td className="border border-gray-300 p-3">-</td>
          </tr>
        </tbody>
      </table>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="bg-white border border-gray-300 p-4 text-center">
          <div className="text-sm text-gray-600 mb-2">Opening Balance</div>
          <div className="text-2xl font-bold text-red-700">₹12,50,000.00</div>
          <div className="text-xs text-gray-500 mt-1">As on 01-Apr-2024 (Cr)</div>
        </div>
        <div className="bg-white border border-gray-300 p-4 text-center">
          <div className="text-sm text-gray-600 mb-2">Closing Balance</div>
          <div className="text-2xl font-bold text-red-700">₹13,55,480.00</div>
          <div className="text-xs text-gray-500 mt-1">As on 30-Jun-2024 (Cr)</div>
        </div>
        <div className="bg-white border border-gray-300 p-4 text-center">
          <div className="text-sm text-gray-600 mb-2">Net Movement</div>
          <div className="text-2xl font-bold text-green-700">₹1,05,480.00</div>
          <div className="text-xs text-gray-500 mt-1">Increase in Liability</div>
        </div>
      </div>
    </div>
  )
}

export default LeaveEncashmentTable
