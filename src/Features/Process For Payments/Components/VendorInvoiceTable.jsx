/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'

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

  // Load persisted payment data on component mount
  useEffect(() => {
    const loadPersistedPaymentData = () => {
      try {
        const persistedPaymentsStr = localStorage.getItem('vendor_payment_selections')
        const persistedPayments = persistedPaymentsStr ? JSON.parse(persistedPaymentsStr) : {}

        const persistedSelectionsStr = localStorage.getItem('vendor_selection_state')
        const persistedSelections = persistedSelectionsStr ? JSON.parse(persistedSelectionsStr) : {}

        if (Object.keys(persistedPayments).length > 0) {
          setLocalPayments(persistedPayments)
          // Also update parent component with persisted payments
          Object.entries(persistedPayments).forEach(([invoiceId, payment]) => {
            onPaymentUpdate?.(invoiceId, payment.amount, payment.paymentType)
          })
        }

        if (Object.keys(persistedSelections).length > 0) {
          setSelectedVendors(persistedSelections)
        }
      } catch (error) {
        console.error('Error loading persisted payment data:', error)
      }
    }

    loadPersistedPaymentData()
  }, [])

  useEffect(() => {
    setLocalPayments(invoicePayments)
  }, [invoicePayments])

  // Persist payment data whenever it changes
  const persistPaymentData = (payments, selections) => {
    try {
      localStorage.setItem('vendor_payment_selections', JSON.stringify(payments))
      localStorage.setItem('vendor_selection_state', JSON.stringify(selections))
    } catch (error) {
      console.error('Error persisting payment data:', error)
    }
  }

  const handleVendorClick = (vendorId) => {
    setExpandedVendor(expandedVendor === vendorId ? null : vendorId)
  }

  const handleVendorCheckbox = (vendorId) => {
    const newSelections = {
      ...selectedVendors,
      [vendorId]: !selectedVendors[vendorId],
    }
    setSelectedVendors(newSelections)
    persistPaymentData(localPayments, newSelections)
  }

  const handleAmountChange = (invoiceId, amount) => {
    const numericAmount = Number(amount)

    // Allow 0 as valid amount for partial payments
    if (numericAmount < 0) {
      toast.error('Amount cannot be negative')
      return
    }

    const currentPayment = localPayments[invoiceId] || {}
    const updatedPayment = {
      ...currentPayment,
      amount: numericAmount,
      paymentType: currentPayment.paymentType || 'partial',
    }

    const newPayments = {
      ...localPayments,
      [invoiceId]: updatedPayment,
    }

    setLocalPayments(newPayments)
    persistPaymentData(newPayments, selectedVendors)

    // Immediately update parent component
    onPaymentUpdate?.(invoiceId, numericAmount, updatedPayment.paymentType)
  }

  const handlePaymentTypeChange = (invoiceId, paymentType, originalAmount) => {
    let amount

    if (paymentType === 'full') {
      amount = originalAmount
    } else {
      // For partial payments, use existing amount or 0 if none set
      amount = localPayments[invoiceId]?.amount || 0
    }

    const updatedPayment = {
      amount: Number(amount),
      paymentType: paymentType,
    }

    const newPayments = {
      ...localPayments,
      [invoiceId]: updatedPayment,
    }

    setLocalPayments(newPayments)
    persistPaymentData(newPayments, selectedVendors)

    // Immediately update parent component
    onPaymentUpdate?.(invoiceId, Number(amount), paymentType)
  }

  // Initialize default payment data for all invoices when component mounts
  useEffect(() => {
    const initializePayments = () => {
      const defaultPayments = {}
      let hasNewPayments = false

      vendorData.forEach((vendor) => {
        vendor.invoices.forEach((invoice) => {
          if (!localPayments[invoice.id]) {
            defaultPayments[invoice.id] = {
              amount: invoice.amount,
              paymentType: 'full',
            }
            hasNewPayments = true
            // Also update parent component
            onPaymentUpdate?.(invoice.id, invoice.amount, 'full')
          }
        })
      })

      if (hasNewPayments) {
        const newPayments = {
          ...localPayments,
          ...defaultPayments,
        }
        setLocalPayments(newPayments)
        persistPaymentData(newPayments, selectedVendors)
      }
    }

    if (vendorData.length > 0) {
      initializePayments()
    }
  }, [vendorData])

  const handleApproveSelectedInvoices = () => {
    // Pass both selected vendors and current payment state
    onInvoiceApprove(selectedVendors, localPayments)

    // Clear persisted data for approved invoices
    try {
      const newPayments = { ...localPayments }
      const newSelections = { ...selectedVendors }

      vendorData.forEach((vendor) => {
        if (selectedVendors[vendor.id]) {
          // Remove payment data for approved vendor's invoices
          vendor.invoices.forEach((invoice) => {
            delete newPayments[invoice.id]
          })
          // Deselect the vendor
          newSelections[vendor.id] = false
        }
      })

      setLocalPayments(newPayments)
      setSelectedVendors(newSelections)
      persistPaymentData(newPayments, newSelections)
    } catch (error) {
      console.error('Error clearing persisted data after approval:', error)
    }
  }

  const getVendorPaymentStatus = (vendor, payments) => {
    let fullyPaid = true
    let partiallyPaidInvoices = []

    vendor.invoices.forEach((inv) => {
      const pay = payments[inv.id]
      if (!pay) {
        fullyPaid = false
      } else if (Number(pay.amount) < inv.amount) {
        fullyPaid = false
        partiallyPaidInvoices.push({ ...inv, paidAmount: pay.amount })
      }
    })

    return {
      fullyPaid,
      partiallyPaidInvoices,
    }
  }

  // Helper function to get badge color based on invoice type
  const getInvoiceTypeBadgeColor = (invoiceTypeLabel) => {
    if (!invoiceTypeLabel) return 'bg-gray-100 text-gray-600'

    if (invoiceTypeLabel.includes('Material')) {
      return 'bg-blue-100 text-blue-700 border-blue-200'
    } else if (invoiceTypeLabel.includes('Fixed Asset')) {
      return 'bg-purple-100 text-purple-700 border-purple-200'
    } else if (invoiceTypeLabel.includes('Uniform') || invoiceTypeLabel.includes('Prepaid')) {
      return 'bg-green-100 text-green-700 border-green-200'
    }
    return 'bg-gray-100 text-gray-600 border-gray-200'
  }

  const filteredVendors = vendorData.filter((vendor) => vendor.invoices.length > 0)

  const renderInvoiceRow = (invoice, vendor) => {
    const payment = localPayments[invoice.id] || { amount: invoice.amount, paymentType: 'full' }
    const isPartialPayment = payment.paymentType === 'partial'
    const displayAmount =
      payment.amount !== undefined ? String(payment.amount) : String(invoice.amount)

    // Check if this is a rent voucher
    const isRentVoucher = invoice.isRentVoucher || vendor.isRentVoucher

    return (
      <tr key={invoice.id} className="bg-gray-100 border text-[10px] leading-tight">
        <td className="px-[2px] py-[2px] text-center border">-</td>
        <td className="px-[2px] py-[2px] text-center border">-</td>
        <td className="px-[2px] py-[2px] text-black border">└ {vendor.vendorName}</td>
        <td className="px-[2px] py-[2px] border">
          <div className="flex flex-col space-y-1">
            <button
              onClick={() => onInvoiceSelect?.(invoice)}
              className="text-blue-600 hover:underline font-medium text-[10px] text-left"
            >
              {invoice.invoiceNumber}
              {isRentVoucher && (
                <span className="ml-1 bg-green-100 text-green-700 px-1 rounded text-[8px]">
                  Rent
                </span>
              )}
            </button>
            {invoice.invoiceTypeLabel && (
              <span
                className={`inline-block text-[8px] px-1.5 py-0.5 rounded-full border font-medium ${getInvoiceTypeBadgeColor(invoice.invoiceTypeLabel)}`}
              >
                {invoice.invoiceTypeLabel}
              </span>
            )}
          </div>
        </td>
        <td className="px-[2px] py-[2px] border">
          <div className="space-y-[2px]">
            <div className="flex items-center space-x-[2px]">
              <span className="text-[10px] text-black">₹</span>
              <input
                type="number"
                value={displayAmount}
                onChange={(e) => handleAmountChange(invoice.id, e.target.value)}
                disabled={!isPartialPayment}
                className={`w-[60px] px-[4px] py-[2px] text-[10px] border rounded focus:outline-none ${
                  isPartialPayment ? 'bg-white border-blue-300' : 'bg-gray-100 border-gray-300'
                }`}
                step="0.01"
                min="0"
                max={invoice.amount}
              />
            </div>

            <div className="flex flex-col space-y-[1px]">
              <label className="flex items-center text-[9px]">
                <input
                  type="radio"
                  name={`payment-${invoice.id}`}
                  value="full"
                  checked={payment.paymentType !== 'partial'}
                  onChange={() => handlePaymentTypeChange(invoice.id, 'full', invoice.amount)}
                  className="mr-[3px] text-blue-600 scale-[0.8]"
                />
                <span className="text-green-600">Full</span>
              </label>

              <label className="flex items-center text-[9px]">
                <input
                  type="radio"
                  name={`payment-${invoice.id}`}
                  value="partial"
                  checked={payment.paymentType === 'partial'}
                  onChange={() => handlePaymentTypeChange(invoice.id, 'partial', invoice.amount)}
                  className="mr-[3px] text-orange-600 scale-[0.8]"
                />
                <span className="text-orange-600">Partial</span>
              </label>
            </div>
          </div>
        </td>
      </tr>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full table-auto min-w-[650px] text-xs border">
        <thead className="bg-gray-100 sticky top-0 text-[11px] border">
          <tr className="border">
            <th className="px-2 py-2 border">Sr</th>
            <th className="px-2 py-2 border">Select</th>
            <th className="px-2 py-2 border">Vendor</th>
            <th className="px-2 py-2 border">Invoice</th>
            <th className="px-1 py-1 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredVendors.map((vendor, index) => (
            <React.Fragment key={vendor.id}>
              <tr className="hover:bg-gray-50 transition-colors text-xs border">
                <td className="px-2 py-2 text-center border">{index + 1}</td>
                <td className="px-2 py-2 text-center border">
                  <input
                    type="checkbox"
                    checked={selectedVendors[vendor.id] || false}
                    onChange={() => handleVendorCheckbox(vendor.id)}
                    className="h-3 w-3 text-blue-600"
                  />
                </td>
                <td className="px-2 py-2 border">
                  <button
                    onClick={() => handleVendorClick(vendor.id)}
                    className="flex items-center space-x-1 hover:text-blue-600 font-medium"
                  >
                    <span className="text-[10px]">{expandedVendor === vendor.id ? '▼' : '▶'}</span>
                    <span>{vendor.vendorName}</span>
                    {vendor.isRentVoucher && (
                      <span className="ml-1 text-[10px] text-green-600 bg-green-100 px-1 rounded-full">
                        Rent
                      </span>
                    )}
                    <span className="ml-1 text-[10px] text-gray-500 bg-gray-100 px-1 rounded-full">
                      {getVendorPaymentStatus(vendor, localPayments).fullyPaid ? 'Paid' : 'Pending'}
                    </span>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-1 rounded-full">
                      {vendor.invoices.length} {vendor.isRentVoucher ? 'vouchers' : 'inv'}
                    </span>
                  </button>
                </td>
                <td className="px-1 py-1 text-[10px] border">
                  {expandedVendor === vendor.id ? '↓ invoices below' : 'Click name'}
                </td>
                <td className="px-1 py-1 text-[10px] border">
                  ₹{vendor.invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                </td>
              </tr>
              {expandedVendor === vendor.id &&
                vendor.invoices.map((invoice) => renderInvoiceRow(invoice, vendor))}
            </React.Fragment>
          ))}
        </tbody>
      </table>

      {filteredVendors.length === 0 && (
        <div className="text-center py-6 text-black">
          <div className="text-sm mb-1 font-semibold">No vendors found</div>
          <div className="text-xs">Upload a payment file or add vendors</div>
        </div>
      )}

      <div className="mt-4 text-right">
        <button
          onClick={handleApproveSelectedInvoices}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-2 px-4 rounded"
        >
          Approve Selected
        </button>
      </div>
    </div>
  )
}

export default VendorInvoiceTable
