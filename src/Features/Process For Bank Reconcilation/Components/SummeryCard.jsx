// File: src/features/bankReconciliation/components/SummaryCard.jsx
import React from "react";

export default function SummaryCard({ matched, unmatched, total }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-green-100 text-green-700 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Matched</h3>
        <p className="text-2xl">{matched}</p>
      </div>
      <div className="bg-red-100 text-red-700 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Unmatched</h3>
        <p className="text-2xl">{unmatched}</p>
      </div>
      <div className="bg-gray-100 text-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Total Transactions</h3>
        <p className="text-2xl">{total}</p>
      </div>
    </div>
  );
}
