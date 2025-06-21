import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AEPaidChallanPreviewModal from "./PaidChallanPreviewModal";

export default function PaidComplianceTable({ entries }) {
  const [previewFile, setPreviewFile] = useState(null);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border">Remarks</th>
            <th className="p-2 border">Payment Date</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="p-2 border">{entry.paymentType}</td>
              <td className="p-2 border">{entry.paymentMonth}</td>
              <td className="p-2 border">₹{entry.amount}</td>
              <td className="p-2 border">
                <button
                  onClick={() => setPreviewFile(entry.challan)}
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  title="View Challan"
                >
                  <FaEye/>
                </button>
              </td>
              <td className="p-2 border">{entry.remarks}</td>
              <td className="p-2 border">{entry.paymentDate}</td>
              <td className="p-2 border">
                <span className="text-green-600 font-medium">Paid</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {previewFile && (
        <AEPaidChallanPreviewModal file={previewFile} onClose={() => setPreviewFile(null)} />
      )}
    </div>
  );
}
