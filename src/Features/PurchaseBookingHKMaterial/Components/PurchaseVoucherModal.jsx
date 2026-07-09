import React from 'react'
import { FiCheckCircle, FiX, FiPrinter, FiAlertTriangle } from 'react-icons/fi'

// ─────────────────────────────────────────────────────────────────────────────
// Utility helpers
// ─────────────────────────────────────────────────────────────────────────────

const formatAmount = (val) => {
  const num = parseFloat(val ?? 0)
  if (isNaN(num)) return '0.00'
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  try {
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading Overlay
// ─────────────────────────────────────────────────────────────────────────────

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl px-10 py-8 flex flex-col items-center gap-4 shadow-2xl">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-b-green-600" />
      <p className="text-gray-700 font-semibold text-sm">Generating Purchase Voucher…</p>
      <p className="text-gray-400 text-xs">Fetching GL journal entries from ledger</p>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// Error Overlay
// ─────────────────────────────────────────────────────────────────────────────

const ErrorOverlay = ({ error, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-4">
        <FiAlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Voucher</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        {error || 'An unexpected error occurred while loading the purchase voucher.'}
      </p>
      <button
        onClick={onClose}
        className="w-full px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// Main Purchase Voucher Modal
// ─────────────────────────────────────────────────────────────────────────────

const PurchaseVoucherModal = ({ isOpen, onClose, voucher, isLoading, error }) => {
  if (!isOpen) return null
  if (isLoading) return <LoadingOverlay />
  if (error) return <ErrorOverlay error={error} onClose={onClose} />
  if (!voucher) return null

  const breakdown = voucher.breakdown || {}
  const entries = voucher.entries || []
  const totals = voucher.totals || {}

  const totalDebit = parseFloat(totals.totalDebit ?? 0)
  const totalCredit = parseFloat(totals.totalCredit ?? 0)
  const difference = parseFloat(totals.difference ?? Math.abs(totalDebit - totalCredit))
  const isBalanced = difference === 0

  const handlePrint = () => window.print()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 sm:px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-start gap-3">
            <FiCheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">Purchase Voucher — GL Posted</h2>
              <p className="text-green-100 text-xs mt-0.5 font-mono">
                {voucher.voucherNo || '-'} · {voucher.voucherDate || '-'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close purchase voucher"
            className="text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5">

          {/* Success Banner */}
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
            <span className="text-xl flex-shrink-0">✅</span>
            <div>
              <p className="font-semibold text-green-800 text-sm">
                Invoice Approved &amp; GL Entries Posted Successfully
              </p>
              <p className="text-green-600 text-xs mt-1">
                Posted at {formatDateTime(voucher.postedAt)}&nbsp;·&nbsp;
                Status: <span className="font-bold">{voucher.status || '-'}</span>
              </p>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-500 font-medium">Total Amount</p>
              <p className="text-sm sm:text-base font-bold text-blue-800 mt-1">
                ₹{formatAmount(voucher.totalAmount)}
              </p>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-500 font-medium">Taxable Value</p>
              <p className="text-sm sm:text-base font-bold text-amber-800 mt-1">
                ₹{formatAmount(breakdown.taxable)}
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 text-center">
              <p className="text-xs text-purple-500 font-medium">GST Rate</p>
              <p className="text-sm sm:text-base font-bold text-purple-800 mt-1">
                {breakdown.gstRate ?? 0}%
              </p>
            </div>
            <div className={`rounded-xl p-3 text-center border ${isBalanced ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <p className={`text-xs font-medium ${isBalanced ? 'text-green-500' : 'text-red-500'}`}>
                Balance Status
              </p>
              <p className={`text-sm sm:text-base font-bold mt-1 ${isBalanced ? 'text-green-700' : 'text-red-700'}`}>
                {isBalanced ? '✓ Balanced' : '✗ Mismatch'}
              </p>
            </div>
          </div>

          {/* ── Voucher Info Grid ── */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Voucher Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Voucher No.</p>
                <p className="font-semibold text-gray-800 font-mono text-xs sm:text-sm">{voucher.voucherNo || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Transaction ID</p>
                <p className="font-semibold text-gray-800 font-mono text-xs break-all">{voucher.transactionId || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Voucher Type</p>
                <p className="font-semibold text-gray-800">{voucher.voucherType || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Voucher Date</p>
                <p className="font-semibold text-gray-800">{voucher.voucherDate || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Financial Year</p>
                <p className="font-semibold text-gray-800">{voucher.financialYear || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Invoice Reference</p>
                <p className="font-semibold text-gray-800">{voucher.invoiceRef || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Vendor</p>
                <p className="font-semibold text-gray-800">{voucher.vendorName || '-'}</p>
                <p className="text-xs text-gray-400 font-mono mt-0.5">{voucher.vendorGLCode || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">GL Status</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full border border-green-200">
                  ✓ {voucher.status || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* ── GST Breakdown ── */}
          {(breakdown.cgst || breakdown.sgst || breakdown.igst) && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                GST Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Taxable Amount</p>
                  <p className="font-semibold text-gray-800">₹{formatAmount(breakdown.taxable)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">CGST</p>
                  <p className="font-semibold text-indigo-700">₹{formatAmount(breakdown.cgst)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">SGST</p>
                  <p className="font-semibold text-indigo-700">₹{formatAmount(breakdown.sgst)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">IGST</p>
                  <p className="font-semibold text-indigo-700">₹{formatAmount(breakdown.igst)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Journal Entries Table ── */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Double-Entry Journal
            </h3>
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">#</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">GL Code</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Particulars / Narration</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-green-600 uppercase tracking-wide">Debit (₹)</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-red-500 uppercase tracking-wide">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                        No journal entries found.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, idx) => {
                      const debit = parseFloat(entry.debit ?? 0)
                      const credit = parseFloat(entry.credit ?? 0)
                      return (
                        <tr key={entry.lineNo ?? idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-gray-400 text-xs">{entry.lineNo ?? idx + 1}</td>
                          <td className="px-4 py-3 font-mono text-xs text-gray-600 whitespace-nowrap">
                            {entry.glCode || '-'}
                          </td>
                          <td className="px-4 py-3 max-w-xs">
                            <p className="font-medium text-gray-800 text-sm">{entry.glName || '-'}</p>
                            {entry.narration && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate" title={entry.narration}>
                                {entry.narration}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {debit > 0 ? (
                              <span className="font-semibold text-green-700">₹{formatAmount(entry.debit)}</span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-right whitespace-nowrap">
                            {credit > 0 ? (
                              <span className="font-semibold text-red-600">₹{formatAmount(entry.credit)}</span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 border-t-2 border-gray-300">
                    <td colSpan={3} className="px-4 py-3 text-right text-sm font-bold text-gray-700">
                      Grand Total
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700 whitespace-nowrap">
                      ₹{formatAmount(totals.totalDebit)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-600 whitespace-nowrap">
                      ₹{formatAmount(totals.totalCredit)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center">
                      {isBalanced ? (
                        <span className="text-xs text-green-600 font-semibold">
                          ✓ Journal is Balanced — Difference: ₹0.00
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-semibold">
                          ✗ Imbalance Detected — Difference: ₹{formatAmount(difference)}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Narration ── */}
          {voucher.narration && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1">Narration</p>
              <p className="text-sm text-gray-700 leading-relaxed">{voucher.narration}</p>
            </div>
          )}

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 pb-1">
            System-generated Purchase Voucher. All amounts in Indian Rupees (₹).&nbsp;
            Status:&nbsp;<span className="font-semibold text-green-600">{voucher.status}</span>
          </p>
        </div>

        {/* ── Modal Footer ── */}
        <div className="border-t border-gray-100 bg-gray-50 px-5 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
          <p className="text-xs text-gray-400 text-center sm:text-left">
            Posted: {formatDateTime(voucher.postedAt)}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseVoucherModal
