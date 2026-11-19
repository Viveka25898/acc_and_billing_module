import React, { useState, useEffect } from 'react'
import { formatAmountINR, formatDateDMY } from '../config/nonPoExpenseConfig'
import { openAttachmentInNewTab } from '../utils/documentViewerHelper'

const NonPoGstEntryModal = ({
  isOpen,
  onClose,
  claim,
  onGenerateVoucher,
}) => {
  const [totalGstAmount, setTotalGstAmount] = useState('')
  const [gstType, setGstType] = useState('intra') // 'intra' (CGST+SGST) | 'inter' (IGST)
  const [error, setError] = useState('')

  // Initialize defaults whenever claim changes
  useEffect(() => {
    if (claim) {
      setError('')
      setGstType('intra')
      if (claim.isGstBill === 'Yes') {
        // default estimate: if user wants to type or if amount has standard 18% inclusive
        const total = Number(claim.amountRequested || 0)
        // Leave empty so AM enters exact value from bill, or provide default suggestion
        setTotalGstAmount('')
      } else {
        setTotalGstAmount('0')
      }
    }
  }, [claim, isOpen])

  if (!isOpen || !claim) return null

  const totalAmount = Number(claim.amountRequested || 0)
  const gstNum = parseFloat(totalGstAmount) || 0
  const baseExpense = Math.max(0, totalAmount - gstNum)

  const cgstAmount = gstType === 'intra' ? gstNum / 2 : 0
  const sgstAmount = gstType === 'intra' ? gstNum / 2 : 0
  const igstAmount = gstType === 'inter' ? gstNum : 0

  const handleProceed = () => {
    if (claim.isGstBill === 'Yes') {
      if (totalGstAmount === '' || isNaN(gstNum)) {
        setError('Please enter the total GST amount shown on the bill (enter 0 if no GST).')
        return
      }
      if (gstNum < 0) {
        setError('GST amount cannot be negative.')
        return
      }
      if (gstNum >= totalAmount) {
        setError('GST amount must be less than the total bill amount.')
        return
      }
    }

    setError('')
    onGenerateVoucher({
      claim,
      totalAmount,
      totalGstAmount: gstNum,
      baseExpense,
      gstType,
      cgstAmount,
      sgstAmount,
      igstAmount,
    })
  }

  // Find first invoice/bill attachment if available
  const billAttachment = claim.attachments?.find(
    (a) => a.type === 'Invoice' || /\.(pdf|jpg|jpeg|png)$/i.test(a.fileName)
  ) || claim.attachments?.[0]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-gray-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🧾</span>
            <div>
              <h3 className="text-base sm:text-lg font-bold tracking-tight">
                Step 1: GST Verification & Voucher Input
              </h3>
              <p className="text-xs text-green-100">
                Claim: <span className="font-mono font-semibold">{claim.claimId}</span> • Accounts Manager Final Approval
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition text-lg leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-gray-700">

          {/* Claim & Vendor Information Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-2">
              <div>
                <span className="text-[11px] text-gray-400 block uppercase font-bold tracking-wider">
                  Site & Cost Centre
                </span>
                <span className="font-bold text-gray-800">{claim.siteName}</span>
                <span className="text-gray-500 font-mono text-xs ml-1.5">({claim.costCentre})</span>
              </div>

              {billAttachment && (
                <button
                  type="button"
                  onClick={() => openAttachmentInNewTab(billAttachment, claim)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 hover:text-green-900 bg-green-50 hover:bg-green-100 border border-green-200 px-2.5 py-1 rounded-lg transition cursor-pointer"
                  title="Open attached invoice bill in new tab"
                >
                  <span>👁️</span>
                  <span>View Attached Bill ↗</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Beneficiary / Payee:</span>
                <span className="font-semibold text-gray-800">{claim.accountHolderName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Vendor GSTIN:</span>
                <span className="font-mono font-bold text-gray-800">
                  {claim.vendorGstin || 'Not Provided / Non-GST'}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Vendor Invoice No:</span>
                <span className="font-mono font-semibold text-gray-800">
                  {claim.invoiceNumber || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Total Claim Amount Strip */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 font-medium block">Total Claim Amount</span>
              <span className="text-2xl font-black text-green-800 tracking-tight">
                {formatAmountINR(totalAmount)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-500 font-medium block">Bill Category</span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                  claim.isGstBill === 'Yes'
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : 'bg-gray-100 text-gray-700 border-gray-300'
                }`}
              >
                {claim.isGstBill === 'Yes' ? 'GST Tax Invoice' : 'Non-GST / Cash Memo'}
              </span>
            </div>
          </div>

          {/* GST Input Section */}
          {claim.isGstBill === 'Yes' ? (
            <div className="bg-white border-2 border-green-500/40 rounded-xl p-5 space-y-4 shadow-2xs">
              <div>
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Enter Total GST Amount (₹) <span className="text-red-500">*</span></span>
                  <span className="text-[11px] font-normal text-gray-500">
                    Type exact GST amount printed on the vendor bill
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-base">
                    ₹
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={totalAmount}
                    value={totalGstAmount}
                    onChange={(e) => {
                      setTotalGstAmount(e.target.value)
                      setError('')
                    }}
                    placeholder="e.g. 1800.00"
                    className="w-full pl-8 pr-4 py-2.5 text-base font-bold text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50/50"
                  />
                </div>
                {error && <p className="text-xs text-red-600 font-medium mt-1">{error}</p>}
              </div>

              {/* Tax Type: Intra-State vs Inter-State */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Tax Supply Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setGstType('intra')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      gstType === 'intra'
                        ? 'bg-green-50/80 border-green-500 ring-1 ring-green-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      <span className={gstType === 'intra' ? 'text-green-600' : 'text-gray-400'}>●</span>
                      Intra-State (Same State)
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Splits 50/50 to <strong>CGST</strong> + <strong>SGST</strong> Input Credit
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGstType('inter')}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      gstType === 'inter'
                        ? 'bg-green-50/80 border-green-500 ring-1 ring-green-500'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                      <span className={gstType === 'inter' ? 'text-green-600' : 'text-gray-400'}>●</span>
                      Inter-State (Other State)
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Applies 100% to <strong>IGST</strong> Input Credit
                    </p>
                  </button>
                </div>
              </div>

              {/* Live Accounting Split Preview */}
              {gstNum > 0 && (
                <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200 text-xs space-y-1.5">
                  <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider block mb-1">
                    Auto-Calculated Ledger Entries Preview
                  </span>
                  <div className="flex justify-between items-center text-gray-700">
                    <span>Base Expense (X2003001 - Non PO Expense Ledger):</span>
                    <span className="font-bold text-gray-900">{formatAmountINR(baseExpense)}</span>
                  </div>

                  {gstType === 'intra' ? (
                    <>
                      <div className="flex justify-between items-center text-emerald-700">
                        <span>CGST Input (A3007001001 - CGST input @ 50%):</span>
                        <span className="font-bold">{formatAmountINR(cgstAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-emerald-700">
                        <span>SGST Input (A3007001002 - SGST input @ 50%):</span>
                        <span className="font-bold">{formatAmountINR(sgstAmount)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center text-blue-700">
                      <span>IGST Input (A3007001003 - IGST input @ 100%):</span>
                      <span className="font-bold">{formatAmountINR(igstAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center border-t border-gray-300 pt-1.5 font-bold text-gray-900">
                    <span>Total Liability (L2001003 - Non PO Liability Ledger):</span>
                    <span className="text-green-800">{formatAmountINR(totalAmount)}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Non-GST Informational Banner */
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-sm">
                <span>ℹ️</span> Non-GST Expense Booking
              </div>
              <p>
                This claim was submitted as a Non-GST / Cash Memo expense. 100% of the claim amount (
                <strong>{formatAmountINR(totalAmount)}</strong>) will be booked directly to{' '}
                <strong>Non PO Expense Ledger (X2003001)</strong> with ₹0 GST.
              </p>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-2xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleProceed}
            className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <span>Generate Expense Voucher ➔</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default NonPoGstEntryModal
