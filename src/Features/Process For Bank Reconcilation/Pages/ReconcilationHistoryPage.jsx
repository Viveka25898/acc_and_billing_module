// File: src/features/bankReconciliation/pages/ReconciliationHistoryPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { getReconciliationHistory } from "../utils/saveReconcilation";

export default function ReconciliationHistoryPage() {
  const history = getReconciliationHistory();
  console.log(history.length);

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
        Reconciliation History
      </h1>
      {history.length === 0 ? (
        <p className="text-gray-500 text-center">No reconciliation records found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm border rounded shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">File Name</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Matched</th>
                <th className="px-4 py-2 text-left">Unmatched</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record) => {
                  const matchedCount = record.records.filter(r => r.inBank && r.inBooks).length;
                  const unmatchedCount = record.records.filter(r => !r.inBank || !r.inBooks).length;

                  return (
                    <tr key={record.id} className="border-t">
                      <td className="px-4 py-2">{record.fileName}</td>
                      <td className="px-4 py-2">{new Date(record.date).toLocaleString()}</td>
                      <td className="px-4 py-2 text-green-700 font-medium">{matchedCount}</td>
                      <td className="px-4 py-2 text-red-700 font-medium">{unmatchedCount}</td>
                      <td className="px-4 py-2 text-center">
                        <Link
                          to={`/dashboard/billing-manager/reconciliation-report-page/${record.id}`}
                          className="text-blue-600 underline hover:text-blue-800"
                        >
                          View Report
                        </Link>
                      </td>
                    </tr>
                  );
                })}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
