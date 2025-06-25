

import React from "react";

export default function ViewInvoiceModal({ invoice, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Invoice Details</h2>

        <div className="space-y-1 text-sm mb-4">
          <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
          <p><strong>Vendor:</strong> {invoice.vendorName}</p>
          <p><strong>PO No:</strong> {invoice.poNo}</p>
          <p><strong>GSTIN:</strong> {invoice.gstin}</p>
          <p><strong>Amount:</strong> ₹{invoice.amount}</p>
        </div>

        <div className="border rounded mb-4 h-64 sm:h-72 overflow-hidden">
          <iframe
            src={invoice.documentUrl}
            title="Invoice Preview"
            width="100%"
            height="100%"
            className="rounded"
          ></iframe>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <a
            href={invoice.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm"
          >
            🔗 Open Full Document in Web
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
