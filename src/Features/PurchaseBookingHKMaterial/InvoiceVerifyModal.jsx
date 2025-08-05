import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const InvoiceVerifyModal = ({ isOpen, onClose, invoice, handleUpdateInvoice }) => {
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
    const updatedInvoice = {
      ...invoice,
      gstRate,
      hsnCode,
      hsnSummary,
    };

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
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">Verify Invoice - {invoice.invoiceNumber}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600">X</button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          <div className="grid md:grid-cols-2 gap-4">
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

          <div>
            <label className="block font-medium mb-1">HSN Summary</label>
            <textarea
              value={hsnSummary}
              onChange={(e) => setHsnSummary(e.target.value)}
              rows={3}
              className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-blue-200"
              placeholder="Write a short summary..."
            ></textarea>
          </div>

          {/* Fixed Asset Info */}
          {invoice.type === "Fixed Asset" && invoice.assetDetails && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2 text-blue-800">Fixed Asset Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-medium">Asset Tag</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetTag || "-"}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Serial Number</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.serialNumber || "-"}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Location</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.location || "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Document Preview */}
          {invoice.documentUrl && (
            <div className="mt-4">
              <label className="block font-semibold mb-2">Invoice Document:</label>
              <div className="relative w-full h-96 border rounded overflow-hidden">
                {isIframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <span className="ml-2 text-gray-600">Loading document...</span>
                  </div>
                )}
                <iframe
                  src={invoice.documentUrl}
                  title="Invoice PDF"
                  onLoad={() => setIsIframeLoading(false)}
                  className="w-full h-full"
                />
              </div>
              <a
                href={invoice.documentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline text-sm mt-2 inline-block"
              >
                Open full document in new tab
              </a>
            </div>
          )}

          {/* Rejection Remarks */}
          {isRejecting && (
            <div className="mt-4">
              <label className="block font-medium mb-1 text-red-600">Rejection Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full border border-red-400 rounded px-3 py-2 outline-none focus:ring focus:ring-red-200"
                placeholder="Why are you rejecting this invoice?"
              ></textarea>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center gap-3 border-t px-6 py-4">
          {!isRejecting ? (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="text-red-600 border border-red-600 hover:bg-red-100 px-4 py-2 rounded"
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve
              </button>
            </>
          ) : (
            <>
              <button
                onClick={onClose}
                className="text-gray-600 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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

export default InvoiceVerifyModal;
