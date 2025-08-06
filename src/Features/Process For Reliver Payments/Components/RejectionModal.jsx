import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function RejectionModal({
  isOpen,
  onClose,
  onSubmit,
  mode = "reject",
  existingReason = "" // Default to empty string
}) {
  const [reason, setReason] = useState("");

  // Initialize reason safely
  useEffect(() => {
    setReason(existingReason || "");
  }, [isOpen, mode, existingReason]);

  const handleSubmit = () => {
    // Safely handle trim operation
    const trimmedReason = reason ? reason.trim() : "";
    if (mode === "reject" && !trimmedReason) return;
    
    onSubmit(trimmedReason);
    if (mode === "reject") setReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {mode === "reject" ? "Reason for Rejection" : "Rejection Details"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            <FaTimes />
          </button>
        </div>
        
        {mode === "reject" ? (
          <>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="w-full border rounded p-2 mb-4"
              placeholder="Enter detailed rejection reason..."
              required
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                disabled={!reason.trim()}
              >
                Confirm Rejection
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="bg-red-50 p-4 rounded mb-4">
              <p className="whitespace-pre-line">{reason || "No reason provided"}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}