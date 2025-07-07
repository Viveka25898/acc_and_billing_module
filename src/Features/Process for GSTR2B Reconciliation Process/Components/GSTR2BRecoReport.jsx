// File: src/features/gstr2bReco/components/GSTR2BRecoReport.jsx

import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function GSTR2BRecoReport({ records }) {
  const matched = records.filter((r) => r.inGSTR2B && r.inBooks);
  const unmatched = records.filter((r) => !r.inGSTR2B || !r.inBooks);

  const Table = ({ title, data, highlight }) => (
    <div className="mb-10">
      <h3 className={`text-lg font-semibold mb-3 ${highlight}`}>{title}</h3>
      <div className="overflow-auto border rounded-lg shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">GSTIN</th>
              <th className="px-4 py-2 text-left">Invoice No</th>
              <th className="px-4 py-2 text-left">Tax Amount</th>
              <th className="px-4 py-2 text-center">In GSTR-2B</th>
              <th className="px-4 py-2 text-center">In Books</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{entry.date}</td>
                <td className="px-4 py-2">{entry.gstin}</td>
                <td className="px-4 py-2">{entry.invoiceNumber}</td>
                <td className="px-4 py-2">₹{entry.taxAmount}</td>
                <td className="px-4 py-2 text-center">
                  {entry.inGSTR2B ? (
                    <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                  ) : (
                    <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {entry.inBooks ? (
                    <FaCheckCircle className="text-green-600 w-4 h-4 mx-auto" />
                  ) : (
                    <FaTimesCircle className="text-red-600 w-4 h-4 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="mt-10">
      <Table title="✅ Matched Invoices" data={matched} highlight="text-green-600" />
      <Table title="❌ Unmatched Invoices" data={unmatched} highlight="text-red-600" />
    </div>
  );
}
