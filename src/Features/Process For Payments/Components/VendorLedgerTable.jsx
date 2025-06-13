// src/features/processPayments/components/VendorLedgerTable.jsx
import React from "react";

export default function VendorLedgerTable({ data }) {
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No vendor entries found.</p>;
  }

  return (
    <div className="overflow-x-auto mt-6 bg-white shadow-md rounded-xl p-4">
      <table className="min-w-full text-sm border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {Object.keys(data[0]).map((key) => (
              <th key={key} className="px-4 py-2 border">{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {Object.values(row).map((val, i) => (
                <td key={i} className="px-4 py-2 border">{val}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
