import React, { useState, useEffect } from "react";

export default function RejectionModal({ isOpen, onClose, onSubmit }) {
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
    
    console.log("Submitting rejection reason:", reason.trim());
    
    // FIXED: Only pass the reason, not claimId since it's handled in the parent component
    onSubmit(reason.trim());
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
            placeholder="Enter detailed reason for rejection..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            autoFocus
          />
          <p className="text-sm text-gray-500 mt-1">
            This reason will be visible to the employee who submitted the request.
          </p>
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
            disabled={!reason.trim()}
            className={`px-4 py-2 rounded text-white ${
              reason.trim() 
                ? "bg-red-600 hover:bg-red-700" 
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Submit Rejection
          </button>
        </div>
      </div>
    </div>
  );
}