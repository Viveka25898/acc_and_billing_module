import React from 'react'

export default function BillingManagerModal({ invoice, onClose, onApprove, onReject }) {
  if (!invoice) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
        <h2 className="text-xl font-bold mb-4 text-blue-700">
          Invoice Review - Procurement Prepaid
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <strong>Invoice #:</strong> {invoice.invoiceNumber}
            </p>
            <p>
              <strong>Vendor:</strong> {invoice.vendorName}
            </p>
            <p>
              <strong>Total Amount:</strong> ₹{invoice.totalAmount.toLocaleString()}
            </p>
            <p>
              <strong>GST Rate:</strong> {invoice.gstRate || 18}%
            </p>
          </div>
          <div>
            <p>
              <strong>HSN Code:</strong> {invoice.hsnCode || 'N/A'}
            </p>
            <p>
              <strong>Prepaid Period:</strong> {invoice.prepaidPeriod || 12} months
            </p>
            <p>
              <strong>Start Month:</strong> {invoice.prepaidStartMonth || 'N/A'}
            </p>
            <p>
              <strong>Monthly Amount:</strong> ₹
              {(invoice.monthlyAmortization || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Show AM Remarks */}
        {invoice.amRemarks && (
          <div className="bg-green-50 border border-green-200 rounded p-3 mb-4">
            <p className="text-sm">
              <strong>Account Manager Remarks:</strong> {invoice.amRemarks}
            </p>
          </div>
        )}

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
              <span className="font-semibold">{i + 1}]</span>{' '}
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
  )
}
