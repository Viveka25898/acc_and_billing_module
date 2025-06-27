// File: src/features/prepaidEntry/components/RejectionModal.jsx
import React, { useState } from "react";

export default function RejectionModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
      setReason("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b font-semibold text-lg">Rejection Reason</div>
        <div className="p-6">
          <textarea
            rows="4"
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-red-200"
            placeholder="Enter reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="flex justify-end px-6 pb-4 space-x-2">
          <button
            className="px-4 py-2 text-sm rounded bg-gray-300 hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 text-sm rounded bg-red-500 hover:bg-red-600 text-white"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
