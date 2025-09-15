import React from "react";

export default function StatementPreviewTable({ data }) {
  console.log("Daata:-",data);
  // Format helper
  const formatValue = (val) => {
  if (!val) return "-";
  const num = Number(val.toString().replace(/,/g, ""));
  if (isNaN(num)) return "-";
  return `₹${num.toLocaleString("en-IN")}`;
};


  return (
    <div className="overflow-auto border rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Reference</th>
            <th className="px-4 py-2 text-right">Debit</th>
            <th className="px-4 py-2 text-right">Credit</th>
            <th className="px-4 py-2 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className="border-t hover:bg-gray-50">
              <td className="px-4 py-2">
                {entry.date instanceof Date
                  ? entry.date.toLocaleDateString("en-IN")
                  : entry.date}
              </td>
              <td className="px-4 py-2">{entry.description}</td>
              <td className="px-4 py-2 text-sm text-gray-600">{entry.ref_no}</td>
              <td className="px-4 py-2 text-right font-mono">
                {formatValue(entry.debit_)}
              </td>
              <td className="px-4 py-2 text-right font-mono">
                {formatValue(entry.credit_)}
              </td>
              <td className="px-4 py-2 text-right font-mono">
                {formatValue(entry.balance_)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
