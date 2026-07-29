import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const AMInvoiceVerifyModal = ({ isOpen, onClose, invoice, handleUpdateInvoice, isSubmitting }) => {
  const [gstRate, setGstRate] = useState('')
  const [hsnCode, setHsnCode] = useState('')
  const [hsnSummary, setHsnSummary] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [isIframeLoading, setIsIframeLoading] = useState(true)

  useEffect(() => {
    if (invoice) {
      setGstRate(invoice.gstRate || '')
      setHsnCode(invoice.hsnCode || '')
      setHsnSummary(invoice.hsnSummary || '')
    }
    setIsRejecting(false)
    setRemarks('')
    setIsIframeLoading(true)
  }, [invoice])

  if (!isOpen || !invoice) return null

  const handleFinalApprove = () => {
    if (invoice.type === 'Procurement Prepaid') {
      handleUpdateInvoice(invoice.id, 'Approved', remarks)
      toast.success('Opening prepaid period selection...')
    } else {
      handleUpdateInvoice(invoice.id, 'Approved', remarks)
    }
  }

  const handleReject = () => {
    if (!remarks.trim()) {
      toast.warn('Please provide rejection remarks.')
      return
    }
    handleUpdateInvoice(invoice.id, 'Rejected', remarks)
  }

  // Safe mapping helper for both camelCase and snake_case GL mappings
  const mappings = invoice.vendorGLMappings || invoice.vendor_gl_mappings || {}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold flex items-baseline gap-2">
            <span>Final Approval - {invoice.id}</span>
            <span className="text-xs text-gray-500 font-normal">({invoice.invoiceNumber})</span>
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600" disabled={isSubmitting}>
            X
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-sm">
          {/* Account Executive Approval Status */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">Account Executive Review</h3>
            <p className="text-sm text-green-700">
              This invoice has been approved by the Account Executive.
            </p>
            <p className="text-xs text-gray-600 mt-1">Status: {invoice.status || '-'}</p>
            <p className="text-xs text-gray-600 mt-1">AE Remarks: {invoice.aeRemarks || '-'}</p>
            {invoice.type && (
              <p className="text-xs text-gray-600 mt-1">
                Type: <span className="font-medium">{invoice.type}</span>
              </p>
            )}
          </div>

          {/* Special notice for Procurement Prepaid */}
          {invoice.type === 'Procurement Prepaid' && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Procurement Prepaid Invoice</h3>
              <p className="text-sm text-purple-700">
                This is a prepaid expense invoice. After approval, you will need to select the
                prepaid period for amortization.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">GST Rate (%)</label>
              <input
                type="number"
                value={gstRate || '-'}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 outline-none cursor-not-allowed font-medium text-gray-600"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">HSN Code</label>
              <input
                type="text"
                value={hsnCode || '-'}
                disabled
                className="w-full border rounded px-3 py-2 bg-gray-100 outline-none cursor-not-allowed font-medium text-gray-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">HSN Summary</label>
            <textarea
              value={hsnSummary || '-'}
              disabled
              rows={2}
              className="w-full border rounded px-3 py-2 bg-gray-100 outline-none cursor-not-allowed font-medium text-gray-600"
            ></textarea>
          </div>

          {/* Fixed Assets Details */}
          {invoice.type === 'Fixed Asset' && invoice.assetDetails && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2 text-purple-800">Fixed Asset Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-medium">Asset Name</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetName || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Asset Category</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetCategory || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Location</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.location || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Asset Tag</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetTag || '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Preview */}
          {invoice.documentUrl && (
            <div className="mt-4">
              <label className="block font-semibold mb-2">Invoice Document:</label>
              <div className="relative w-full h-96 border rounded overflow-hidden">
                {isIframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
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
                className="text-green-600 underline text-sm mt-2 inline-block hover:text-green-800 font-semibold"
              >
                Open full document in new tab
              </a>
            </div>
          )}

          {/* Remarks text input for approval context, or rejection remarks */}
          <div>
            <label className="block font-medium mb-1">Decision Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-green-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder={isRejecting ? "Why are you rejecting this invoice? (Mandatory)" : "Enter approval comments (Optional)..."}
            ></textarea>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center gap-3 border-t px-6 py-4">
          {isSubmitting && (
            <div className="flex items-center text-sm font-medium text-gray-500 mr-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-700 mr-2"></div>
              Submitting decision...
            </div>
          )}

          {!isRejecting ? (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="text-red-600 border border-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors duration-200"
                disabled={isSubmitting}
              >
                Reject
              </button>
              <button
                onClick={handleFinalApprove}
                className={`px-4 py-2 rounded-xl text-white font-medium transition-colors duration-200 ${
                  invoice.type === 'Procurement Prepaid'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
                disabled={isSubmitting}
              >
                {invoice.type === 'Procurement Prepaid' ? 'Approve & Set Period' : 'Final Approve'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(false)}
                className="text-gray-600 border border-gray-400 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 font-medium transition-colors duration-200"
                disabled={isSubmitting}
              >
                Confirm Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AMInvoiceVerifyModal
