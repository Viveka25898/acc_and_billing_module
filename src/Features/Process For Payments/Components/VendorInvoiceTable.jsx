import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const VendorInvoiceTable = ({
  vendorData = [],
  onInvoiceSelect,
  onPaymentUpdate,
  invoicePayments = {},
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
      // ignore non-critical
    }
  }, [])

  // Sync local payments with parent state
  useEffect(() => {
    setLocalPayments(invoicePayments || {})
  }, [invoicePayments])

  // Default full-payment entry for newly loaded invoices
  useEffect(() => {
    if (!Array.isArray(vendorData) || vendorData.length === 0) return
    const defaults = {}
    let hasNew = false

    vendorData.forEach((vendor) => {
      ;(vendor.invoices || []).forEach((inv) => {
        if (!localPayments[inv.id]) {
          const invAmt = typeof inv.amount === 'number' ? inv.amount : 0
          defaults[inv.id] = { amount: invAmt, paymentType: 'full' }
          hasNew = true
          onPaymentUpdate?.(inv.id, invAmt, 'full')
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
    if (isNaN(num) || num < 0) {
      toast.error('Amount cannot be negative')
      return
    }
    const current = localPayments[invoiceId] || {}
    const updated = { ...current, amount: num, paymentType: current.paymentType || 'partial' }
    const next = { ...localPayments, [invoiceId]: updated }
    setLocalPayments(next)
    persist(next, selectedVendors)
    onPaymentUpdate?.(invoiceId, num, updated.paymentType)
  }

  const handlePaymentTypeChange = (invoiceId, paymentType, originalAmount) => {
    const orig = typeof originalAmount === 'number' ? originalAmount : 0
    const amount = paymentType === 'full' ? orig : localPayments[invoiceId]?.amount || 0
    const updated = { amount: Number(amount), paymentType }
    const next = { ...localPayments, [invoiceId]: updated }
    setLocalPayments(next)
    persist(next, selectedVendors)
    onPaymentUpdate?.(invoiceId, Number(amount), paymentType)
  }

  const handleApproveSelected = () => {
    onInvoiceApprove(selectedVendors, localPayments)
    const newPayments = { ...localPayments }
    const newSelections = { ...selectedVendors }

    vendorData.forEach((v) => {
      if (selectedVendors[v.id]) {
        ;(v.invoices || []).forEach((inv) => delete newPayments[inv.id])
        newSelections[v.id] = false
      }
    })

    setLocalPayments(newPayments)
    setSelectedVendors(newSelections)
    persist(newPayments, newSelections)
  }

  const typeBadgeColor = (label = '') => {
    if (!label || label === '-') return 'bg-gray-100 text-gray-500 border-gray-200'
    if (label.includes('Material')) return 'bg-blue-100 text-blue-700 border-blue-200'
    if (label.includes('Fixed Asset')) return 'bg-purple-100 text-purple-700 border-purple-200'
    if (label.includes('Uniform') || label.includes('Prepaid'))
      return 'bg-green-100 text-green-700 border-green-200'
    if (label.includes('Rent')) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const filteredVendors = (vendorData || []).filter((v) => v && (v.invoices || []).length > 0)
  const selectedCount = Object.values(selectedVendors).filter(Boolean).length

  if (filteredVendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-4">
        <div className="text-4xl mb-3">📭</div>
        <p className="text-sm font-semibold text-gray-600">No pending vendor invoices</p>
        <p className="text-xs text-gray-400 mt-1">
          Approved vendor invoices will appear here once loaded
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-xs min-w-[540px]">
          <thead className="bg-green-50 border-b border-green-100 sticky top-0 z-10">
            <tr>
              <th className="px-3 py-2.5 text-center text-gray-600 font-semibold w-8">#</th>
              <th className="px-3 py-2.5 text-center text-gray-600 font-semibold w-8">✓</th>
              <th className="px-3 py-2.5 text-left text-gray-600 font-semibold">Vendor</th>
              <th className="px-3 py-2.5 text-left text-gray-600 font-semibold">Invoice Details</th>
              <th className="px-3 py-2.5 text-right text-gray-600 font-semibold pr-4">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredVendors.map((vendor, idx) => {
              const vendorNameDisplay = vendor.vendorName || '-'
              const vendorInvoices = vendor.invoices || []
              const totalVendorAmount = vendorInvoices.reduce(
                (sum, i) => sum + (typeof i.amount === 'number' ? i.amount : 0),
                0
              )

              return (
                <React.Fragment key={vendor.id || `v-${idx}`}>
                  {/* Vendor Parent Row */}
                  <tr className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-3 py-2.5 text-center text-gray-400 font-mono">{idx + 1}</td>
                    <td className="px-3 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={selectedVendors[vendor.id] || false}
                        onChange={() => handleVendorCheckbox(vendor.id)}
                        className="h-3.5 w-3.5 rounded accent-green-600 cursor-pointer"
                      />
                    </td>
                    <td className="px-3 py-2.5">
                      <button
                        onClick={() =>
                          setExpandedVendor(expandedVendor === vendor.id ? null : vendor.id)
                        }
                        className="flex items-center gap-1.5 text-left font-semibold text-gray-800 hover:text-green-700 transition-colors group"
                      >
                        <span className="text-[10px] text-gray-400 group-hover:text-green-600">
                          {expandedVendor === vendor.id ? '▼' : '▶'}
                        </span>
                        <span
                          className="truncate max-w-[150px] sm:max-w-[200px]"
                          title={vendorNameDisplay}
                        >
                          {vendorNameDisplay}
                        </span>
                        {vendor.isRentVoucher && (
                          <span className="bg-yellow-100 text-yellow-700 text-[9px] px-1.5 py-0.2 rounded-full border border-yellow-200 font-medium">
                            Rent
                          </span>
                        )}
                        <span className="bg-gray-100 text-gray-500 text-[9px] px-1.5 py-0.2 rounded-full font-medium">
                          {vendorInvoices.length} inv
                        </span>
                      </button>
                    </td>
                    <td className="px-3 py-2.5 text-gray-400 text-[10px]">
                      {expandedVendor === vendor.id ? (
                        <span className="text-green-600 font-medium">Showing invoices below</span>
                      ) : (
                        <span>Click vendor to expand</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-right font-bold text-gray-800 pr-4">
                      ₹{totalVendorAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>

                  {/* Vendor Invoices Sub-Rows */}
                  {expandedVendor === vendor.id &&
                    vendorInvoices.map((invoice, invIdx) => {
                      const invoiceId = invoice.id || `inv-${vendor.id}-${invIdx}`
                      const invNumberDisplay = invoice.invoiceNumber || '-'
                      const payment = localPayments[invoiceId] || {
                        amount: invoice.amount,
                        paymentType: 'full',
                      }
                      const isPartial = payment.paymentType === 'partial'

                      return (
                        <tr
                          key={invoiceId}
                          className="bg-green-50/40 border-l-2 border-green-500 hover:bg-green-50/70 transition-colors"
                        >
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2" />
                          <td className="px-3 py-2 text-gray-500 text-[10px] pl-4 sm:pl-6 truncate max-w-[150px]">
                            └ {vendorNameDisplay}
                          </td>
                          <td className="px-3 py-2">
                            <div className="space-y-1">
                              <button
                                onClick={() => onInvoiceSelect?.(invoice)}
                                className="text-blue-600 hover:text-blue-800 hover:underline font-semibold text-[11px] text-left block truncate max-w-[160px]"
                                title={`Click to view invoice details for ${invNumberDisplay}`}
                              >
                                {invNumberDisplay}
                              </button>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {invoice.invoiceTypeLabel && (
                                  <span
                                    className={`inline-block text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${typeBadgeColor(
                                      invoice.invoiceTypeLabel
                                    )}`}
                                  >
                                    {invoice.invoiceTypeLabel}
                                  </span>
                                )}
                                <span className="text-[9px] text-gray-400 font-mono">
                                  GL: {invoice.vendorGLCode || '-'}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2 pr-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1 justify-end">
                                <span className="text-[10px] text-gray-500">₹</span>
                                <input
                                  type="number"
                                  value={isPartial ? payment.amount : invoice.amount}
                                  onChange={(e) => handleAmountChange(invoiceId, e.target.value)}
                                  disabled={!isPartial}
                                  min="0"
                                  max={invoice.amount}
                                  step="0.01"
                                  className={`w-20 text-[10px] px-1.5 py-0.5 border rounded text-right focus:outline-none focus:ring-1 focus:ring-green-400 ${
                                    isPartial
                                      ? 'bg-white border-blue-400 font-semibold text-gray-800'
                                      : 'bg-gray-100 border-gray-200 text-gray-600'
                                  }`}
                                />
                              </div>
                              <div className="flex gap-2 justify-end">
                                <label className="flex items-center gap-0.5 text-[9px] cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`pay-${invoiceId}`}
                                    checked={payment.paymentType !== 'partial'}
                                    onChange={() =>
                                      handlePaymentTypeChange(invoiceId, 'full', invoice.amount)
                                    }
                                    className="accent-green-600 scale-90 cursor-pointer"
                                  />
                                  <span className="text-green-700 font-medium">Full</span>
                                </label>
                                <label className="flex items-center gap-0.5 text-[9px] cursor-pointer">
                                  <input
                                    type="radio"
                                    name={`pay-${invoiceId}`}
                                    checked={payment.paymentType === 'partial'}
                                    onChange={() =>
                                      handlePaymentTypeChange(invoiceId, 'partial', invoice.amount)
                                    }
                                    className="accent-orange-500 scale-90 cursor-pointer"
                                  />
                                  <span className="text-orange-600 font-medium">Partial</span>
                                </label>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Selection & Approval Bar */}
      <div className="border-t border-gray-100 p-3 flex items-center justify-between bg-white shadow-inner">
        <span className="text-xs text-gray-600 font-medium">
          {selectedCount > 0
            ? `${selectedCount} vendor(s) selected for approval`
            : 'Select vendors using checkboxes above'}
        </span>
        <button
          onClick={handleApproveSelected}
          disabled={selectedCount === 0}
          className={`text-xs font-semibold px-5 py-2 rounded-full transition-all duration-150 ${
            selectedCount > 0
              ? 'bg-green-600 text-white hover:bg-green-700 shadow-md active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Approve Selected ({selectedCount})
        </button>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export default VendorInvoiceTable
