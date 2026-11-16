import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
  X,
  FileSpreadsheet,
  FileText,
  ExternalLink,
  Receipt,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'

const AMInvoiceVerifyModal = ({ isOpen, onClose, invoice, handleUpdateInvoice, isSubmitting }) => {
  const [totalGstAmount, setTotalGstAmount] = useState('')
  const [hsnCode, setHsnCode] = useState('')
  const [hsnSummary, setHsnSummary] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [isIframeLoading, setIsIframeLoading] = useState(true)

  // Safe currency formatter
  const formatINR = (val) => {
    if (val == null || val === '') return '0.00'
    const num = parseFloat(String(val).replace(/[^0-9.-]/g, ''))
    if (isNaN(num)) return '0.00'
    return num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
  }

  useEffect(() => {
    if (invoice) {
      setIsRejecting(false)
      setRemarks('')
      setIsIframeLoading(true)

      // Total GST Amount: prioritize gstAmount, then totalGstAmount, then sum of hsnDetails, then sum of CGST+SGST+IGST, then gstRate
      const extractedGstAmount =
        invoice.gstAmount != null && invoice.gstAmount !== ''
          ? String(invoice.gstAmount)
          : invoice.totalGstAmount != null && invoice.totalGstAmount !== ''
          ? String(invoice.totalGstAmount)
          : Array.isArray(invoice.hsnDetails) && invoice.hsnDetails.length > 0
          ? invoice.hsnDetails
              .reduce((sum, item) => sum + (parseFloat(item.gstAmount) || 0), 0)
              .toFixed(2)
          : parseFloat(invoice.cgstAmount || 0) +
              parseFloat(invoice.sgstAmount || 0) +
              parseFloat(invoice.igstAmount || 0) >
            0
          ? (
              parseFloat(invoice.cgstAmount || 0) +
              parseFloat(invoice.sgstAmount || 0) +
              parseFloat(invoice.igstAmount || 0)
            ).toFixed(2)
          : invoice.gstRate != null
          ? String(invoice.gstRate)
          : ''

      setTotalGstAmount(extractedGstAmount)

      // Extract HSN code(s): prioritize invoice.hsnCode, or join unique codes from hsnDetails
      const extractedHsn =
        invoice.hsnCode ||
        (Array.isArray(invoice.hsnDetails) && invoice.hsnDetails.length > 0
          ? Array.from(
              new Set(
                invoice.hsnDetails
                  .map((item) => item.hsnCode)
                  .filter(Boolean)
              )
            ).join(', ')
          : '')

      setHsnCode(extractedHsn)
      setHsnSummary(invoice.hsnSummary || '')
    }
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
  const hsnItems = Array.isArray(invoice.hsnDetails) ? invoice.hsnDetails : []
  const hasHsnDetails = hsnItems.length > 0
  const poDocs = Array.isArray(invoice.poDocuments) ? invoice.poDocuments : []

  // Financial breakdown values
  const cgst = parseFloat(invoice.cgstAmount || 0)
  const sgst = parseFloat(invoice.sgstAmount || 0)
  const igst = parseFloat(invoice.igstAmount || 0)
  const taxable = parseFloat(invoice.taxableAmount || 0)
  const totalAmount = parseFloat(invoice.totalAmount || 0)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto relative flex flex-col my-auto border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-100 px-5 sm:px-6 py-4 sticky top-0 bg-white/95 backdrop-blur-md z-20">
          <div className="min-w-0 pr-4">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2 flex-wrap">
              <span>Final Approval – {invoice.invoiceNumber || invoice.id}</span>
              <span className="text-xs text-gray-500 font-mono font-normal bg-gray-100 px-2 py-0.5 rounded">
                {invoice.id}
              </span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate">
              Vendor: <span className="font-medium text-gray-700">{invoice.vendorName || '-'}</span>
              {invoice.type && (
                <span className="ml-2 inline-flex items-center px-2 py-0.2 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {invoice.type}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-600 hover:bg-gray-100 p-1.5 rounded-xl transition-all cursor-pointer"
            disabled={isSubmitting}
            aria-label="Close Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-5 text-sm">
          
          {/* Account Executive Approval Status Banner */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 shadow-2xs">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <h3 className="font-bold text-emerald-900 text-sm">Account Executive Review Completed</h3>
                <p className="text-emerald-800">
                  This invoice has been reviewed, GST rates verified, and submitted for final Account Manager approval.
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-gray-600 pt-1">
                  <span>Status: <strong className="text-gray-900">{invoice.status || 'Pending AM Approval'}</strong></span>
                  {invoice.aeRemarks && (
                    <span>AE Remarks: <strong className="text-gray-900">{invoice.aeRemarks}</strong></span>
                  )}
                  {invoice.type && (
                    <span>Type: <strong className="text-gray-900">{invoice.type}</strong></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Special notice for Procurement Prepaid */}
          {invoice.type === 'Procurement Prepaid' && (
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 shadow-2xs">
              <h3 className="font-bold text-purple-900 text-sm mb-1">Procurement Prepaid Invoice</h3>
              <p className="text-xs text-purple-800">
                This is a prepaid expense invoice. Upon final approval, you will be prompted to select the amortization period.
              </p>
            </div>
          )}

          {/* Financial Summary Card */}
          <div className="bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-teal-50/60 border border-green-200/80 rounded-xl p-4 shadow-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-green-100 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Total Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-900 mt-0.5 block">
                  ₹{formatINR(totalAmount)}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-green-100 shadow-2xs">
                <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider block">
                  Taxable Amount
                </span>
                <span className="text-base sm:text-lg font-bold text-gray-800 mt-0.5 block">
                  ₹{formatINR(taxable)}
                </span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-3 rounded-lg border border-green-100 shadow-2xs col-span-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                    Total GST Amount
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                    GST
                  </span>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-0.5">
                  <span className="text-base sm:text-lg font-bold text-emerald-700">
                    ₹{formatINR(totalGstAmount || invoice.gstAmount)}
                  </span>
                  {(cgst > 0 || sgst > 0 || igst > 0) && (
                    <span className="text-[11px] text-gray-500">
                      {igst > 0
                        ? `IGST: ₹${formatINR(igst)}`
                        : `CGST: ₹${formatINR(cgst)} | SGST: ₹${formatINR(sgst)}`}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* GST & HSN Verification Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total GST Amount (Heading & value updated) */}
            <div>
              <label className="block font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
                <span>Total GST Amount (₹)</span>
                {invoice.gstRate != null && (
                  <span className="text-xs font-normal text-gray-500">
                    Rate: {invoice.gstRate}%
                  </span>
                )}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none text-sm font-medium">
                  ₹
                </span>
                <input
                  type="text"
                  value={totalGstAmount || '0.00'}
                  disabled
                  className="w-full border border-gray-200 rounded-xl pl-8 pr-3 py-2.5 bg-gray-50/80 outline-none cursor-not-allowed font-semibold text-gray-700 shadow-2xs"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {hasHsnDetails
                  ? `Verified from ${hsnItems.length} HSN item(s)`
                  : 'Total GST for purchase booking'}
              </p>
            </div>

            {/* HSN Code */}
            <div>
              <label className="block font-semibold text-gray-800 mb-1.5 flex items-center justify-between">
                <span>HSN Code</span>
                {hasHsnDetails && (
                  <span className="text-xs font-normal text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    {hsnItems.length} item(s) below
                  </span>
                )}
              </label>
              <input
                type="text"
                value={hsnCode || '-'}
                disabled
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 bg-gray-50/80 outline-none cursor-not-allowed font-semibold text-gray-700 shadow-2xs"
              />
              <p className="text-[11px] text-gray-500 mt-1">
                HSN code(s) verified by Account Executive
              </p>
            </div>
          </div>

          {/* HSN Details Breakdown Table (When multiple or single HSN items present) */}
          {hasHsnDetails && (
            <div className="border border-emerald-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-3 border-b border-emerald-100 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                  <h3 className="font-bold text-xs sm:text-sm text-emerald-900">
                    HSN Details & Item-wise Breakdown
                  </h3>
                  <span className="bg-emerald-100 text-emerald-800 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                    {hsnItems.length} {hsnItems.length === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <span className="text-xs text-gray-500 hidden sm:inline">
                  Verified item rates from procurement
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left min-w-[540px]">
                  <thead className="bg-gray-50/90 text-gray-600 font-semibold uppercase tracking-wider border-b border-gray-200 text-[11px]">
                    <tr>
                      <th className="px-3.5 py-2.5 text-center w-12">#</th>
                      <th className="px-3.5 py-2.5">HSN Code</th>
                      <th className="px-3.5 py-2.5 text-center">GST Rate</th>
                      <th className="px-3.5 py-2.5 text-right">Taxable Amount</th>
                      <th className="px-3.5 py-2.5 text-right">GST Amount</th>
                      <th className="px-3.5 py-2.5 text-right">Item Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-normal">
                    {hsnItems.map((item, idx) => {
                      const itemTaxable = parseFloat(item.taxableAmount || 0)
                      const itemGst = parseFloat(item.gstAmount || 0)
                      const itemTotal = itemTaxable + itemGst
                      return (
                        <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-3.5 py-2.5 text-center text-gray-400 font-medium">
                            {idx + 1}
                          </td>
                          <td className="px-3.5 py-2.5 font-mono font-semibold text-gray-900">
                            <span className="bg-gray-100 border border-gray-200 px-2 py-0.5 rounded">
                              {item.hsnCode || '-'}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-center">
                            <span className="inline-block bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-100">
                              {item.gstRate != null ? `${item.gstRate}%` : '-'}
                            </span>
                          </td>
                          <td className="px-3.5 py-2.5 text-right text-gray-800 font-medium">
                            ₹{formatINR(itemTaxable)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right text-emerald-700 font-bold">
                            ₹{formatINR(itemGst)}
                          </td>
                          <td className="px-3.5 py-2.5 text-right text-gray-900 font-semibold">
                            ₹{formatINR(itemTotal)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50/80 border-t border-gray-200 font-semibold text-gray-800 text-xs">
                    <tr>
                      <td colSpan={3} className="px-3.5 py-2.5 text-right text-gray-600 uppercase tracking-wider text-[11px]">
                        Total Summary:
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-gray-900 font-bold">
                        ₹{formatINR(hsnItems.reduce((sum, i) => sum + (parseFloat(i.taxableAmount) || 0), 0))}
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-emerald-800 font-extrabold">
                        ₹{formatINR(hsnItems.reduce((sum, i) => sum + (parseFloat(i.gstAmount) || 0), 0))}
                      </td>
                      <td className="px-3.5 py-2.5 text-right text-gray-900 font-extrabold">
                        ₹{formatINR(
                          hsnItems.reduce(
                            (sum, i) =>
                              sum +
                              (parseFloat(i.taxableAmount) || 0) +
                              (parseFloat(i.gstAmount) || 0),
                            0
                          )
                        )}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* HSN Summary */}
          {hsnSummary && (
            <div>
              <label className="block font-medium text-gray-700 mb-1">HSN Summary</label>
              <textarea
                value={hsnSummary}
                disabled
                rows={2}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/80 outline-none cursor-not-allowed text-sm text-gray-600"
              ></textarea>
            </div>
          )}

          {/* Fixed Assets Details */}
          {invoice.type === 'Fixed Asset' && invoice.assetDetails && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm mb-2.5 text-purple-800">Fixed Asset Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Asset Name</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetName || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Asset Category</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.assetCategory || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Location</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                    {invoice.assetDetails.location || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Asset Tag</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-mono">
                    {invoice.assetDetails.assetTag || '-'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* GL Mappings Display */}
          {(mappings.expenseGLCode || mappings.expense_gl_code) && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm mb-2.5 text-emerald-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                <span>GL Account Mappings</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">
                    Expense Account
                  </label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/70 font-mono text-gray-800">
                    <span className="font-bold text-emerald-700">
                      {mappings.expenseGLCode || mappings.expense_gl_code}
                    </span>{' '}
                    – {mappings.expenseGLName || mappings.expense_gl_name || 'HK MATERIALS'}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-gray-600 mb-1">
                    Payable Account
                  </label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/70 font-mono text-gray-800">
                    <span className="font-bold text-blue-700">
                      {mappings.payableGLCode || mappings.payable_gl_code}
                    </span>
                    {mappings.vendorNumber && (
                      <span className="text-gray-500 ml-1">({mappings.vendorNumber})</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attached PO / DC Documents */}
          {poDocs.length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm mb-2 text-gray-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-gray-600" />
                <span>PO & Delivery Challan Documents ({poDocs.length})</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {poDocs.map((doc, idx) => (
                  <a
                    key={idx}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 bg-blue-50/50 hover:bg-blue-100/60 text-blue-700 text-xs font-medium transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>PO {doc.po_number || idx + 1} - Signed DC</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Document Preview */}
          {invoice.documentUrl && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block font-bold text-sm text-gray-800">
                  Invoice Document Preview:
                </label>
                <a
                  href={invoice.documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 text-xs font-semibold underline"
                >
                  <span>Open in new tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="relative w-full h-80 sm:h-96 border border-gray-200 rounded-xl overflow-hidden bg-gray-50 shadow-inner">
                {isIframeLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/90 z-10">
                    <div className="flex items-center gap-2 text-gray-600 text-xs sm:text-sm">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-600 border-t-transparent" />
                      <span>Loading document preview...</span>
                    </div>
                  </div>
                )}
                <iframe
                  src={invoice.documentUrl}
                  title="Invoice PDF"
                  onLoad={() => setIsIframeLoading(false)}
                  className="w-full h-full"
                />
              </div>
            </div>
          )}

          {/* Remarks text input for approval context, or rejection remarks */}
          <div>
            <label className={`block font-semibold mb-1 text-xs uppercase tracking-wider ${
              isRejecting ? 'text-red-700' : 'text-gray-700'
            }`}>
              {isRejecting ? 'Rejection Remarks (Mandatory)' : 'Decision Remarks (Optional)'}
            </label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              disabled={isSubmitting}
              rows={2}
              className={`w-full border rounded-xl px-3 py-2 outline-none text-sm transition-all ${
                isRejecting
                  ? 'border-red-300 focus:ring-2 focus:ring-red-400 bg-red-50/40'
                  : 'border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
              } disabled:bg-gray-100 disabled:cursor-not-allowed`}
              placeholder={isRejecting ? 'Why are you rejecting this invoice? (Mandatory)' : 'Enter approval comments (e.g. Postman E2E / Approved)...'}
            ></textarea>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center gap-3 border-t border-gray-100 px-5 sm:px-6 py-4 sticky bottom-0 bg-white/95 backdrop-blur-md z-20">
          {isSubmitting && (
            <div className="flex items-center text-xs sm:text-sm font-medium text-gray-500 mr-auto">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-emerald-700 border-t-transparent mr-2"></div>
              Posting decision & GL entries...
            </div>
          )}

          {!isRejecting ? (
            <>
              <button
                onClick={() => setIsRejecting(true)}
                className="text-red-600 border border-red-300 hover:bg-red-50 hover:border-red-400 px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                Reject Invoice
              </button>
              <button
                onClick={handleFinalApprove}
                className={`px-5 py-2 rounded-xl text-white font-medium text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer ${
                  invoice.type === 'Procurement Prepaid'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
                disabled={isSubmitting}
              >
                {invoice.type === 'Procurement Prepaid' ? 'Approve & Set Period' : 'Final Approve & Post GL'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsRejecting(false)}
                className="text-gray-600 border border-gray-300 px-4 py-2 rounded-xl hover:bg-gray-100 text-sm font-medium transition-all cursor-pointer"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 text-white font-medium px-5 py-2 rounded-xl text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AMInvoiceVerifyModal
