import React from "react";

const jvData = {
  voucherNumber: "JV20250729",
  date: "2025-07-29",
  narration: "Advance settlement for July",
  branch: "Mumbai Site A",
  createdBy: "Accounts Executive",
  entries: [
    {
      glCode: "5001",
      accountName: "Employee Advance",
      debitAmount: 5000,
      creditAmount: 0,
      costCenter: "Mumbai Ops",
      employeeId: "EMP123",
      remarks: "Advance adjustment"
    },
    {
      glCode: "4001",
      accountName: "Cash",
      debitAmount: 0,
      creditAmount: 5000,
      costCenter: "Mumbai Ops",
      employeeId: "EMP123",
      remarks: "Cash reversal"
    }
  ]
};

const JVDisplay = () => {
  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-xl border mt-6 text-sm md:text-base">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold">Journal Voucher (JV)</h2>
          <p className="text-gray-600">Voucher No: <span className="font-medium">{jvData.voucherNumber}</span></p>
        </div>
        <div className="text-right">
          <p className="text-gray-600">Date: <span className="font-medium">{jvData.date}</span></p>
          <p className="text-gray-600">Created By: <span className="font-medium">{jvData.createdBy}</span></p>
        </div>
      </div>

      <div className="mb-4">
        <p><span className="font-semibold">Branch:</span> {jvData.branch}</p>
        <p><span className="font-semibold">Narration:</span> {jvData.narration}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 text-xs md:text-sm">
            <tr>
              <th className="border px-3 py-2">GL Code</th>
              <th className="border px-3 py-2">Account Name</th>
              <th className="border px-3 py-2">Debit Amount</th>
              <th className="border px-3 py-2">Credit Amount</th>
              <th className="border px-3 py-2">Cost Center</th>
              <th className="border px-3 py-2">Employee ID</th>
              <th className="border px-3 py-2">Remarks</th>
            </tr>
          </thead>
          <tbody>
            {jvData.entries.map((entry, index) => (
              <tr key={index} className="text-center">
                <td className="border px-3 py-2">{entry.glCode}</td>
                <td className="border px-3 py-2">{entry.accountName}</td>
                <td className="border px-3 py-2">{entry.debitAmount.toLocaleString()}</td>
                <td className="border px-3 py-2">{entry.creditAmount.toLocaleString()}</td>
                <td className="border px-3 py-2">{entry.costCenter}</td>
                <td className="border px-3 py-2">{entry.employeeId}</td>
                <td className="border px-3 py-2">{entry.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right mt-6 text-xs text-gray-500">
        <p>Generated on {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default JVDisplay;
