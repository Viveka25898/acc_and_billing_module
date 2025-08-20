/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const VerifyInvoiceModal = ({ isOpen, onClose, invoice, handleUpdateInvoice }) => {
  const [gstRate, setGstRate] = useState("");
  const [hsnCode, setHsnCode] = useState("");
  const [hsnSummary, setHsnSummary] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);
  const [remarks, setRemarks] = useState("");
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  useEffect(() => {
    if (invoice) {
      setRemarks("");
      setIsRejecting(false);
      setGstRate(invoice.gstRate?.toString() || "");
      setHsnCode(invoice.hsnCode || "");
      setHsnSummary(invoice.hsnSummary || "");
    }
  }, [invoice]);

  if (!isOpen || !invoice) return null;

  const handleApprove = () => {
    const updatedInvoice = { ...invoice, gstRate, hsnCode, hsnSummary };
    handleUpdateInvoice(updatedInvoice.id, "Approved", null, updatedInvoice);
    onClose();
    toast.success("Invoice approved successfully!");
  };

  const handleReject = () => {
    if (!remarks.trim()) {
      toast.warn("Please provide rejection remarks.");
      return;
    }
    handleUpdateInvoice(invoice.id, "Rejected", remarks);
    onClose();
    toast.error("Invoice rejected successfully!");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-2 sm:px-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md sm:max-w-xl shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Verify Invoice - {invoice.invoiceNumber}
        </h2>

        {/* Invoice Basic Info */}
        <div className="space-y-1 text-sm mb-4">
          <p><strong>Invoice No:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Vendor:</strong> {invoice.vendorName}</p>
          <p><strong>PO No:</strong> {invoice.poNo}</p>
          <p><strong>GSTIN:</strong> {invoice.gstin}</p>
          <p><strong>Amount:</strong> ₹{invoice.amount}</p>
        </div>

        {/* Editable Fields */}
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block font-medium mb-1">GST Rate (%)</label>
            <input
              type="number"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              placeholder="e.g., 18"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">HSN Code</label>
            <input
              type="text"
              value={hsnCode}
              onChange={(e) => setHsnCode(e.target.value)}
              className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              placeholder="e.g., 998314"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">HSN Summary</label>
          <textarea
            value={hsnSummary}
            onChange={(e) => setHsnSummary(e.target.value)}
            rows={3}
            className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-blue-200"
            placeholder="Write a short summary..."
          ></textarea>
        </div>

        {/* Invoice Document Preview */}
        {invoice.documentUrl && (
          <div className="border rounded mb-4 h-64 sm:h-72 overflow-hidden relative">
            {isIframeLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                <span className="text-gray-600">Loading document...</span>
              </div>
            )}
            <iframe
              src={invoice.documentUrl}
              title="Invoice Preview"
              width="100%"
              height="100%"
              className="rounded"
              onLoad={() => setIsIframeLoading(false)}
            ></iframe>
          </div>
        )}

        {/* Open Full Doc Link */}
        <a
          href={invoice.documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm mb-4 inline-block"
        >
          🔗 Open Full Document in Web
        </a>

        {/* Rejection Remarks */}
        {isRejecting && (
          <div className="mb-4">
            <label className="block font-medium mb-1 text-red-600">
              Rejection Remarks
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full border border-red-400 rounded px-3 py-2 outline-none focus:ring focus:ring-red-200"
              placeholder="Why are you rejecting this invoice?"
            ></textarea>
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex flex-wrap justify-end gap-3">
          {!isRejecting ? (
            <>
              {/* <button
                onClick={() => setIsRejecting(true)}
                className="text-red-600 border border-red-600 hover:bg-red-100 px-4 py-2 rounded text-sm"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                Approve
              </button> */}
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 text-sm"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="text-gray-600 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Confirm Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyInvoiceModal;
