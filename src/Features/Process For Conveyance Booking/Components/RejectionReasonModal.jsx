import React from "react";

export default function RejectReasonModal({ reason, onClose }) {
  // Ensure reason is properly displayed
  const displayReason = typeof reason === 'string' ? reason : 
                       reason?.reason ? reason.reason : 
                       "No reason provided";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl">
        <h3 className="text-lg font-semibold mb-4">Rejection Reason</h3>
        <p className="text-gray-700 mb-6 whitespace-pre-wrap">{displayReason}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}