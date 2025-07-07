import React from "react";
import { Link } from "react-router-dom";
import { getRecoHistory } from "../utils/recoHistoryService";


export default function GSTR2BRecoHistoryPage() {
  const history = getRecoHistory();

  return (
    <div className="max-w-6xl mx-auto p-4 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-6 text-green-700">GSTR-2B Reco History</h1>
      {history.length === 0 ? (
        <p className="text-gray-600 text-center">No records found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 border">
              <tr>
                <th className="px-4 py-2 border text-left">File Name</th>
                <th className="px-4 py-2 border text-left">Date</th>
                <th className="px-4 py-2 border text-left">Matched</th>
                <th className="px-4 py-2 border text-left">Missing in Books</th>
                <th className="px-4 py-2 border text-left">Missing in GSTR-2B</th>
                <th className="px-4 py-2 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.map((r) => {
                const matched = r.records.filter(e => e.inGSTR2B && e.inBooks).length;
                const missingInBooks = r.records.filter(e => e.inGSTR2B && !e.inBooks).length;
                const missingInGSTR2B = r.records.filter(e => !e.inGSTR2B && e.inBooks).length;
                return (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2 border">{r.fileName}</td>
                    <td className="px-4 py-2 border">{new Date(r.date).toLocaleString()}</td>
                    <td className="px-4 py-2 border text-green-700">{matched}</td>
                    <td className="px-4 py-2 border text-red-700">{missingInBooks}</td>
                    <td className="px-4 py-2 border text-yellow-600">{missingInGSTR2B}</td>
                    <td className="px-4 py-2 border text-center">
                      <Link
                        to={`/dashboard/billing-manager/gstr2b-report`}
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
