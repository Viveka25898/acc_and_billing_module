// SubmittedEntriesTable.js
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import ChallanPreviewModal from "./ChallanPreviewModal";
import RejectionReasonModal from "./RejectionReasonModal";

export default function SubmittedEntriesTable({ entries }) {
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending-compliance-manager":
        return { text: "Pending Manager", color: "text-yellow-600" };
      case "pending-ae":
        return { text: "Pending AE", color: "text-blue-600" };
      case "approved":
        return { text: "Approved", color: "text-green-600" };
      case "rejected":
        return { text: "Rejected", color: "text-red-600" };
      default:
        return { text: "Pending", color: "text-gray-600" };
    }
  };

  const getRejectionDetails = (entry) => {
    if (entry.status !== "rejected") return null;
    
    // Find the rejection action in history
    const rejectionAction = entry.history?.find(
      action => action.action.includes("Rejected")
    );
    
    return {
      reason: entry.rejectionReason || "No reason provided",
      by: rejectionAction?.by || "Unknown",
      comments: rejectionAction?.comments || ""
    };
  };

  const handleShowReason = (entry) => {
    const rejection = getRejectionDetails(entry);
    if (rejection) {
      setSelectedReason(`Reason: ${rejection.reason}\n\nComments: ${rejection.comments}\n\nRejected by: ${rejection.by}`);
      setShowReasonModal(true);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Period</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Details</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const statusInfo = getStatusInfo(entry.status);
            const rejectionDetails = getRejectionDetails(entry);
            
            return (
              <tr key={entry.id} className="hover:bg-gray-50">
                <td className="p-2 border">{entry.type}</td>
                <td className="p-2 border">{entry.period}</td>
                <td className="p-2 border">₹{entry.amount}</td>
                <td className="p-2 border text-center">
                  {entry.challanRef && (
                    <button
                      onClick={() => setSelectedChallan(entry.challanRef)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Challan"
                    >
                      <FaEye />
                    </button>
                  )}
                </td>
                <td className={`p-2 border text-center font-semibold ${statusInfo.color}`}>
                  {statusInfo.text}
                </td>
                <td className="p-2 border text-center">
                  {rejectionDetails ? (
                    <button
                      onClick={() => handleShowReason(entry)}
                      className="text-red-600 hover:text-red-800"
                      title="View Rejection Details"
                    >
                      <FaEye />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const lastAction = entry.history?.[entry.history.length - 1];
                        if (lastAction) {
                          setSelectedReason(`${lastAction.action} by ${lastAction.by}`);
                          setShowReasonModal(true);
                        }
                      }}
                      className="text-gray-600 hover:text-gray-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedChallan && (
        <ChallanPreviewModal file={selectedChallan} onClose={() => setSelectedChallan(null)} />
      )}
      {showReasonModal && (
        <RejectionReasonModal 
          reason={selectedReason} 
          onClose={() => {
            setShowReasonModal(false);
            setSelectedReason("");
          }} 
        />
      )}
    </div>
  );
}