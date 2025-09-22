import React, { useState } from "react";

const ViewInvoiceModal = ({ invoice, onClose }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-4xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg sm:text-xl font-bold">
            View Invoice - {invoice.invoiceNo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p><strong>Invoice No:</strong> {invoice.invoiceNo}</p>
            <p><strong>Vendor Name:</strong> {invoice.vendorName}</p>
            <p><strong>PO No:</strong> {invoice.poNo}</p>
          </div>
          <div className="space-y-2">
            <p><strong>GSTIN:</strong> {invoice.gstin}</p>
            <p><strong>Amount:</strong> ₹{invoice.amount?.toLocaleString()}</p>
            <p><strong>Status:</strong> 
              <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                invoice.status === 'approved' ? 'bg-green-100 text-green-700' :
                invoice.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        {/* Document Preview */}
        {invoice.documentUrl && (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Invoice Document:</h3>
            <div className="border rounded h-96 overflow-hidden relative">
              {isIframeLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <span className="text-gray-600">Loading document...</span>
                  </div>
                </div>
              )}
              <iframe
                src={invoice.documentUrl}
                title="Invoice Preview"
                width="100%"
                height="100%"
                className="rounded"
                onLoad={() => setIsIframeLoading(false)}
                onError={() => setIsIframeLoading(false)}
              />
            </div>
            
            {/* Open in new tab link */}
            <div className="mt-2">
              <a
                href={invoice.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline text-sm"
              >
                🔗 Open document in new tab
              </a>
            </div>
          </div>
        )}

        {/* If no document URL */}
        {!invoice.documentUrl && (
          <div className="bg-gray-100 p-4 rounded text-center mb-4">
            <p className="text-gray-600">No document available for this invoice</p>
          </div>
        )}

        {/* Additional Details */}
        {invoice.rejectionReason && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <h4 className="font-medium text-red-800 mb-1">Rejection Reason:</h4>
            <p className="text-red-700 text-sm">{invoice.rejectionReason}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInvoiceModal;