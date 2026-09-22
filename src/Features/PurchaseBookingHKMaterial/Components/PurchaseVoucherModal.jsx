import React from 'react'
import { FiCheckCircle, FiX, FiAlertTriangle } from 'react-icons/fi'

// ─────────────────────────────────────────────────────────────────────────────
// Safe Formatters with Try-Catch (Strictly formatting backend values)
// ─────────────────────────────────────────────────────────────────────────────

const formatAmount = (val) => {
  try {
    if (val === null || val === undefined || val === '') return '0.00'
    const cleanVal = typeof val === 'string' ? val.replace(/,/g, '') : val
    const num = Number(cleanVal)
    if (isNaN(num)) return '0.00'
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  } catch (err) {
    console.error('Error formatting amount:', err)
    return '0.00'
  }
}

const formatDateTime = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return String(dateStr)
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (err) {
    console.error('Error formatting date:', err)
    return String(dateStr)
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GL Code Classifier
// ─────────────────────────────────────────────────────────────────────────────

const getGLCategory = (glCode = '') => {
  try {
    const code = String(glCode || '').toUpperCase()
    if (code.startsWith('A1') || code.includes('_FA') || code.includes('EQUIPMENT') || code.includes('ASSET')) {
      return {
        label: 'Fixed Asset',
        badgeClass: 'bg-purple-100 text-purple-800 border-purple-200',
        dotClass: 'bg-purple-600'
      }
    }
    if (code.startsWith('A3') || code.includes('INPUT') || code.includes('GST')) {
      return {
        label: 'Input Tax Credit',
        badgeClass: 'bg-blue-100 text-blue-800 border-blue-200',
        dotClass: 'bg-blue-600'
      }
    }
    if (code.startsWith('L2') || code.startsWith('L') || code.includes('CREDITOR') || code.includes('SUPPLIER')) {
      return {
        label: 'Trade Creditor',
        badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        dotClass: 'bg-amber-600'
      }
    }
    if (code.startsWith('X1') || code.startsWith('E') || code.includes('EXPENSE')) {
      return {
        label: 'Expense',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dotClass: 'bg-emerald-600'
      }
    }
    return {
      label: 'GL Account',
      badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
      dotClass: 'bg-gray-500'
    }
  } catch {
    return {
      label: 'GL Account',
      badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
      dotClass: 'bg-gray-500'
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading & Error Overlays
// ─────────────────────────────────────────────────────────────────────────────

const LoadingOverlay = () => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl px-8 py-7 flex flex-col items-center gap-4 shadow-2xl max-w-sm w-full text-center">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-emerald-700">
          GL
        </div>
      </div>
      <div>
        <p className="text-gray-800 font-bold text-base">Generating Purchase Voucher…</p>
        <p className="text-gray-500 text-xs mt-1">Retrieving double-entry journal records</p>
      </div>
    </div>
  </div>
)

const ErrorOverlay = ({ error, onClose }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-sm w-full shadow-2xl text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 mx-auto mb-4">
        <FiAlertTriangle className="w-7 h-7 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">Failed to Load Voucher</h3>
      <p className="text-gray-500 text-sm mb-6 leading-relaxed">
        {error || 'An unexpected error occurred while retrieving voucher details.'}
      </p>
      <button
        onClick={onClose}
        className="w-full px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
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

  // Direct backend data mapping (No frontend recalculations)
  const breakdown = voucher.breakdown || {}
  const entries = Array.isArray(voucher.entries)
    ? voucher.entries
    : Array.isArray(voucher.glEntries)
    ? voucher.glEntries
    : []
  const totals = voucher.totals || {}
  const tds = voucher.tds || null

  // Direct totals from backend
  const totalDebit = totals.totalDebit !== undefined ? totals.totalDebit : (voucher.totalAmount || '0.00')
  const totalCredit = totals.totalCredit !== undefined ? totals.totalCredit : (voucher.totalAmount || '0.00')
  const difference = totals.difference !== undefined ? totals.difference : '0.00'
  const isBalanced = parseFloat(difference || 0) === 0

  // Type detection
  const isFixedAsset = Boolean(
    voucher.isFixedAsset ||
    (typeof voucher.narration === 'string' && voucher.narration.toLowerCase().includes('fixed asset')) ||
    (typeof voucher.voucherType === 'string' && voucher.voucherType.includes('FIXED ASSET')) ||
    entries.some(e => String(e.glCode).includes('_FA') || String(e.narration).toLowerCase().includes('capitalised'))
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[60] flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-gray-100">

        {/* ── Modal Header ── */}
        <div className={`px-5 sm:px-6 py-4.5 flex items-center justify-between flex-shrink-0 text-white shadow-sm ${
          isFixedAsset
            ? 'bg-gradient-to-r from-purple-700 via-indigo-700 to-emerald-600'
            : 'bg-gradient-to-r from-emerald-600 to-teal-700'
        }`}>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-white/15 rounded-xl backdrop-blur-xs mt-0.5">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold leading-tight tracking-tight">
                  Purchase Voucher — GL Posted
                </h2>
                <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-white/20 text-white backdrop-blur-xs border border-white/25">
                  {isFixedAsset ? '🏢 Fixed Asset Capitalised' : '📦 Material Purchase'}
                </span>
              </div>
              <p className="text-white/80 text-xs mt-1 font-mono flex items-center gap-1.5 flex-wrap">
                <span>Voucher: <strong className="text-white">{voucher.voucherNo || '-'}</strong></span>
                <span>•</span>
                <span>Date: <strong className="text-white">{voucher.voucherDate || '-'}</strong></span>
                {voucher.financialYear && (
                  <>
                    <span>•</span>
                    <span>FY: <strong className="text-white">{voucher.financialYear}</strong></span>
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={onClose}
              aria-label="Close purchase voucher modal"
              className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-5 bg-gray-50/40">

          {/* Success Banner */}
          <div className="flex items-start gap-3.5 bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-sm">
            <span className="text-xl flex-shrink-0">🎉</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-emerald-900 text-sm">
                {isFixedAsset
                  ? 'Fixed Asset Invoice Approved, Capitalised & GL Entries Posted Successfully'
                  : 'Material Invoice Approved & GL Journal Entries Posted Successfully'}
              </p>
              <div className="text-emerald-700 text-xs mt-1 flex flex-wrap gap-x-4 gap-y-1">
                <span>Posted: <strong>{formatDateTime(voucher.postedAt)}</strong></span>
                {voucher.approvedBy && (
                  <span>Approved by: <strong>{voucher.approvedBy}</strong></span>
                )}
                <span>Ledger Status: <strong className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-semibold">{voucher.status || 'POSTED'}</strong></span>
              </div>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-blue-100 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-xs text-blue-600 font-semibold tracking-wide">Total Invoice Value</p>
              <p className="text-base sm:text-lg font-bold text-blue-900 mt-1">
                ₹{formatAmount(voucher.totalAmount)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Gross amount</p>
            </div>

            <div className="bg-white border border-amber-100 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-xs text-amber-600 font-semibold tracking-wide">Taxable Value</p>
              <p className="text-base sm:text-lg font-bold text-amber-900 mt-1">
                ₹{formatAmount(breakdown.taxable)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Base taxable value</p>
            </div>

            <div className="bg-white border border-purple-100 rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow">
              <p className="text-xs text-purple-600 font-semibold tracking-wide">GST Rate</p>
              <p className="text-base sm:text-lg font-bold text-purple-900 mt-1">
                {breakdown.gstRate !== undefined ? `${breakdown.gstRate}%` : '0%'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Tax percentage</p>
            </div>

            <div className={`bg-white rounded-xl p-3.5 shadow-2xs hover:shadow-xs transition-shadow border ${
              isBalanced ? 'border-emerald-200' : 'border-red-200'
            }`}>
              <p className={`text-xs font-semibold tracking-wide ${isBalanced ? 'text-emerald-600' : 'text-red-600'}`}>
                Journal Balance
              </p>
              <p className={`text-base sm:text-lg font-bold mt-1 ${isBalanced ? 'text-emerald-700' : 'text-red-700'}`}>
                {isBalanced ? '✓ Balanced' : '✗ Mismatch'}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">
                Diff: ₹{formatAmount(difference)}
              </p>
            </div>
          </div>

          {/* ── Voucher Info Grid ── */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3.5 flex items-center gap-2">
              <span>Accounting Document Details</span>
              <span className="h-px bg-gray-200 flex-1" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3.5 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Voucher Number</p>
                <p className="font-bold text-gray-800 font-mono text-xs sm:text-sm">{voucher.voucherNo || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Transaction ID</p>
                <p className="font-semibold text-gray-800 font-mono text-xs break-all">{voucher.transactionId || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Voucher Type</p>
                <span className="inline-block font-semibold text-gray-800 text-xs px-2 py-0.5 bg-gray-100 rounded-md">
                  {voucher.voucherType || (isFixedAsset ? 'FIXED ASSET PURCHASE' : 'PURCHASE')}
                </span>
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
                <p className="font-semibold text-gray-800 font-mono">{voucher.invoiceRef || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-400 mb-0.5">Vendor / Supplier</p>
                <p className="font-bold text-gray-900">{voucher.vendorName || '-'}</p>
                <p className="text-xs text-gray-500 font-mono mt-0.5">
                  Creditor GL: <span className="font-semibold text-amber-700">{voucher.vendorGLCode || '-'}</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">GL Status</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {voucher.status || 'POSTED'}
                </span>
              </div>
            </div>
          </div>

          {/* ── GST Breakdown ── */}
          {(parseFloat(breakdown.cgst || 0) > 0 ||
            parseFloat(breakdown.sgst || 0) > 0 ||
            parseFloat(breakdown.igst || 0) > 0) && (
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider mb-3">
                GST Tax Distribution
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Taxable Base</p>
                  <p className="font-bold text-gray-900">₹{formatAmount(breakdown.taxable)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Input CGST</p>
                  <p className="font-bold text-indigo-700">₹{formatAmount(breakdown.cgst)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Input SGST</p>
                  <p className="font-bold text-indigo-700">₹{formatAmount(breakdown.sgst)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Input IGST</p>
                  <p className="font-bold text-indigo-700">₹{formatAmount(breakdown.igst)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── TDS Breakdown (If applicable) ── */}
          {tds && (tds.applicable || parseFloat(tds.tdsAmount || 0) > 0) && (
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-2xs">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-3">
                Tax Deducted at Source (TDS)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">TDS Section</p>
                  <p className="font-bold text-gray-900">{tds.section || 'Sec 194'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">TDS Rate</p>
                  <p className="font-bold text-amber-700">{tds.rate ? `${tds.rate}%` : '0%'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">TDS Deducted</p>
                  <p className="font-bold text-red-600">₹{formatAmount(tds.tdsAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Net Payable to Vendor</p>
                  <p className="font-bold text-emerald-700">₹{formatAmount(tds.netPayable || voucher.totalAmount)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Double-Entry Journal Table ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Double-Entry Journal Entries
              </h3>
              <span className="text-xs text-gray-400 font-medium">
                {entries.length} {entries.length === 1 ? 'line' : 'lines'}
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-2xs bg-white">
              <table className="w-full text-sm min-w-[620px]">
                <thead>
                  <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wide">
                    <th className="px-3 py-3 text-left w-10">#</th>
                    <th className="px-3 py-3 text-left">GL Code &amp; Type</th>
                    <th className="px-4 py-3 text-left">Particulars &amp; Narration</th>
                    <th className="px-4 py-3 text-right text-emerald-700">Debit (₹)</th>
                    <th className="px-4 py-3 text-right text-red-600">Credit (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
                  {entries.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">
                        No journal entries found in this purchase voucher.
                      </td>
                    </tr>
                  ) : (
                    entries.map((entry, idx) => {
                      const debit = parseFloat(entry.debit ?? 0)
                      const credit = parseFloat(entry.credit ?? 0)
                      const category = getGLCategory(entry.glCode)

                      return (
                        <tr key={entry.lineNo ?? idx} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-3 py-3.5 text-gray-400 text-xs font-mono">{entry.lineNo ?? idx + 1}</td>
                          <td className="px-3 py-3.5 whitespace-nowrap">
                            <div className="flex flex-col gap-1 items-start">
                              <span className="font-mono text-xs font-bold text-gray-800">
                                {entry.glCode || '-'}
                              </span>
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold border ${category.badgeClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${category.dotClass}`} />
                                {category.label}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3.5 max-w-sm">
                            <p className="font-bold text-gray-900 text-xs sm:text-sm leading-snug">
                              {entry.glName || '-'}
                            </p>
                            {entry.narration && (
                              <p className="text-xs text-gray-500 mt-1 leading-relaxed italic bg-gray-50 p-1.5 rounded border border-gray-100">
                                {entry.narration}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap align-top">
                            {debit > 0 ? (
                              <span className="font-bold text-emerald-700 font-mono text-sm">
                                ₹{formatAmount(entry.debit)}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 py-3.5 text-right whitespace-nowrap align-top">
                            {credit > 0 ? (
                              <span className="font-bold text-red-600 font-mono text-sm">
                                ₹{formatAmount(entry.credit)}
                              </span>
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
                  <tr className="bg-gray-100/90 border-t-2 border-gray-300">
                    <td colSpan={3} className="px-4 py-3 text-right text-xs sm:text-sm font-bold text-gray-800">
                      Total Ledger Postings
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-emerald-700 whitespace-nowrap font-mono text-sm">
                      ₹{formatAmount(totalDebit)}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-600 whitespace-nowrap font-mono text-sm">
                      ₹{formatAmount(totalCredit)}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="px-4 py-2 text-center bg-gray-50 border-t border-gray-200">
                      {isBalanced ? (
                        <span className="text-xs text-emerald-700 font-bold inline-flex items-center gap-1">
                          <FiCheckCircle className="w-3.5 h-3.5" />
                          Double-Entry Journal is in Balance (Difference: ₹0.00)
                        </span>
                      ) : (
                        <span className="text-xs text-red-600 font-bold inline-flex items-center gap-1">
                          <FiAlertTriangle className="w-3.5 h-3.5" />
                          Ledger Imbalance Detected: ₹{formatAmount(difference)}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* ── Narration Card ── */}
          {voucher.narration && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Posting Narration / Remarks
              </p>
              <p className="text-sm text-gray-700 leading-relaxed font-mono">
                {voucher.narration}
              </p>
            </div>
          )}

          {/* Footer Note */}
          <p className="text-center text-xs text-gray-400 pb-1">
            System-generated Purchase Voucher · All monetary figures in Indian Rupees (INR ₹)
          </p>
        </div>

        {/* ── Modal Footer ── */}
        <div className="border-t border-gray-200 bg-white px-5 sm:px-6 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 flex-shrink-0">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            Record ID: <span className="font-mono font-medium">{voucher.invoiceId || voucher.invoiceRef || '-'}</span>
          </p>
          <div className="flex gap-2.5 w-full sm:w-auto">
            <button
              onClick={onClose}
              className={`w-full sm:w-auto px-8 py-2.5 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer ${
                isFixedAsset
                  ? 'bg-purple-700 hover:bg-purple-800'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              Done / Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PurchaseVoucherModal
