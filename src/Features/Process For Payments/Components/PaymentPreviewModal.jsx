import React from 'react'
import { FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa'

const PaymentPreviewModal = ({ data, onClose, onAccept, onRequestChanges }) => {
  if (!data || data.length === 0) return null

  // Helpers to support both API camelCase responses and Excel parsed object keys
  const getVendorName = (row) => row.vendorName || row['Vendor Name'] || row.vendor_name || ''
  const getInvoiceNumbers = (row) =>
    row.invoiceNumbers || row['Invoice Numbers'] || row.invoice_numbers || ''
  const getPaymentAmount = (row) => {
    const val =
      row.paymentDone ?? row['Payment Done'] ?? row.totalAmount ?? row['Total Amount'] ?? row.amount
    return Number(val)
  }
  const getUtr = (row) => row.utr || row['UTR'] || row['utr'] || ''

  // Helper to validate and calculate totals
  const totalAmount = data.reduce((sum, row) => {
    const amt = getPaymentAmount(row)
    return sum + (isNaN(amt) ? 0 : amt)
  }, 0)

  // Identify any rows missing critical data
  const hasErrors = data.some((row) => {
    const name = getVendorName(row)
    const inv = getInvoiceNumbers(row)
    const amt = getPaymentAmount(row)
    return !name || !inv || isNaN(amt)
  })

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg text-sm">📊</span>
              Payment Data Preview
            </h2>
            <p className="text-green-100 text-sm mt-1">
              Review {data.length} vendor entry(s) before confirming.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Warning Banner */}
        {hasErrors && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mx-6 mt-4 rounded-r-lg flex items-start gap-3">
            <FaExclamationTriangle className="text-orange-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-orange-800">Invalid Data Detected</p>
              <p className="text-xs text-orange-700 mt-0.5">
                Some rows are missing Vendor Names, Invoice Numbers, or have invalid amounts. Press "Edit" to fix them.
              </p>
            </div>
          </div>
        )}

        {/* Table Body */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50/50">
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 w-12 text-center">#</th>
                    <th className="px-4 py-3">Vendor Name</th>
                    <th className="px-4 py-3">Invoice Numbers</th>
                    <th className="px-4 py-3">UTR No.</th>
                    <th className="px-4 py-3 text-right">Payment Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((row, index) => {
                    const vendorName = getVendorName(row)
                    const invoiceNumbers = getInvoiceNumbers(row)
                    const amt = getPaymentAmount(row)
                    const utr = getUtr(row)

                    const isError = !vendorName || !invoiceNumbers || isNaN(amt)
                    return (
                      <tr
                        key={index}
                        className={`hover:bg-gray-50 transition-colors ${
                          isError ? 'bg-orange-50/30' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-center text-gray-400 text-xs">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3">
                          {vendorName ? (
                            <span className="font-medium text-gray-800">{vendorName}</span>
                          ) : (
                            <span className="text-orange-500 italic text-xs">Missing</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                          {invoiceNumbers || (
                            <span className="text-orange-500 italic font-sans">Missing</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                          {utr || '-'}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">
                          {isNaN(amt) ? (
                            <span className="text-orange-500 italic text-xs">Invalid</span>
                          ) : (
                            amt.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
                <tfoot className="bg-green-50/50 border-t border-gray-200 font-semibold">
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right text-green-800">
                      Total Uploaded Amount:
                    </td>
                    <td className="px-4 py-3 text-right text-green-700 font-bold text-base">
                      ₹{totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 bg-white p-4 flex justify-end gap-3 rounded-b-2xl">
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
                : 'bg-green-600 text-white hover:bg-green-700 hover:shadow active:scale-95'
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

export default PaymentPreviewModal
