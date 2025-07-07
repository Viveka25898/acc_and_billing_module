// File: src/features/relieverPayments/components/RejectionReasonModal.jsx
import React from "react";

export default function RejectionReasonModal({ reason, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Rejection Reason</h2>
        <p className="text-gray-700 mb-6">{reason}</p>
        <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Close
        </button>
      </div>
    </div>
  );
}
