import React, { useState } from 'react'
import { formatAmountINR, VALIDATION_LIMITS } from '../config/nonPoExpenseConfig'

const NonPoRejectModal = ({ isOpen, onClose, claim, onConfirmReject, isRejecting }) => {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !claim) return null

  const handleConfirm = () => {
    const trimmed = reason.trim()
    if (!trimmed) {
      setError('Rejection reason is mandatory.')
      return
    }
    if (trimmed.length < VALIDATION_LIMITS.REJECTION_MIN) {
      setError(`Rejection reason must be at least ${VALIDATION_LIMITS.REJECTION_MIN} characters.`)
      return
    }

    setError('')
    onConfirmReject(claim.claimId, trimmed)
  }

  const handleClose = () => {
    if (isRejecting) return
    setReason('')
    setError('')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col border border-red-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="text-base font-bold tracking-tight">Reject Non-PO Expense Claim</h3>
              <p className="text-xs text-red-100">
                Claim: <span className="font-mono font-semibold">{claim.claimId}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isRejecting}
            className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-1.5 transition text-lg leading-none disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Claim Summary Card */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-3.5 text-xs grid grid-cols-2 gap-2 text-gray-700">
            <div>
              <span className="text-gray-400 block text-[11px]">Requester:</span>
              <span className="font-semibold text-gray-900">{claim.employeeName}</span> ({claim.requesterRole})
            </div>
            <div>
              <span className="text-gray-400 block text-[11px]">Requested Amount:</span>
              <span className="font-bold text-red-700 text-sm">{formatAmountINR(claim.amountRequested)}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 block text-[11px]">Site & Expense:</span>
              <span className="font-medium">{claim.siteName}</span> • <span className="text-gray-600">{claim.expenseType}</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
            <span className="text-sm">ℹ️</span>
            <span>
              <strong>Note:</strong> Rejection is final and terminal. The claim cannot be re-opened. The requester will receive this rejection reason.
            </span>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Rejection Reason <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                if (error) setError('')
              }}
              placeholder="State clear reasons for rejection (e.g., Routine maintenance expense must follow standard PO cycle; lack of incident photos; bank account mismatch)..."
              className={`w-full text-xs sm:text-sm border rounded-xl p-3 focus:outline-none focus:ring-2 transition ${error
                  ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                  : 'border-gray-300 focus:ring-red-500 focus:border-red-500'
                }`}
            />
            <div className="flex items-center justify-between mt-1 text-[11px]">
              <span className={error ? 'text-red-600 font-medium' : 'text-gray-400'}>
                {error || `Minimum ${VALIDATION_LIMITS.REJECTION_MIN} characters required`}
              </span>
              <span className="text-gray-400 font-mono">{reason.length} / 1000</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isRejecting}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition disabled:opacity-50 shadow-2xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isRejecting}
            className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 active:scale-[0.98] rounded-xl transition flex items-center gap-2 disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {isRejecting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Rejecting...
              </>
            ) : (
              '✕ Confirm Rejection'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NonPoRejectModal
