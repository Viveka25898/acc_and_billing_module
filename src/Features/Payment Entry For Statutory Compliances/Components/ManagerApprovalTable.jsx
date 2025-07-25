// File: src/features/statutoryPayments/components/ManagerApprovalTable.jsx

import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import ManagerChallanPreviewModal from "./ManagerChallanPreviewModal";
import ManagerRejectReasonModal from "./ManagerRejectionReasonModal";
import { toast } from "react-toastify";



export default function ManagerApprovalTable({ entries, onUpdate }) {
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [selectedEntryId, setSelectedEntryId] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const handleApprove = (id) => {
    onUpdate(id, "Approved");
    toast.success("Payment Approved Successfully!")
  };

  const handleReject = (id) => {
    setSelectedEntryId(id);
    setShowRejectModal(true);
    
  };

  const handleRejectSubmit = (reason) => {
    if (selectedEntryId) {
      onUpdate(selectedEntryId, "Rejected", reason);
    }
    setShowRejectModal(false);
    setSelectedEntryId(null);
    toast.error("Payment Rejected Successfully!")
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Remarks</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border text-center">Actions</th>
            <th className="p-2 border ">AE Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="p-2 border">{entry.paymentType}</td>
              <td className="p-2 border">{entry.paymentMonth}</td>
              <td className="p-2 border">₹{entry.amount}</td>
              <td className="p-2 border">{entry.remarks}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => setSelectedChallan(entry.challan)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Challan"
                >
                  <FaEye />
                </button>
              </td>
              <td className="p-2 border text-center space-x-2">
                {entry.managerStatus === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleApprove(entry.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(entry.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                ) : (
                  <span
                    className={`px-3 py-1 rounded font-semibold text-white ${
                      entry.managerStatus === "Approved"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {entry.managerStatus}
                  </span>
                )}
              </td>
              <td className="p-2 border">{entry.aeStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedChallan && (
        <ManagerChallanPreviewModal file={selectedChallan} onClose={() => setSelectedChallan(null)} />
      )}

      {showRejectModal && (
        <ManagerRejectReasonModal
          onSubmit={handleRejectSubmit}
          onClose={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
}
