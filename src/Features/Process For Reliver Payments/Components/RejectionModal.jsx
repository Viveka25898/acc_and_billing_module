
import React, { useState } from "react";

export default function RejectionModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Reason for Rejection</h2>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows="4"
          className="w-full border rounded p-2 mb-4"
          placeholder="Enter rejection reason..."
        ></textarea>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
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
