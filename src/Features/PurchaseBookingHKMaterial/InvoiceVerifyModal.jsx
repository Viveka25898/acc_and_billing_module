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

const InvoiceVerifyModal = ({ isOpen, onClose, invoice, handleUpdateInvoice, isSubmitting }) => {
  const [totalGstAmount, setTotalGstAmount] = useState('')
  const [hsnCode, setHsnCode] = useState('')
  const [hsnSummary, setHsnSummary] = useState('')
  const [siteState, setSiteState] = useState('Maharashtra')
  const [companyState, setCompanyState] = useState('Maharashtra')
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
      setRemarks('')
      setIsRejecting(false)
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
      setSiteState(invoice.site_state || invoice.siteState || 'Maharashtra')
      setCompanyState(invoice.company_state || invoice.companyState || 'Maharashtra')
    }
  }, [invoice])

  if (!isOpen || !invoice) return null

  const handleApprove = () => {
    const trimmedGst = String(totalGstAmount).trim()
    if (!trimmedGst) {
      toast.warn('Please enter or verify the Total GST Amount.')
      return
    }

    const effectiveHsn = hsnCode.trim() ||
      (Array.isArray(invoice.hsnDetails) && invoice.hsnDetails.length > 0
        ? invoice.hsnDetails.map((i) => i.hsnCode).filter(Boolean).join(', ')
        : '')

    if (!effectiveHsn && (!invoice.hsnDetails || invoice.hsnDetails.length === 0)) {
      toast.warn('Please enter a valid HSN Code.')
      return
    }

    const parsedGst = parseFloat(trimmedGst)

    handleUpdateInvoice(invoice.id, 'Approved', {
      // Pass totalGstAmount as gstRate for full backward-compatibility with parseFloat(decisionData.gstRate)
      gstRate: !isNaN(parsedGst) ? parsedGst : (invoice.gstRate || 0),
      totalGstAmount: !isNaN(parsedGst) ? parsedGst : trimmedGst,
      gstAmount: !isNaN(parsedGst) ? parsedGst : trimmedGst,
      hsnCode: effectiveHsn || hsnCode,
      hsnSummary,
      siteState,
      companyState,
      remarks: remarks || 'GST amount and HSN verified'
    })
  }

  const handleReject = () => {
    if (!remarks.trim()) {
      toast.warn('Please provide rejection remarks.')
      return
    }

    const parsedGst = parseFloat(totalGstAmount)

    handleUpdateInvoice(invoice.id, 'Rejected', {
      gstRate: !isNaN(parsedGst) ? parsedGst : 0,
      totalGstAmount: !isNaN(parsedGst) ? parsedGst : 0,
      remarks
    })
  }

  // Safe mapping helper for both camelCase and snake_case GL mappings
  const mappings = invoice.vendorGLMappings || invoice.vendor_gl_mappings || {}
  const hsnItems = Array.isArray(invoice.hsnDetails) ? invoice.hsnDetails : []
  const hasHsnDetails = hsnItems.length > 0
  const poDocs = Array.isArray(invoice.poDocuments) ? invoice.poDocuments : []

  // Check if IGST or CGST/SGST applies
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
              <span>Verify Invoice – {invoice.invoiceNumber || invoice.id}</span>
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

          {/* Core GST & HSN Verification Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Total GST Amount (Heading & value updated as requested) */}
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
                  type="number"
                  step="0.01"
                  value={totalGstAmount}
                  onChange={(e) => setTotalGstAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-xl pl-8 pr-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-gray-900 bg-white shadow-2xs transition-all"
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                {hasHsnDetails
                  ? `Calculated from ${hsnItems.length} HSN item(s)`
                  : 'Total GST applicable for this invoice'}
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
                value={hsnCode}
                onChange={(e) => setHsnCode(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2.5 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm font-semibold text-gray-900 bg-white shadow-2xs transition-all"
                placeholder="e.g., 33443333"
                disabled={isSubmitting}
              />
              <p className="text-[11px] text-gray-500 mt-1">
                HSN code(s) associated with invoice items
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

          {/* Site State and Company State */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Site State</label>
              <input
                type="text"
                value={siteState}
                onChange={(e) => setSiteState(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="e.g., Maharashtra"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">Company State</label>
              <input
                type="text"
                value={companyState}
                onChange={(e) => setCompanyState(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                placeholder="e.g., Maharashtra"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* HSN Summary */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">HSN Summary</label>
            <textarea
              value={hsnSummary}
              onChange={(e) => setHsnSummary(e.target.value)}
              rows={2}
              className="w-full border border-gray-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              placeholder="Write a short summary (optional)..."
              disabled={isSubmitting}
            ></textarea>
          </div>

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

          {/* Fixed Asset Info */}
          {invoice.type === 'Fixed Asset' && invoice.assetDetails && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="font-bold text-sm mb-2.5 text-blue-800">Fixed Asset Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Asset Tag</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-mono font-medium">
                    {invoice.assetDetails.assetTag || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Serial Number</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-mono font-medium">
                    {invoice.assetDetails.serialNumber || '-'}
                  </div>
                </div>
                <div>
                  <label className="block font-medium text-gray-600 mb-1">Location</label>
                  <div className="border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 font-medium">
                    {invoice.assetDetails.location || '-'}
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
                <span>PO Documents ({poDocs.length})</span>
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

          {/* Invoice Document Preview */}
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

          {/* Rejection Remarks */}
          {isRejecting && (
            <div className="mt-4 p-4 bg-red-50/70 border border-red-200 rounded-xl">
              <label className="block font-semibold mb-1 text-red-700 text-xs uppercase tracking-wider">
                Rejection Remarks (Mandatory)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                className="w-full border border-red-300 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-red-400 bg-white text-sm"
                placeholder="Explain why this invoice is being rejected..."
                disabled={isSubmitting}
              ></textarea>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end items-center gap-3 border-t border-gray-100 px-5 sm:px-6 py-4 sticky bottom-0 bg-white/95 backdrop-blur-md z-20">
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
                onClick={handleApprove}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-5 py-2 rounded-xl text-sm shadow-sm transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Approving...' : 'Approve & Forward to AM'}
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

export default InvoiceVerifyModal
