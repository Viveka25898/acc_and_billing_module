import React from 'react'

const NonPoConfirmDialog = ({
  isOpen,
  title = 'Confirm Submission',
  message,
  details = [],
  confirmLabel = 'Confirm & Submit',
  cancelLabel = 'Go Back',
  onConfirm,
  onCancel,
  isSubmitting = false,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-4 text-white">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🛡️</span> {title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {message && <p className="text-sm text-gray-600 leading-relaxed">{message}</p>}

          {details && details.length > 0 && (
            <div className="bg-green-50/70 border border-green-100 rounded-xl p-3.5 space-y-2 text-sm">
              {details.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs sm:text-sm">
                  <span className="text-gray-500 font-medium">{item.label}:</span>
                  <span className="font-semibold text-gray-800 text-right">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-100 transition disabled:opacity-50 cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="px-5 py-2 text-sm font-semibold text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Processing...
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NonPoConfirmDialog
