// File: src/features/statutoryPayments/components/RejectReasonModal.jsx

import React, { useState } from "react";

export default function ManagerRejectReasonModal({ onSubmit, onClose }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim() === "") return;
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-red-500 font-bold text-lg"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4 text-red-700">Enter Rejection Reason</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Write reason..."
          className="w-full border rounded-md p-2 h-32 mb-4"
        ></textarea>
        <div className="text-right">
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
