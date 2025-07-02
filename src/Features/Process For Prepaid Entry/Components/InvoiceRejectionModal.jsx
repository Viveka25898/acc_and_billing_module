// File: src/features/vendor/components/InvoiceRejectionModal.jsx

import React from "react";

export default function InvoiceRejectionModal({ isOpen, onClose, reason }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 text-white text-lg font-semibold px-6 py-3 flex justify-between items-center">
          <span>Rejection Reason</span>
          <button
            onClick={onClose}
            className="text-white text-xl leading-none hover:text-gray-200"
          >
            &times;
          </button>
        </div>

        <div className="p-6 text-gray-700">
          <p className="text-sm">The invoice was rejected due to the following reason:</p>
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded text-sm whitespace-pre-wrap">
            {reason || "No reason provided."}
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-3 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
