import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

// Spinner helper
const Spinner = () => (
  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-green-500" />
)

const VendorInvoiceTable = ({
  vendorData,
  onInvoiceSelect,
  onPaymentUpdate,
  invoicePayments,
  onVendorDataUpdate,
  onInvoiceApprove,
}) => {
  const [selectedVendors, setSelectedVendors] = useState({})
  const [expandedVendor, setExpandedVendor] = useState(null)
  const [localPayments, setLocalPayments] = useState({})

  // Load persisted selections on mount
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('vendor_payment_selections') || '{}')
      const savedSelections = JSON.parse(localStorage.getItem('vendor_selection_state') || '{}')
      if (Object.keys(saved).length > 0) {
        setLocalPayments(saved)
        Object.entries(saved).forEach(([id, p]) => onPaymentUpdate?.(id, p.amount, p.paymentType))
      }
      if (Object.keys(savedSelections).length > 0) setSelectedVendors(savedSelections)
    } catch {
      // ignore
    }
  }, [])

  // Sync with parent
  useEffect(() => setLocalPayments(invoicePayments), [invoicePayments])

  // Default full-payment entry for new invoices
  useEffect(() => {
    if (vendorData.length === 0) return
    const defaults = {}
    let hasNew = false
    vendorData.forEach((vendor) => {
      vendor.invoices.forEach((inv) => {
        if (!localPayments[inv.id]) {
          defaults[inv.id] = { amount: inv.amount, paymentType: 'full' }
          hasNew = true
          onPaymentUpdate?.(inv.id, inv.amount, 'full')
        }
      })
    })
    if (hasNew) {
      const merged = { ...localPayments, ...defaults }
      setLocalPayments(merged)
      persist(merged, selectedVendors)
    }
  }, [vendorData])

  const persist = (payments, selections) => {
    try {
      localStorage.setItem('vendor_payment_selections', JSON.stringify(payments))
      localStorage.setItem('vendor_selection_state', JSON.stringify(selections))
    } catch {
      // non-critical
    }
  }

  const handleVendorCheckbox = (vendorId) => {
    const next = { ...selectedVendors, [vendorId]: !selectedVendors[vendorId] }
    setSelectedVendors(next)
    persist(localPayments, next)
  }

  const handleAmountChange = (invoiceId, value) => {
    const num = Number(value)
    if (num < 0) { toast.error('Amount cannot be negative'); return }
    const current = localPayments[invoiceId] || {}
    const updated = { ...current, amount: num, paymentType: current.paymentType || 'partial' }
    const next = { ...localPayments, [invoiceId]: updated }
    setLocalPayments(next)
    persist(next, selectedVendors)
    onPaymentUpdate?.(invoiceId, num, updated.paymentType)
  }

  const handlePaymentTypeChange = (invoiceId, paymentType, originalAmount) => {
    const amount = paymentType === 'full' ? originalAmount : (localPayments[invoiceId]?.amount || 0)
    const updated = { amount: Number(amount), paymentType }
    const next = { ...localPayments, [invoiceId]: updated }
    setLocalPayments(next)
    persist(next, selectedVendors)
    onPaymentUpdate?.(invoiceId, Number(amount), paymentType)
  }

  const handleApproveSelected = () => {
    onInvoiceApprove(selectedVendors, localPayments)
    // Clear local state for approved vendors
    const newPayments = { ...localPayments }
    const newSelections = { ...selectedVendors }
    vendorData.forEach((v) => {
      if (selectedVendors[v.id]) {
        v.invoices.forEach((inv) => delete newPayments[inv.id])
        newSelections[v.id] = false
      }
    })
    setLocalPayments(newPayments)
    setSelectedVendors(newSelections)
    persist(newPayments, newSelections)
  }

  const typeBadgeColor = (label = '') => {
    if (label.includes('Material')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (label.includes('Fixed Asset')) return 'bg-purple-100 text-purple-700 border-purple-200'
    if (label.includes('Uniform') || label.includes('Prepaid')) return 'bg-green-100 text-green-700 border-green-200'
    if (label.includes('Rent')) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const filteredVendors = vendorData.filter((v) => v.invoices.length > 0)
  const selectedCount = Object.values(selectedVendors).filter(Boolean).length

  if (filteredVendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-sm font-semibold text-gray-600">No pending vendor invoices</p>
        <p className="text-xs text-gray-400 mt-1">
          Approved invoices from AM / BM / Finance Head will appear here
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-xs min-w-[520px]">
          <thead className="bg-green-50 border-b border-green-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2 text-center text-gray-600 font-semibold w-8">#</th>
              <th className="px-3 py-2 text-center text-gray-600 font-semibold w-8">✓</th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">Vendor</th>
              <th className="px-3 py-2 text-left text-gray-600 font-semibold">Invoice</th>
              <th className="px-3 py-2 text-right text-gray-600 font-semibold pr-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredVendors.map((vendor, idx) => (
              <React.Fragment key={vendor.id}>
                {/* Vendor row */}
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 text-center text-gray-400">{idx + 1}</td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={selectedVendors[vendor.id] || false}
                      onChange={() => handleVendorCheckbox(vendor.id)}
                      className="h-3.5 w-3.5 rounded accent-green-600"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() =>
                        setExpandedVendor(expandedVendor === vendor.id ? null : vendor.id)
                      }
                      className="flex items-center gap-1.5 text-left font-semibold text-gray-800 hover:text-green-700 transition-colors"
                    >
                      <span className="text-[10px] text-gray-400">
                        {expandedVendor === vendor.id ? '▼' : '▶'}
                      </span>
                      <span className="truncate max-w-[140px]" title={vendor.vendorName}>
                        {vendor.vendorName}
                      </span>
                      {vendor.isRentVoucher && (
                        <span className="bg-yellow-100 text-yellow-700 text-[9px] px-1.5 rounded-full border border-yellow-200">
                          Rent
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 rounded-full">
                        {vendor.invoices.length} inv
                      </span>
                    </button>
                  </td>
                  <td className="px-3 py-2 text-gray-400 text-[10px]">
                    {expandedVendor === vendor.id ? 'See below' : 'Click to expand'}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-gray-700 pr-4">
                    ₹{vendor.invoices.reduce((s, i) => s + i.amount, 0).toLocaleString('en-IN')}
                  </td>
                </tr>

                {/* Invoice sub-rows */}
                {expandedVendor === vendor.id &&
                  vendor.invoices.map((invoice) => {
                    const payment = localPayments[invoice.id] || {
                      amount: invoice.amount,
                      paymentType: 'full',
                    }
                    const isPartial = payment.paymentType === 'partial'
                    return (
                      <tr key={invoice.id} className="bg-green-50/50 border-l-2 border-green-400">
                        <td className="px-3 py-2" />
                        <td className="px-3 py-2" />
                        <td className="px-3 py-2 text-gray-500 text-[10px] pl-5">
                          └ {vendor.vendorName}
                        </td>
                        <td className="px-3 py-2">
                          <div className="space-y-1">
                            <button
                              onClick={() => onInvoiceSelect?.(invoice)}
                              className="text-blue-600 hover:underline font-semibold text-[10px] text-left block"
                            >
                              {invoice.invoiceNumber}
                            </button>
                            {invoice.invoiceTypeLabel && (
                              <span
                                className={`inline-block text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${typeBadgeColor(invoice.invoiceTypeLabel)}`}
                              >
                                {invoice.invoiceTypeLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-2 pr-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 justify-end">
                              <span className="text-[10px] text-gray-500">₹</span>
                              <input
                                type="number"
                                value={isPartial ? payment.amount : invoice.amount}
                                onChange={(e) => handleAmountChange(invoice.id, e.target.value)}
                                disabled={!isPartial}
                                min="0"
                                max={invoice.amount}
                                step="0.01"
                                className={`w-16 text-[10px] px-1.5 py-0.5 border rounded text-right focus:outline-none focus:ring-1 focus:ring-green-400 ${
                                  isPartial
                                    ? 'bg-white border-blue-300'
                                    : 'bg-gray-100 border-gray-200'
                                }`}
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <label className="flex items-center gap-0.5 text-[9px] cursor-pointer">
                                <input
                                  type="radio"
                                  name={`pay-${invoice.id}`}
                                  checked={payment.paymentType !== 'partial'}
                                  onChange={() =>
                                    handlePaymentTypeChange(invoice.id, 'full', invoice.amount)
                                  }
                                  className="accent-green-600 scale-90"
                                />
                                <span className="text-green-700">Full</span>
                              </label>
                              <label className="flex items-center gap-0.5 text-[9px] cursor-pointer">
                                <input
                                  type="radio"
                                  name={`pay-${invoice.id}`}
                                  checked={payment.paymentType === 'partial'}
                                  onChange={() =>
                                    handlePaymentTypeChange(invoice.id, 'partial', invoice.amount)
                                  }
                                  className="accent-orange-500 scale-90"
                                />
                                <span className="text-orange-600">Partial</span>
                              </label>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Approve bar */}
      <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white">
        <span className="text-xs text-gray-500">
          {selectedCount > 0 ? `${selectedCount} vendor(s) selected` : 'Select vendors to approve'}
        </span>
        <button
          onClick={handleApproveSelected}
          disabled={selectedCount === 0}
          className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all ${
            selectedCount > 0
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          Approve Selected
        </button>
      </div>
    </div>
  )
}

export default VendorInvoiceTable
