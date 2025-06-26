// File: src/features/conveyance/components/RejectReasonModal.jsx

import React, { useState } from "react";

export default function RejectionModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Please enter a reason for rejection");
    onSubmit(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-2">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
        <div className="flex justify-between items-center border-b px-4 py-3">
          <h2 className="text-lg font-semibold">Reason for Rejection</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <textarea
            rows="4"
            placeholder="Enter reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring"
          ></textarea>
        </div>

        <div className="flex justify-end px-4 py-3 border-t">
          <button
            onClick={handleSubmit}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
