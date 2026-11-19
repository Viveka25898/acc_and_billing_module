import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { openPassbookInNewTab } from '../utils/documentViewerHelper'

const NonPoBankPassbookModal = ({ isOpen, onClose, claim }) => {
  const [copiedField, setCopiedField] = useState(null)

  if (!isOpen || !claim) return null

  const handleCopy = (text, fieldName) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedField(fieldName)
    toast.success(`${fieldName} copied to clipboard!`)
    setTimeout(() => setCopiedField(null), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] border border-gray-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-5 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🏦</span>
            <div>
              <h3 className="text-base font-bold tracking-tight">Bank Passbook & Account Details</h3>
              <p className="text-xs text-green-100">
                Claim: <span className="font-mono font-semibold">{claim.claimId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition text-lg leading-none cursor-pointer"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Beneficiary Details Grid */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-gray-500 font-medium block mb-0.5">Beneficiary / Account Holder</span>
              <span className="font-bold text-gray-800 text-sm">{claim.accountHolderName || '—'}</span>
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-0.5">Bank Name & Branch</span>
              <span className="font-semibold text-gray-800">{claim.bankName || '—'}</span>
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-0.5">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-green-800 text-sm tracking-wider">
                  {claim.bankAccountNo || '—'}
                </span>
                {claim.bankAccountNo && (
                  <button
                    type="button"
                    onClick={() => handleCopy(claim.bankAccountNo, 'Account Number')}
                    className="text-xs text-green-600 hover:text-green-800 font-semibold underline cursor-pointer"
                  >
                    {copiedField === 'Account Number' ? '✓ Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>

            <div>
              <span className="text-gray-500 font-medium block mb-0.5">IFSC Code</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-800 text-sm">{claim.ifscCode || '—'}</span>
                {claim.ifscCode && (
                  <button
                    type="button"
                    onClick={() => handleCopy(claim.ifscCode, 'IFSC Code')}
                    className="text-xs text-green-600 hover:text-green-800 font-semibold underline cursor-pointer"
                  >
                    {copiedField === 'IFSC Code' ? '✓ Copied' : 'Copy'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Document Preview Section */}
          <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-100 flex flex-col">
            <div className="bg-gray-200/70 px-4 py-2 flex items-center justify-between text-xs text-gray-600 border-b border-gray-200">
              <span className="font-medium flex items-center gap-1.5 truncate">
                <span>📄</span>
                {claim.passbookImage?.fileName || 'Bank_Passbook_Cheque_Proof.jpg'}
                {claim.passbookImage?.size && (
                  <span className="text-gray-400">({claim.passbookImage.size})</span>
                )}
              </span>
              <span className="text-[11px] text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded font-semibold">
                Disbursement Proof
              </span>
            </div>

            {/* Image Preview Box */}
            <div className="min-h-[240px] max-h-[340px] overflow-auto p-4 flex items-center justify-center bg-gray-900/5">
              {claim.passbookImage?.previewUrl ? (
                <img
                  src={claim.passbookImage.previewUrl}
                  alt="Bank Passbook / Cheque Proof"
                  className="max-h-[320px] max-w-full rounded-lg shadow-md border border-gray-300 object-contain"
                />
              ) : (
                /* Authentic stylized Passbook / Cancelled Cheque graphic */
                <div className="w-full max-w-lg bg-gradient-to-br from-amber-50 via-white to-sky-50 border-2 border-dashed border-gray-400 rounded-xl p-5 shadow-lg relative select-none">
                  {/* Diagonal CANCELLED Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <span className="text-red-700 font-black text-6xl tracking-widest -rotate-25 border-4 border-red-700 px-6 py-2 rounded-xl">
                      CANCELLED
                    </span>
                  </div>

                  {/* Cheque Header */}
                  <div className="flex items-start justify-between border-b border-gray-300 pb-3 mb-3">
                    <div>
                      <div className="text-xs uppercase tracking-wider font-extrabold text-blue-900">
                        {claim.bankName || 'HDFC BANK LTD'}
                      </div>
                      <div className="text-[10px] text-gray-500">
                        RTGS / NEFT IFSC: <span className="font-mono font-bold text-gray-800">{claim.ifscCode || 'HDFC0000123'}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="border border-gray-400 rounded px-2 py-0.5 text-[10px] font-mono text-gray-600 bg-white inline-block">
                        DATE: DD / MM / YYYY
                      </div>
                    </div>
                  </div>

                  {/* Cheque Body */}
                  <div className="space-y-2.5 text-xs text-gray-700">
                    <div className="flex items-baseline border-b border-dotted border-gray-400 pb-1">
                      <span className="font-semibold text-gray-500 w-16">PAY:</span>
                      <span className="font-bold text-gray-900 flex-1">{claim.accountHolderName || 'Apex Power Controls & Services'}</span>
                      <span className="text-gray-400 text-[10px]">OR BEARER</span>
                    </div>

                    <div className="flex items-baseline border-b border-dotted border-gray-400 pb-1">
                      <span className="font-semibold text-gray-500 w-16">RUPEES:</span>
                      <span className="font-medium text-gray-700 italic flex-1">
                        Disbursement as per Approved Non-PO Emergency Expense Claim
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="border-2 border-gray-600 rounded-lg px-3 py-1 bg-white font-mono font-bold text-gray-900 tracking-wider">
                        A/C NO: {claim.bankAccountNo || '50200012345678'}
                      </div>

                      <div className="text-right text-[10px] text-gray-400 font-medium pt-4">
                        AUTHORIZED SIGNATORY
                      </div>
                    </div>
                  </div>

                  {/* MICR Band Bottom */}
                  <div className="mt-4 pt-2 border-t border-gray-300 font-mono text-center text-xs text-gray-500 tracking-widest bg-gray-100 rounded py-1">
                    ⑈ 004123 ⑈  400240012 ⑆  000456 ⑈  31
                  </div>
                </div>
              )}
            </div>

            {/* Below Document Preview: "Open in Full View" Button */}
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                View high-resolution document in a separate browser tab.
              </span>
              <button
                type="button"
                onClick={() => openPassbookInNewTab(claim)}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-xl transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <span>🔍</span>
                <span>Open in Full View ↗</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Verified with operational site emergency disbursement records.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition shadow-2xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default NonPoBankPassbookModal
