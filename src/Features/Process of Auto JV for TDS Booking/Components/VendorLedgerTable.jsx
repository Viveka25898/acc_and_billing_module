import React from "react";

export default function VendorLedgerTable({ entries }) {
  if (entries.length === 0) {
    return <p className="text-gray-600">No ledger entries found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full mt-4 border border-green-200 text-sm">
  <thead className="bg-green-100 text-left">
    <tr>
      <th className="p-2 border">Date</th>
      <th className="p-2 border">Description</th>
      <th className="p-2 border">Type</th>
      <th className="p-2 border">Gross Amount</th>
      <th className="p-2 border">TDS Rate (%)</th>
      <th className="p-2 border">TDS Amount</th>
      <th className="p-2 border">Net Payable</th>
    </tr>
  </thead>
  <tbody>
    {entries.map((entry) => (
      <tr key={entry.id} className="border-t hover:bg-green-50 transition">
        <td className="p-2 border">{entry.date}</td>
        <td className="p-2 border">{entry.description}</td>
        <td className="p-2 border">{entry.type}</td>
        <td className="p-2 border">₹{entry.grossAmount}</td>
        <td className="p-2 border">{entry.tdsRate}</td>
        <td className="p-2 border">₹{entry.tdsAmount}</td>
        <td className="p-2 border font-semibold text-green-700">₹{entry.netPayable}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}
