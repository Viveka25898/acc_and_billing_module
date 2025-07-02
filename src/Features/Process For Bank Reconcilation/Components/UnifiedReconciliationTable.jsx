// File: src/features/bankReconciliation/components/UnifiedReconciliationTable.jsx
import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";


export default function UnifiedReconciliationTable({ data }) {
  return (
    <div className="overflow-auto border rounded-md shadow">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Date</th>
            <th className="px-4 py-2 text-left">Amount</th>
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-center">In Bank</th>
            <th className="px-4 py-2 text-center">In Books</th>
            <th className="px-4 py-2 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, idx) => {
            const isMatched = entry.inBank && entry.inBooks;
            const statusColor = isMatched ? "text-green-600" : "text-red-600";
            const statusLabel = isMatched
              ? "Matched"
              : entry.inBank && !entry.inBooks
              ? "Only in Bank"
              : "Only in Books";

            return (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">₹{entry.amount}</td>
                <td className="px-4 py-2">{entry.description}</td>
                <td className="px-4 py-2 text-center">
                  {entry.inBank ? <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" /> : <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />}
                </td>
                <td className="px-4 py-2 text-center">
                  {entry.inBooks ? <FaTimesCircle className="text-green-600 w-4 h-4 mx-auto" /> : <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />}
                </td>
                <td className={`px-4 py-2 text-center font-semibold ${statusColor}`}>{statusLabel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
