import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const InvoiceVerifyModal = ({ isOpen, onClose, invoice, handleUpdateInvoice, isSubmitting }) => {
  const [gstRate, setGstRate] = useState('')
  const [hsnCode, setHsnCode] = useState('')
  const [hsnSummary, setHsnSummary] = useState('')
  const [siteState, setSiteState] = useState('Maharashtra')
  const [companyState, setCompanyState] = useState('Maharashtra')
  const [isRejecting, setIsRejecting] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [isIframeLoading, setIsIframeLoading] = useState(true)

  useEffect(() => {
    if (invoice) {
      setRemarks('')
      setIsRejecting(false)
      setGstRate(invoice.gstRate?.toString() || '')
      setHsnCode(invoice.hsnCode || '')
      setHsnSummary(invoice.hsnSummary || '')
      setSiteState('Maharashtra')
      setCompanyState('Maharashtra')
    }
  }, [invoice])

  if (!isOpen || !invoice) return null

  const handleApprove = () => {
    if (!gstRate) {
      toast.warn('Please enter a valid GST Rate.')
      return
    }
    if (!hsnCode) {
      toast.warn('Please enter a valid HSN Code.')
      return
    }

    handleUpdateInvoice(invoice.id, 'Approved', {
      gstRate,
      hsnCode,
      hsnSummary,
      siteState,
      companyState,
      remarks: remarks || 'GST rate and HSN verified'
    })
  }

  const handleReject = () => {
    if (!remarks.trim()) {
      toast.warn('Please provide rejection remarks.')
      return
    }

    handleUpdateInvoice(invoice.id, 'Rejected', {
      gstRate: gstRate || '0',
      remarks
    })
  }

  // Safe mapping helper for both camelCase and snake_case GL mappings
  const mappings = invoice.vendorGLMappings || invoice.vendor_gl_mappings || {}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold flex items-baseline gap-2">
            <span>Verify Invoice - {invoice.id}</span>
            <span className="text-xs text-gray-500 font-normal">({invoice.invoiceNumber})</span>
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-red-600" disabled={isSubmitting}>
            X
          </button>
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">Site State</label>
              <input
                type="text"
                value={siteState}
                onChange={(e) => setSiteState(e.target.value)}
                className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-blue-200"
                placeholder="e.g., Maharashtra"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Company State</label>
              <input
                type="text"
                value={companyState}
                onChange={(e) => setCompanyState(e.target.value)}
                className="w-full border rounded px-3 py-2 outline-none focus:ring focus:ring-blue-200"
                placeholder="e.g., Maharashtra"
                disabled={isSubmitting}
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
              disabled={isSubmitting}
            ></textarea>
          </div>

          {/* GL Mappings Display */}
          {(mappings.expenseGLCode || mappings.expense_gl_code) && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2 text-green-800">GL Mappings</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-medium">Expense Account</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {mappings.expenseGLCode || mappings.expense_gl_code} - {mappings.expenseGLName || mappings.expense_gl_name || 'HK MATERIALS'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Payable Account</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {mappings.payableGLCode || mappings.payable_gl_code}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fixed Asset Info */}
          {invoice.type === 'Fixed Asset' && invoice.assetDetails && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-base mb-2 text-blue-800">Fixed Asset Details</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="block font-medium">Asset Tag</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetTag || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Serial Number</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.serialNumber || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium">Location</label>
                  <div className="border rounded px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.location || '-'}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              >
                Reject
              </button>
              <button
                onClick={handleApprove}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Approving...' : 'Approve'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(false)}
                className="text-gray-600 border border-gray-400 px-4 py-2 rounded hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:bg-red-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Reject'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvoiceVerifyModal
