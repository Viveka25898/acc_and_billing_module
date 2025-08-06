import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import AERejectionModal from "./AERejectionModal";
import AEChallanPreviewModal from "./AEChallanPreviewModal";

export default function AEPendingTable({ entries, onUpdate }) {
  const [previewFile, setPreviewFile] = useState(null);
  const [rejectId, setRejectId] = useState(null);
  const [selectedRejection, setSelectedRejection] = useState(null);

  // Helper to get manager approval details
  const getManagerApproval = (history) => {
    return history?.find(item => item.action === "Approved by Compliance Manager");
  };

  // Helper to get status display
  const getStatusDisplay = (status) => {
    switch(status) {
      case "pending-ae": 
        return { text: "Pending", color: "text-yellow-600" };
      case "approved":
        return { text: "Approved", color: "text-green-600" };
      case "rejected":
        return { text: "Rejected", color: "text-red-600" };
      default:
        return { text: status, color: "text-gray-600" };
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Req ID</th>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Period</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border">Remarks</th>
            <th className="p-2 border">Approved By</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const statusInfo = getStatusDisplay(entry.status);
            const managerApproval = getManagerApproval(entry.history);
            
            return (
              <tr key={entry.id} className="text-center hover:bg-gray-50">
                <td className="p-2 border">#{entry.id.slice(-6)}</td>
                <td className="p-2 border">{entry.type}</td>
                <td className="p-2 border">{entry.period}</td>
                <td className="p-2 border">₹{entry.amount}</td>
                <td className="p-2 border">
                  {entry.challanRef && (
                    <button
                      onClick={() => setPreviewFile(entry.challanRef)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Challan"
                    >
                      <FaEye />
                    </button>
                  )}
                </td>
                <td className="p-2 border">{entry.remarks}</td>
                <td className="p-2 border">
                  {managerApproval?.by || "N/A"}
                </td>
                <td className={`p-2 border font-medium ${statusInfo.color}`}>
                  {statusInfo.text}
                </td>
                <td className="p-2 border">
                  {entry.status === "pending-ae" && (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onUpdate(entry.id, "AcceptedByAE")}
                        className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 text-xs"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => {
                          setRejectId(entry.id);
                          setSelectedRejection(entry.rejectionReason);
                        }}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                  {entry.status === "rejected" && entry.rejectionReason && (
                    <button
                      onClick={() => alert(`Rejection Reason: ${entry.rejectionReason}`)}
                      className="text-red-600 hover:text-red-800 text-xs"
                    >
                      View Reason
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Rejection Modal */}
      {rejectId && (
        <AERejectionModal
          existingReason={selectedRejection}
          onSubmit={(reason) => {
            onUpdate(rejectId, "RejectedByAE", reason);
            setRejectId(null);
            setSelectedRejection(null);
          }}
          onClose={() => {
            setRejectId(null);
            setSelectedRejection(null);
          }}
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