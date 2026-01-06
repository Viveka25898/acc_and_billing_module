/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import {
  Plus,
  Trash2,
  AlertCircle,
  Calculator,
  FileText,
  DollarSign,
  Package,
  Info,
} from 'lucide-react'
import {
  calculateLineTotal,
  calculateInvoiceTotals,
  formatCurrency,
  validateLineItem,
  generateLineItemId,
  convertAmountToWords,
} from '../../utils/manualBillingCalculations'

const ManualBillingForm = ({ onSubmit, onCancel, initialData = null, isLoading = false }) => {
  // Form state
  const [formData, setFormData] = useState({
    client: '',
    invoiceType: 'one-time-service',
    poWoNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    notes: '',
    gstRate: 18,
    discount: 0,
    otherCharges: 0,
  })

  // Line items state
  const [lineItems, setLineItems] = useState([
    {
      id: generateLineItemId(),
      description: '',
      quantity: '',
      rate: '',
      total: 0,
    },
  ])

  // Calculations state
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    gst: { type: 'CGST+SGST', rate: 18, amount: 0 },
    discount: 0,
    otherCharges: 0,
    grandTotal: 0,
  })

  // UI state
  const [errors, setErrors] = useState({})
  const [lineItemErrors, setLineItemErrors] = useState({})
  const [showAmountInWords, setShowAmountInWords] = useState(false)

  // Invoice types
  const invoiceTypes = [
    { value: 'one-time-service', label: 'One-Time Service' },
    { value: 'hospital-billing', label: 'Hospital Billing' },
    { value: 'mst-material', label: 'MST (Material)' },
    { value: 'rm-maintenance', label: 'R&M (Repairs & Maintenance)' },
    { value: 'deep-cleaning', label: 'Deep Cleaning' },
    { value: 'extra-duty', label: 'Extra Duty' },
    { value: 'per-day-service', label: 'Per Day Service' },
    { value: 'po-based', label: 'PO-Based Billing' },
    { value: 'other', label: 'Other' },
  ]

  // Dummy clients (replace with actual data from your system)
  const clients = [
    { id: 1, name: 'Apollo Hospitals', gstin: '27AAAAA0000A1Z5', state: 'Maharashtra' },
    { id: 2, name: 'Fortis Healthcare', gstin: '07BBBBB0000B1Z5', state: 'Delhi' },
    { id: 3, name: 'Max Healthcare', gstin: '27CCCCC0000C1Z5', state: 'Maharashtra' },
    { id: 4, name: 'Manipal Hospitals', gstin: '29DDDDD0000D1Z5', state: 'Karnataka' },
    { id: 5, name: 'Narayana Health', gstin: '36EEEEE0000E1Z5', state: 'Telangana' },
  ]

  // Initialize from initialData if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        client: initialData.client || '',
        invoiceType: initialData.invoiceType || 'one-time-service',
        poWoNumber: initialData.poWoNumber || '',
        invoiceDate: initialData.invoiceDate || new Date().toISOString().split('T')[0],
        dueDate: initialData.dueDate || '',
        notes: initialData.notes || '',
        gstRate: initialData.gstRate || 18,
        discount: initialData.discount || 0,
        otherCharges: initialData.otherCharges || 0,
      })

      if (initialData.lineItems && initialData.lineItems.length > 0) {
        setLineItems(initialData.lineItems)
      }
    }
  }, [initialData])

  // Recalculate totals whenever line items or form data changes
  useEffect(() => {
    try {
      const newCalculations = calculateInvoiceTotals(
        lineItems,
        parseFloat(formData.gstRate) || 18,
        parseFloat(formData.discount) || 0,
        parseFloat(formData.otherCharges) || 0,
        false // Set to true for inter-state transactions
      )
      setCalculations(newCalculations)
    } catch (error) {
      console.error('Error calculating totals:', error)
    }
  }, [lineItems, formData.gstRate, formData.discount, formData.otherCharges])

  // Handle form field changes
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  // Handle line item changes
  const handleLineItemChange = (id, field, value) => {
    setLineItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Calculate total when quantity or rate changes
          if (field === 'quantity' || field === 'rate') {
            updatedItem.total = calculateLineTotal(updatedItem.quantity, updatedItem.rate)
          }

          return updatedItem
        }
        return item
      })
    )

    // Clear errors for this line item
    setLineItemErrors((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: '' },
    }))
  }

  // Add new line item
  const handleAddLineItem = () => {
    const newLineItem = {
      id: generateLineItemId(),
      description: '',
      quantity: '',
      rate: '',
      total: 0,
    }
    setLineItems((prev) => [...prev, newLineItem])
  }

  // Remove line item
  const handleRemoveLineItem = (id) => {
    if (lineItems.length === 1) {
      // Don't allow removing the last line item
      return
    }
    setLineItems((prev) => prev.filter((item) => item.id !== id))
    setLineItemErrors((prev) => {
      const newErrors = { ...prev }
      delete newErrors[id]
      return newErrors
    })
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    const newLineItemErrors = {}

    // Validate basic form fields
    if (!formData.client) {
      newErrors.client = 'Please select a client'
    }

    if (!formData.invoiceType) {
      newErrors.invoiceType = 'Please select an invoice type'
    }

    if (!formData.poWoNumber) {
      newErrors.poWoNumber = 'PO/WO number is required'
    }

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = 'Invoice date is required'
    }

    // Validate line items
    let hasValidLineItem = false
    lineItems.forEach((item) => {
      const validation = validateLineItem(item)
      if (!validation.isValid) {
        newLineItemErrors[item.id] = validation.errors
      } else {
        hasValidLineItem = true
      }
    })

    if (!hasValidLineItem) {
      newErrors.lineItems = 'At least one valid line item is required'
    }

    setErrors(newErrors)
    setLineItemErrors(newLineItemErrors)

    return Object.keys(newErrors).length === 0 && Object.keys(newLineItemErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = (status = 'draft') => {
    if (!validateForm()) {
      return
    }

    const invoiceData = {
      ...formData,
      lineItems,
      calculations,
      status,
      createdAt: new Date().toISOString(),
      amountInWords: convertAmountToWords(calculations.grandTotal),
    }

    onSubmit(invoiceData)
  }

  return (
    <div className="w-full max-w-full overflow-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit('generated')
        }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg p-4 sm:p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-2 sm:p-3 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Manual Billing</h2>
              <p className="text-xs sm:text-sm text-emerald-50 mt-1">
                Create custom invoices for exceptional billing scenarios
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-emerald-600" />
            Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Client Selection */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.client}
                onChange={(e) => handleFormChange('client', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                  errors.client ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Select Client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.name}>
                    {client.name} ({client.state})
                  </option>
                ))}
              </select>
              {errors.client && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.client}
                </p>
              )}
            </div>

            {/* Invoice Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Type <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.invoiceType}
                onChange={(e) => handleFormChange('invoiceType', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                  errors.invoiceType ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                {invoiceTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.invoiceType && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.invoiceType}
                </p>
              )}
            </div>

            {/* PO/WO Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PO/WO Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.poWoNumber}
                onChange={(e) => handleFormChange('poWoNumber', e.target.value)}
                placeholder="Enter PO or WO number"
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                  errors.poWoNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.poWoNumber && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.poWoNumber}
                </p>
              )}
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Invoice Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.invoiceDate}
                onChange={(e) => handleFormChange('invoiceDate', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                  errors.invoiceDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.invoiceDate && (
                <p className="mt-1 text-xs sm:text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.invoiceDate}
                </p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => handleFormChange('dueDate', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes/Remarks</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                placeholder="Additional notes or remarks for this invoice..."
                rows={3}
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Line Items Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-emerald-600" />
              Service Details
            </h3>
            <button
              type="button"
              onClick={handleAddLineItem}
              className="px-3 sm:px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 text-sm font-medium"
              disabled={isLoading}
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Line Item</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>

          {errors.lineItems && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{errors.lineItems}</p>
            </div>
          )}

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Service Description
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                    Quantity
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-32">
                    Rate (₹)
                  </th>
                  <th className="px-3 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider w-40">
                    Total (₹)
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-20">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {lineItems.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3">
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          handleLineItemChange(item.id, 'description', e.target.value)
                        }
                        placeholder="Describe the service provided"
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none ${
                          lineItemErrors[item.id]?.description
                            ? 'border-red-500'
                            : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      {lineItemErrors[item.id]?.description && (
                        <p className="mt-1 text-xs text-red-600">
                          {lineItemErrors[item.id].description}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                          lineItemErrors[item.id]?.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      {lineItemErrors[item.id]?.quantity && (
                        <p className="mt-1 text-xs text-red-600">
                          {lineItemErrors[item.id].quantity}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleLineItemChange(item.id, 'rate', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                          lineItemErrors[item.id]?.rate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      {lineItemErrors[item.id]?.rate && (
                        <p className="mt-1 text-xs text-red-600">{lineItemErrors[item.id].rate}</p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.total)}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleRemoveLineItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={lineItems.length === 1 || isLoading}
                        title="Remove line item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {lineItems.map((item, index) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">Item {index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLineItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    disabled={lineItems.length === 1 || isLoading}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Service Description
                    </label>
                    <textarea
                      value={item.description}
                      onChange={(e) => handleLineItemChange(item.id, 'description', e.target.value)}
                      placeholder="Describe the service provided"
                      rows={2}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm resize-none ${
                        lineItemErrors[item.id]?.description ? 'border-red-500' : 'border-gray-300'
                      }`}
                      disabled={isLoading}
                    />
                    {lineItemErrors[item.id]?.description && (
                      <p className="mt-1 text-xs text-red-600">
                        {lineItemErrors[item.id].description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleLineItemChange(item.id, 'quantity', e.target.value)}
                        placeholder="0"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                          lineItemErrors[item.id]?.quantity ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      {lineItemErrors[item.id]?.quantity && (
                        <p className="mt-1 text-xs text-red-600">
                          {lineItemErrors[item.id].quantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Rate (₹)
                      </label>
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => handleLineItemChange(item.id, 'rate', e.target.value)}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                          lineItemErrors[item.id]?.rate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isLoading}
                      />
                      {lineItemErrors[item.id]?.rate && (
                        <p className="mt-1 text-xs text-red-600">{lineItemErrors[item.id].rate}</p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total:</span>
                      <span className="text-base font-bold text-gray-900">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Calculations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-600" />
            Invoice Summary
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* GST Rate */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GST Rate (%)</label>
              <input
                type="number"
                value={formData.gstRate}
                onChange={(e) => handleFormChange('gstRate', e.target.value)}
                min="0"
                max="100"
                step="0.01"
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Discount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Discount (₹)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleFormChange('discount', e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                disabled={isLoading}
              />
            </div>

            {/* Other Charges */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Charges (%)
              </label>
              <input
                type="number"
                value={formData.otherCharges}
                onChange={(e) => handleFormChange('otherCharges', e.target.value)}
                min="0"
                max="100"
                step="0.01"
                placeholder="0.00"
                className="w-full px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">
                {calculations.otherChargesAmount > 0 &&
                  `Amount: ${formatCurrency(calculations.otherChargesAmount)}`}
              </p>
            </div>
          </div>

          {/* Totals Display */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600 font-medium">Subtotal:</span>
              <span className="text-gray-900 font-semibold">
                {formatCurrency(calculations.subtotal)}
              </span>
            </div>

            {calculations.gst.type === 'CGST+SGST' ? (
              <>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    CGST ({calculations.gst.rate / 2}%):
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {formatCurrency(calculations.gst.cgst)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 font-medium">
                    SGST ({calculations.gst.rate / 2}%):
                  </span>
                  <span className="text-gray-900 font-semibold">
                    {formatCurrency(calculations.gst.sgst)}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">IGST ({calculations.gst.rate}%):</span>
                <span className="text-gray-900 font-semibold">
                  {formatCurrency(calculations.gst.amount)}
                </span>
              </div>
            )}

            {calculations.discount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">Discount:</span>
                <span className="text-red-600 font-semibold">
                  -{formatCurrency(calculations.discount)}
                </span>
              </div>
            )}

            {calculations.otherChargesAmount > 0 && (
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 font-medium">
                  Other Charges ({calculations.otherChargesPercent}%):
                </span>
                <span className="text-gray-900 font-semibold">
                  {formatCurrency(calculations.otherChargesAmount)}
                </span>
              </div>
            )}

            <div className="pt-3 border-t-2 border-gray-300">
              <div className="flex justify-between items-center">
                <span className="text-base sm:text-lg font-bold text-gray-900">Grand Total:</span>
                <span className="text-xl sm:text-2xl font-bold text-emerald-700">
                  {formatCurrency(calculations.grandTotal)}
                </span>
              </div>
            </div>

            {/* Amount in Words */}
            {calculations.grandTotal > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowAmountInWords(!showAmountInWords)}
                  className="text-xs sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
                >
                  <DollarSign className="w-4 h-4" />
                  {showAmountInWords ? 'Hide' : 'Show'} amount in words
                </button>
                {showAmountInWords && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-700 italic">
                    {convertAmountToWords(calculations.grandTotal)}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-gray-200">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold text-sm sm:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                Generate Invoice
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            className="flex-1 sm:flex-none px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default ManualBillingForm
