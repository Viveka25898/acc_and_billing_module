// File: src/features/billingManager/components/BillingManagerModal.jsx
import React from "react";

export default function BillingManagerModal({ invoice, onClose, onApprove, onReject }) {
  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Invoice Review</h2>

        <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
        <p><strong>Vendor:</strong> {invoice.vendorName}</p>
        <p><strong>Billing Period:</strong> {invoice.billingPeriod}</p>
        <p><strong>GST %:</strong> {invoice.gstRate}%</p>
        <p><strong>HSN Code:</strong> {invoice.hsnCode}</p>

        <div className="mt-4">
          <a
            href={invoice.documentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline mr-4"
          >
            View Invoice PDF
          </a>

          {invoice.poDocuments?.map((doc, i) => (
            <span key={i} className="inline-block mr-3">
              <span className="font-semibold">{i + 1}]</span>{" "}
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 underline"
              >
                {doc.name}
              </a>
            </span>
          ))}

        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            onClick={() => onReject(invoice.id)}
          >
            Final Reject
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            onClick={() => onApprove(invoice.id)}
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
