// File: src/features/billing/components/RejectInvoiceModal.jsx

import React, { useState } from "react";

export default function RejectInvoiceModal({ invoice, onClose,onConfirm}) {
  const [remarks, setRemarks] = useState("");

   const handleReject = () => {
    if (!remarks.trim()) {
      alert("Please enter remarks");
      return;
    }
    onConfirm(invoice.id, remarks);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow">
        <h2 className="text-xl font-semibold mb-4 text-red-600">Reject Invoice</h2>

        <p className="text-sm mb-2">Invoice No: <strong>{invoice.invoiceNo}</strong></p>

        <textarea
          className="w-full p-2 border rounded text-sm"
          rows="4"
          placeholder="Enter rejection remarks..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={handleReject}
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
}
