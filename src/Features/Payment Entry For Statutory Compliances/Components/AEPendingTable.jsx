// File: src/features/statutoryPayments/components/AEPendingTable.jsx

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AERejectionModal from "./AERejectionModal";
import AEChallanPreviewModal from "./AEChallanPreviewModal";

export default function AEPendingTable({ entries, onUpdate }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [rejectId, setRejectId] = useState(null);

  return (
    <div className="overflow-x-auto">
      
      <table className="min-w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border">Remarks</th>
            <th className="p-2 border">Manager Status</th>
            <th className="p-2 border">AE Status</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="text-center">
              <td className="p-2 border">{entry.id}</td>
              <td className="p-2 border">{entry.paymentType}</td>
              <td className="p-2 border">{entry.paymentMonth}</td>
              <td className="p-2 border">₹{entry.amount}</td>
              <td className="p-2 border">
                <button
                  onClick={() => setPreviewFile(entry.challan)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Challan"
                >
                  <FaEye />
                </button>
              </td>
              <td className="p-2 border">{entry.remarks}</td>
              <td className="p-2 border">{entry.managerStatus}</td>
              <td className="p-2 border">
                {entry.aeStatus === "Pending" ? (
                  <span className="text-yellow-600 font-medium">Pending</span>
                ) : entry.aeStatus === "AcceptedByAE" ? (
                  <span className="text-green-600 font-medium">Accepted</span>
                ) : (
                  <>
                    <span className="text-red-600 font-medium">Rejected</span>
                    <button
                      onClick={() => alert(entry.aeRejection)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      title="View Rejection Reason"
                    >
                    </button>
                  </>
                )}
              </td>
              <td className="p-2 border">
                {entry.aeStatus === "Pending" && (
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => onUpdate(entry.id, "AcceptedByAE")}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setRejectId(entry.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Rejection Modal */}
      {rejectId && (
        <AERejectionModal
          onSubmit={(reason) => {
            onUpdate(rejectId, "RejectedByAE", reason);
            setRejectId(null);
          }}
          onClose={() => setRejectId(null)}
        />
      )}

      {/* Challan Preview Modal */}
      {previewFile && (
        <AEChallanPreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}