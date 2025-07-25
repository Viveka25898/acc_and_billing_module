import React, { useState } from "react";

export default function RejectionModal({ onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Reject Attendance</h2>
        <textarea
          className="w-full border p-2 rounded mb-4 text-sm"
          rows="4"
          placeholder="Enter rejection reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-1 bg-gray-300 text-sm rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSubmit(reason);
              setReason("");
            }}
            className="px-4 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}
