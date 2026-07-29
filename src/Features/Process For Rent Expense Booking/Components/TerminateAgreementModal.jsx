import React, { useState } from 'react'
import { toast } from 'react-toastify'

const TerminateAgreementModal = ({ site, agreement, onClose, onSubmit }) => {
  const [effectiveMonth, setEffectiveMonth] = useState('')
  const [reason, setReason] = useState('')
  const [cancelUnpaid, setCancelUnpaid] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!effectiveMonth) {
      toast.error('Please select effective month of closure.')
      return
    }

    // Validate that the effective month is within the agreement range
    if (agreement) {
      const selected = new Date(effectiveMonth + '-01')
      const start = new Date(agreement.startDate)
      const end = new Date(agreement.endDate)

      const selectedFirstDay = new Date(selected.getFullYear(), selected.getMonth(), 1)
      const startFirstDay = new Date(start.getFullYear(), start.getMonth(), 1)
      const endFirstDay = new Date(end.getFullYear(), end.getMonth(), 1)

      if (selectedFirstDay < startFirstDay || selectedFirstDay > endFirstDay) {
        toast.error(`The closure month must be within the agreement range: ${agreement.startDate} to ${agreement.endDate}`)
        return
      }
    }

    setIsSubmitting(true)
    setTimeout(() => {
      onSubmit({ effectiveMonth, reason, cancelUnpaid })
      setIsSubmitting(false)
    }, 600)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative border border-green-100">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-red-650 text-xl font-bold transition duration-150 focus:outline-none"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2 border-b border-green-100 pb-3 flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          Terminate Rent Agreement
        </h2>
        <p className="text-xs text-gray-505 mb-4 leading-relaxed">
          Prematurely close the lease agreement for <strong className="text-green-700">{site.siteName}</strong>. 
          This will prevent the system scheduler from generating monthly rent vouchers starting from the following month.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5">
              Effective Month of Closure
            </label>
            <input
              type="month"
              value={effectiveMonth}
              onChange={(e) => setEffectiveMonth(e.target.value)}
              className="w-full border border-gray-250 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-gray-50/50"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-650 uppercase tracking-wider mb-1.5">
              Reason for Termination
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border border-gray-250 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition bg-gray-50/50 cursor-pointer"
              required
            >
              <option value="">Select a reason...</option>
              <option value="Office Premises Closed">Office Premises Closed</option>
              <option value="Relocating to Another Premise">Relocating to Another Premise</option>
              <option value="Lease Terminated by Owner">Lease Terminated by Owner</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-start gap-2.5 p-3 bg-red-50/40 rounded-xl border border-red-100/50">
            <input
              type="checkbox"
              id="cancelUnpaid"
              checked={cancelUnpaid}
              onChange={(e) => setCancelUnpaid(e.target.checked)}
              className="mt-1 cursor-pointer accent-red-600 w-4 h-4"
            />
            <label htmlFor="cancelUnpaid" className="text-xs text-gray-600 cursor-pointer select-none">
              <strong className="text-gray-800">Cancel unpaid future vouchers</strong>
              <span className="block text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                Automatically cancel generated vouchers for months after the closure month that are still pending payment.
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-5">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-150 hover:bg-gray-200 text-gray-700 font-semibold text-xs px-4 py-2.5 rounded-lg border border-gray-200 transition"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                'Confirm Termination'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TerminateAgreementModal
