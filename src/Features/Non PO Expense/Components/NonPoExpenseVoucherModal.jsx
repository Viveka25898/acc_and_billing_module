import React from 'react'
import { formatAmountINR, formatDateDMY } from '../config/nonPoExpenseConfig'

const NonPoExpenseVoucherModal = ({
  isOpen,
  onClose,
  onBack,
  voucherData,
  onPostVoucher,
  isPosting = false,
  isViewOnly = false,
}) => {
  if (!isOpen || !voucherData) return null

  const {
    claim,
    totalAmount = 0,
    totalGstAmount = 0,
    baseExpense = 0,
    gstType = 'intra',
    cgstAmount = 0,
    sgstAmount = 0,
    igstAmount = 0,
    voucherNo = `EV-${new Date().getFullYear()}-${String(claim.claimId || '').slice(-6) || '000001'}`,
    voucherDate = new Date().toISOString().slice(0, 10),
  } = voucherData

  // ─── Build Accounting Lines ────────────────────────────────────────────────
  const lines = [
    // 1. Expense Line
    {
      id: 1,
      particulars: 'Non PO Expense Ledger',
      ledgerCode: 'X2003001',
      parentGl: 'X2003',
      costCenter: claim.costCentre || 'CC-OPS',
      debit: baseExpense,
      credit: 0,
      type: 'Expense',
      note: `Site Emergency Expense - ${claim.expenseType} (${claim.siteName})`,
    },
    // 2. GST Lines (if applicable)
    ...(totalGstAmount > 0 && gstType === 'intra'
      ? [
          {
            id: 2,
            particulars: 'CGST input',
            ledgerCode: 'A3007001001',
            parentGl: 'A3007001',
            costCenter: claim.costCentre || 'CC-OPS',
            debit: cgstAmount,
            credit: 0,
            type: 'Asset / ITC',
            note: `Central GST Input @ 50% of ₹${totalGstAmount.toFixed(2)} (Parent: A3007001 - GST input accounts)`,
          },
          {
            id: 3,
            particulars: 'SGST input',
            ledgerCode: 'A3007001002',
            parentGl: 'A3007001',
            costCenter: claim.costCentre || 'CC-OPS',
            debit: sgstAmount,
            credit: 0,
            type: 'Asset / ITC',
            note: `State GST Input @ 50% of ₹${totalGstAmount.toFixed(2)} (Parent: A3007001 - GST input accounts)`,
          },
        ]
      : []),
    ...(totalGstAmount > 0 && gstType === 'inter'
      ? [
          {
            id: 2,
            particulars: 'IGST input',
            ledgerCode: 'A3007001003',
            parentGl: 'A3007001',
            costCenter: claim.costCentre || 'CC-OPS',
            debit: igstAmount,
            credit: 0,
            type: 'Asset / ITC',
            note: `Inter-State GST Input @ 100% of ₹${totalGstAmount.toFixed(2)} (Parent: A3007001 - GST input accounts)`,
          },
        ]
      : []),
    // 3. Liability Line
    {
      id: 4,
      particulars: 'Non PO Liability Ledger',
      ledgerCode: 'L2001003',
      parentGl: 'L2001',
      costCenter: '—',
      debit: 0,
      credit: totalAmount,
      type: 'Current Liability',
      note: `Payable to: ${claim.accountHolderName} (${claim.bankName || 'Verified Bank'})`,
    },
  ]

  const totalDebit = lines.reduce((sum, l) => sum + Number(l.debit || 0), 0)
  const totalCredit = lines.reduce((sum, l) => sum + Number(l.credit || 0), 0)
  const isBalanced = Math.abs(totalDebit - totalCredit) < 0.01

  const handlePrint = () => {
    window.print()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-gray-200 animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Sticky Header ── */}
        <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 text-white p-4 sm:p-5 flex justify-between items-center flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Non-PO Expense Voucher — Accounting Preview
              </h2>
              <p className="text-green-100 text-xs mt-0.5 font-mono">
                Voucher No: <span className="font-bold text-white">{voucherNo}</span> · Date: {formatDateDMY(voucherDate)}
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

        {/* ── Scrollable Body ── */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-gray-700">

          {/* Banner */}
          <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-3.5">
            <span className="text-xl flex-shrink-0">✅</span>
            <div>
              <p className="font-bold text-green-900 text-xs sm:text-sm">
                General Ledger Posting Validation Verified
              </p>
              <p className="text-green-700 text-xs mt-0.5">
                Expense is debited to <strong>Non PO Expense Ledger (X2003001)</strong>, GST Input Credit accrued, and credited to{' '}
                <strong>Non PO Liability Ledger (L2001003)</strong>.
              </p>
            </div>
          </div>

          {/* ── Summary KPI Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-center">
              <p className="text-xs text-blue-600 font-semibold">Total Gross Amount</p>
              <p className="text-sm sm:text-base font-extrabold text-blue-900 mt-1">
                {formatAmountINR(totalAmount)}
              </p>
            </div>

            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center">
              <p className="text-xs text-amber-700 font-semibold">Base Expense (P&L)</p>
              <p className="text-sm sm:text-base font-extrabold text-amber-900 mt-1">
                {formatAmountINR(baseExpense)}
              </p>
            </div>

            <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 text-center">
              <p className="text-xs text-purple-700 font-semibold">Total GST Accrued</p>
              <p className="text-sm sm:text-base font-extrabold text-purple-900 mt-1">
                {formatAmountINR(totalGstAmount)}
              </p>
            </div>

            <div
              className={`rounded-xl p-3 text-center border ${
                isBalanced
                  ? 'bg-emerald-50 border-emerald-300'
                  : 'bg-red-50 border-red-300'
              }`}
            >
              <p className={`text-xs font-bold ${isBalanced ? 'text-emerald-700' : 'text-red-700'}`}>
                Balance Check
              </p>
              <p className={`text-sm sm:text-base font-extrabold mt-1 ${isBalanced ? 'text-emerald-900' : 'text-red-900'}`}>
                {isBalanced ? '✓ Balanced' : '✗ Mismatch'}
              </p>
            </div>
          </div>

          {/* ── Voucher Information Grid ── */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Voucher & Header Details
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-gray-400 block">Voucher No:</span>
                <span className="font-mono font-bold text-gray-800">{voucherNo}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Voucher Date:</span>
                <span className="font-semibold text-gray-800">{formatDateDMY(voucherDate)}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Claim Reference:</span>
                <span className="font-mono font-bold text-green-700">{claim.claimId}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Financial Year:</span>
                <span className="font-semibold text-gray-800">{claim.financialYear || 'FY 2026-27'}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Site & Cost Centre:</span>
                <span className="font-semibold text-gray-800">
                  {claim.siteName} <span className="font-mono text-gray-500">({claim.costCentre})</span>
                </span>
              </div>
              <div>
                <span className="text-gray-400 block">Beneficiary / Payee:</span>
                <span className="font-bold text-gray-800">{claim.accountHolderName}</span>
              </div>
              <div>
                <span className="text-gray-400 block">Vendor GSTIN:</span>
                <span className="font-mono font-semibold text-gray-800">
                  {claim.vendorGstin || 'Non-GST Vendor'}
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

          {/* ── Accounting Entries Table ── */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                GL Journal Accounting Entries (Double-Entry Posting)
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">
                Expense: X2003001 | GST Input: A3007001 | Liability: L2001003
              </span>
            </div>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-gray-100/80 border-b border-gray-200 text-gray-600 font-bold uppercase text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">#</th>
                      <th className="py-2.5 px-4">Particulars / Ledger Name</th>
                      <th className="py-2.5 px-3">GL Code</th>
                      <th className="py-2.5 px-3">Parent GL</th>
                      <th className="py-2.5 px-3">Cost Centre</th>
                      <th className="py-2.5 px-4 text-right">Debit (₹)</th>
                      <th className="py-2.5 px-4 text-right">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {lines.map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50 transition">
                        <td className="py-3 px-3 text-center font-mono text-gray-400 text-xs">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-gray-900">{row.particulars}</div>
                          <div className="text-[11px] text-gray-400 mt-0.5">{row.note}</div>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-gray-700 text-xs">
                          {row.ledgerCode}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-500 text-xs">
                          {row.parentGl}
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-600 text-xs">
                          {row.costCenter}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                          {row.debit > 0 ? formatAmountINR(row.debit) : '—'}
                        </td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-gray-900">
                          {row.credit > 0 ? formatAmountINR(row.credit) : '—'}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-green-50/70 border-t-2 border-gray-300 font-extrabold text-xs sm:text-sm">
                      <td colSpan={5} className="py-3 px-4 text-right text-gray-800">
                        Total Voucher Balance:
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-green-900">
                        {formatAmountINR(totalDebit)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-green-900">
                        {formatAmountINR(totalCredit)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Narration Box */}
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Narration / Journal Note
            </span>
            <p className="text-xs text-gray-700 font-mono">
              Being Non-PO Emergency Expense claim {claim.claimId} booked for site {claim.siteName} towards {claim.expenseType} ({claim.categoryName}). Approved by Accounts Manager.
            </p>
          </div>

        </div>

        {/* ── Footer Actions ── */}
        <div className="bg-gray-50 px-6 py-3.5 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-2">
            {!isViewOnly && onBack && (
              <button
                type="button"
                onClick={onBack}
                disabled={isPosting}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
              >
                ‹ Back / Edit GST
              </button>
            )}
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition cursor-pointer shadow-2xs"
            >
              🖨️ Print
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPosting}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-xl transition cursor-pointer disabled:opacity-50"
            >
              Close
            </button>

            {!isViewOnly && onPostVoucher && (
              <button
                type="button"
                onClick={() => onPostVoucher(voucherData)}
                disabled={isPosting || !isBalanced}
                className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-green-600 hover:bg-green-700 active:scale-[0.98] rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isPosting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Posting Voucher & Approving...</span>
                  </>
                ) : (
                  <span>✓ Post Voucher & Final Approve</span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default NonPoExpenseVoucherModal
