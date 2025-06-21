// File: src/features/statutoryPayments/components/AERejectionModal.jsx

import React, { useState } from "react";

export default function AERejectionModal({ onSubmit, onClose }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (!reason.trim()) return alert("Please enter a reason.");
    onSubmit(reason);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-red-500 text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-lg font-semibold mb-4">Rejection Reason</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          placeholder="Enter reason for rejection..."
          className="w-full border rounded px-3 py-2"
        ></textarea>
        <div className="flex justify-end mt-4">
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
