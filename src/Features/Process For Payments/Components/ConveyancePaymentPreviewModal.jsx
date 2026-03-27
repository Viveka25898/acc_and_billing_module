import React from 'react'
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

const ConveyancePaymentPreviewModal = ({ data, onClose, onAccept }) => {
  if (!data || data.length === 0) return null

  const totalAmount = data.reduce((sum, row) => sum + (Number(row.Amount) || 0), 0)
  
  const hasErrors = data.some(
    (row) => !row['Employee Name'] || isNaN(row.Amount) || row.Amount <= 0
  )

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex justify-between items-center text-white shrink-0">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg text-sm">🛵</span>
              Conveyance Bank Processing Preview
            </h2>
            <p className="text-purple-100 text-sm mt-1">Review {data.length} UTR entries from the bank file.</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {hasErrors && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mx-6 mt-4 rounded-r-lg flex items-start gap-3 shrink-0">
            <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-800">Invalid Bank File Data Detected</p>
              <p className="text-xs text-orange-700 mt-0.5">
                Some rows are missing Employee Names or have invalid amounts. Fix the Excel file and re-upload.
              </p>
            </div>
          </div>
        )}

        {/* Table Body */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50/50 custom-scrollbar">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-center w-12 text-xs uppercase tracking-wide">#</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wide">Employee Name</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wide">Client</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wide text-right">Payment Amount (₹)</th>
                    <th className="px-4 py-3 text-xs uppercase tracking-wide">Bank UTR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, index) => {
                    const rowError = !row['Employee Name'] || isNaN(row.Amount) || row.Amount <= 0
                    return (
                      <tr key={index} className={`hover:bg-gray-50 transition-colors ${rowError ? 'bg-orange-50/30' : ''}`}>
                        <td className="px-4 py-3 text-center text-gray-400 text-xs">{index + 1}</td>
                        <td className="px-4 py-3">
                          {row['Employee Name'] ? (
                            <span className="font-medium text-gray-800">{row['Employee Name']}</span>
                          ) : (
                            <span className="text-orange-500 italic text-xs">Missing</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-600">{row.Client || 'N/A'}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          {isNaN(row.Amount) || row.Amount <= 0 ? (
                            <span className="text-orange-500 italic text-xs">Invalid</span>
                          ) : (
                            Number(row.Amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-purple-700">
                          {row.UTR || <span className="text-orange-500 italic font-medium font-sans">Missing UTR</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-purple-50/50 border-t border-gray-200 font-semibold sticky bottom-0 z-10">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-purple-800">
                      Total Uploaded Amount:
                    </td>
                    <td className="px-4 py-3 text-right text-purple-700 font-bold text-base bg-purple-100/30">
                      ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="bg-purple-100/30"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-white p-4 flex justify-end gap-3 rounded-b-2xl shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onAccept(data)}
            disabled={hasErrors}
            className={`flex items-center gap-2 px-6 py-2.5 font-semibold text-sm rounded-xl transition-all shadow-sm ${
              hasErrors
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow active:scale-95'
            }`}
          >
            <FaCheck />
            Looks Good, Accept
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConveyancePaymentPreviewModal
