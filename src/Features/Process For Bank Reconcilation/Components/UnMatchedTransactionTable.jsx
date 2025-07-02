// File: src/features/bankReconciliation/components/UnmatchedTransactionsTable.jsx
import React from "react";

export default function UnmatchedTransactionsTable({ data }) {
  return (
    <div className="overflow-auto border rounded-md">
      <table className="min-w-full text-sm">
        <thead className="bg-red-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => (
            <tr key={idx} className="border-t">
              <td className="px-4 py-2">{entry.date}</td>
              <td className="px-4 py-2">₹{entry.amount}</td>
              <td className="px-4 py-2">{entry.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
