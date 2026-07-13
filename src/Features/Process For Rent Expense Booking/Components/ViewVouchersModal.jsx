import React from 'react'

export default function ViewVouchersModal({ site, agreement, vouchers, onClose }) {
  if (!site) return null

  const formatDateTime = (iso) => new Date(iso).toLocaleString('en-IN')

  const formatMonthName = (monthStr) => {
    try {
      if (!monthStr) return '-'
      const [year, month] = monthStr.split('-')
      const date = new Date(Number(year), Number(month) - 1, 1)
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    } catch {
      return monthStr
    }
  }

  const vouchersInAgreementPeriod = vouchers.filter((v) => {
    if (!agreement) return true // Show all if no agreement

    const voucherDate = new Date(v.month + '-01')
    const start = new Date(agreement?.startDate)
    const end = new Date(agreement?.endDate)
    return start <= voucherDate && voucherDate <= end
  })

  const monthsBetween = (start, end) => {
    const startDate = new Date(start)
    const endDate = new Date(end)

    let months = 0
    const current = new Date(startDate)

    while (current <= endDate) {
      months++
      current.setMonth(current.getMonth() + 1)
    }

    return months
  }

  const totalMonths = agreement ? monthsBetween(agreement.startDate, agreement.endDate) : 0
  const totalCreated = vouchersInAgreementPeriod.filter(v => v.status !== 'Cancelled').length
  const totalRemaining = Math.max(0, totalMonths - totalCreated)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-2 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[85vh] overflow-y-auto relative border border-green-100">
        {/* Green Header Section */}
        <div className="bg-green-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center sticky top-0 z-10 shadow-sm">
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse"></span>
            Vouchers List — {site.siteName}
          </h2>
          <button
            className="text-white hover:text-green-100 text-xl font-bold transition focus:outline-none cursor-pointer"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Padded Modal Body */}
        <div className="p-6">
          {agreement ? (
            <div className="mb-6 p-4 bg-green-50/30 rounded-xl border border-green-100/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white p-3 rounded-lg border border-green-100/20 shadow-xs">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Agreement Period</span>
                <span className="text-xs font-semibold text-gray-700">{agreement.startDate} to {agreement.endDate}</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-100/20 shadow-xs">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Total Duration</span>
                <span className="text-xs font-semibold text-gray-700">{totalMonths} Months</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-green-100/20 shadow-xs">
                <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Voucher Status</span>
                <span className="text-xs font-semibold text-gray-700">
                  {totalCreated} / {totalMonths} <span className="text-red-500 font-bold text-[10px] ml-1">(Left: {totalRemaining})</span>
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-xs italic mb-4 bg-gray-50 p-3 rounded-lg border border-gray-150">No active agreement configuration linked to this site.</p>
          )}

          {vouchersInAgreementPeriod.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic text-sm">
              {agreement
                ? 'No monthly vouchers have been generated for this agreement period.'
                : 'No vouchers found for this site.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {vouchersInAgreementPeriod.map((v, i) => {
                const isCancelled = v.status === 'Cancelled' || v.paymentStatus === 'Cancelled'
                const isPaid = v.paymentStatus === 'Paid'
                const statusLabel = isCancelled ? 'Cancelled' : isPaid ? 'Paid' : 'Pending Payment'
                
                return (
                  <div
                    key={i}
                    className={`border rounded-xl p-4 bg-white hover:shadow-md transition duration-150 relative shadow-sm flex flex-col justify-between ${
                      isCancelled 
                        ? 'border-red-100 bg-red-50/10 opacity-70' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <span className="text-sm font-bold text-gray-900">
                          {formatMonthName(v.month)}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                            isCancelled
                              ? 'bg-red-100 text-red-800'
                              : isPaid
                                ? 'bg-green-100 text-green-800'
                                : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-gray-400">Voucher No:</span>
                          <span className="font-semibold font-mono text-gray-800">{v.voucherNo || v.accounting?.voucherNo || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-50 pb-1">
                          <span className="text-gray-400">Rent Type:</span>
                          <span className="font-medium text-gray-700">{v.gstType || 'Without GST'}</span>
                        </div>
                        {isPaid && v.utr && (
                          <div className="flex justify-between border-b border-gray-50 pb-1">
                            <span className="text-gray-400">UTR / Ref:</span>
                            <span className="font-mono text-blue-600 font-semibold">{v.utr}</span>
                          </div>
                        )}
                        <div className="flex justify-between pt-0.5">
                          <span className="text-gray-400">Created At:</span>
                          <span>{formatDateTime(v.createdAt || v.accounting?.processedAt || new Date().toISOString())}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                      <span className="text-[10px] text-gray-400">Amount Due:</span>
                      <span className={`text-sm font-extrabold ${isCancelled ? 'text-gray-400 line-through' : 'text-green-700'}`}>
                        ₹{parseFloat(v.amount).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
