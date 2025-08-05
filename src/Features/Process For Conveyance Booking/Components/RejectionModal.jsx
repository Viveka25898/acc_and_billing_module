import React, { useState, useEffect } from "react";

export default function RejectionModal({ isOpen, onClose, onSubmit, claimId }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setReason("");
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!reason.trim()) {
      alert("Please enter a reason for rejection");
      return;
    }
    onSubmit(claimId, reason); // Pass both claimId and reason
    onClose();
  };

  if (!isOpen) return null;

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
          />
        </div>

        <div className="flex justify-end gap-2 px-4 py-3 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
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