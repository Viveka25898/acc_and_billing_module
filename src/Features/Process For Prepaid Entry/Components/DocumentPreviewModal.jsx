// File: src/components/DocumentPreviewModal.jsx

import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const DocumentPreviewModal = ({ isOpen, onClose, document, type = "Invoice" }) => {
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  if (!isOpen || !document) return null;

  const documentUrl = document.documentUrl;

  console.log(documentUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl relative p-6 overflow-y-auto max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <IoMdCloseCircleOutline size={20} />
        </button>

        {/* Header */}
        <h2 className="text-xl font-bold mb-4 border-b pb-2">{type} Details</h2>

        {/* Document Info */}
        <div className="space-y-2 text-sm">
         <p><span className="font-semibold">Invoice Number:</span> {document.documentNumber}</p>
            <p><span className="font-semibold">Vendor Name:</span> {document.vendorName}</p>
            <p><span className="font-semibold">Uploaded Date:</span> {document.uploadedDate}</p>
            <p><span className="font-semibold">POs Covered:</span> {document.poNumbers?.join(", ")}</p>
            <p><span className="font-semibold">Total Amount:</span> ₹{document.totalAmount?.toLocaleString()}</p>
            <p><span className="font-semibold">Status:</span> {document.status}</p>
            {document.status === "Rejected" && (
            <p><span className="font-semibold">Remarks:</span> {document.remarks || "No Remarks"}</p>
            )}

          {/* Document Preview */}
          {documentUrl && (
            <div className="mt-4">
              <p className="font-semibold mb-2">{type} Document Preview</p>
              {isIframeLoading && (
                <div className="flex items-center justify-center h-96 border rounded bg-gray-100 text-gray-500 animate-pulse">
                  Loading document...
                </div>
              )}
              <iframe
                src={documentUrl}
                title={`${type} Document`}
                className={`w-full h-96 border rounded ${isIframeLoading ? "hidden" : "block"}`}
                frameBorder="0"
                onLoad={() => setIsIframeLoading(false)}
              />
              <div className="mt-2">
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  Open full document in the web
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;
