/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, FileText, Save } from 'lucide-react'

const Step3InvoiceConfig = ({ formData, setFormData, onNext, onPrevious }) => {
  const [errors, setErrors] = useState({})

  const invoiceSeriesOptions = [
    {
      id: 'proforma',
      label: 'Proforma Invoice',
      description: 'Draft invoice for client approval',
    },
    {
      id: 'sales',
      label: 'Sales Invoice',
      description: 'Final tax invoice for payment',
    },
  ]

  const invoiceTypes = [
    { value: 'REGULAR', label: 'Regular' },
    { value: 'ADVANCE', label: 'Advance' },
    { value: 'ADJUSTMENT', label: 'Adjustment' },
    { value: 'CREDIT_NOTE', label: 'Credit Note' },
  ]

  // Get site filter options based on selected sites from Step 1
  const getSiteFilterOptions = () => {
    const options = [{ value: 'all', label: 'All Sites' }]

    if (formData.selectedSites && formData.selectedSites.length > 0) {
      formData.selectedSites.forEach((site) => {
        options.push({ value: site.id, label: site.name })
      })
    }

    return options
  }

  // Data validation checks
  const validationChecks = [
    { id: 1, label: 'Certified attendance sheets uploaded', status: 'success' },
    { id: 2, label: 'Rate cards configured for all sites', status: 'success' },
    { id: 3, label: 'Payroll processing completed', status: 'success' },
    { id: 4, label: '2 OT approvals pending', status: 'warning' },
    { id: 5, label: 'Client agreement active', status: 'success' },
    { id: 6, label: 'Previous month reconciliation complete', status: 'success' },
  ]

  const handleInvoiceSeriesChange = (seriesId) => {
    setFormData((prev) => ({ ...prev, invoiceSeries: seriesId }))
    setErrors((prev) => ({ ...prev, invoiceSeries: '' }))
  }

  const handleInvoiceTypeChange = (e) => {
    setFormData((prev) => ({ ...prev, invoiceType: e.target.value }))
    setErrors((prev) => ({ ...prev, invoiceType: '' }))
  }

  const handleSiteFilterChange = (e) => {
    setFormData((prev) => ({ ...prev, siteFilter: e.target.value }))
  }

  const validateStep = () => {
    const newErrors = {}

    if (!formData.invoiceSeries) {
      newErrors.invoiceSeries = 'Please select an invoice series'
    }

    if (!formData.invoiceType) {
      newErrors.invoiceType = 'Please select an invoice type'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const handleSaveConfiguration = () => {
    if (validateStep()) {
      // Save configuration logic (to localStorage or state)
      console.log('Configuration saved:', formData)
      alert('Configuration saved successfully!')
    }
  }

  // Format billing period display
  const getBillingPeriodDisplay = () => {
    if (formData.selectedBillingCycle && formData.selectedMonth) {
      const [year, month] = formData.selectedMonth.split('-')
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]
      return `${monthNames[parseInt(month) - 1]} ${year}`
    }
    return 'Not selected'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Invoice Configuration</h2>
        <p className="text-gray-600 text-sm flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Configure invoice settings for billing generation
        </p>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Left Column */}
        <div>
          {/* Invoice Series */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Invoice Series <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              {invoiceSeriesOptions.map((option) => {
                const isSelected = formData.invoiceSeries === option.id
                return (
                  <div
                    key={option.id}
                    onClick={() => handleInvoiceSeriesChange(option.id)}
                    className={`
                      border-2 rounded-lg p-4 cursor-pointer transition-all duration-200
                      ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-300 hover:border-green-300 bg-white'
                      }
                    `}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="invoiceSeries"
                        checked={isSelected}
                        onChange={() => handleInvoiceSeriesChange(option.id)}
                        className="w-5 h-5 text-green-600 focus:ring-green-500 mt-0.5 cursor-pointer"
                      />
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900">{option.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            {errors.invoiceSeries && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.invoiceSeries}
              </div>
            )}
          </div>

          {/* Invoice Type */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Invoice Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.invoiceType || ''}
              onChange={handleInvoiceTypeChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
                errors.invoiceType ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">-- Select Invoice Type --</option>
              {invoiceTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.invoiceType && (
              <div className="mt-2 flex items-center text-red-600 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.invoiceType}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Billing Period (Read-only from Step 2) */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Billing Period <span className="text-red-500">*</span>
            </label>
            <div className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-medium">
              {getBillingPeriodDisplay()}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              From: {formData.selectedBillingCycle?.cycleFrom || 'N/A'} → To:{' '}
              {formData.selectedBillingCycle?.cycleTo || 'N/A'}
            </p>
          </div>

          {/* Additional Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Filter
            </label>
            <select
              value={formData.siteFilter || 'all'}
              onChange={handleSiteFilterChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
            >
              {getSiteFilterOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Selected Configuration Summary */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-bold text-gray-800 mb-3">Selected Configuration Summary:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Customer:</span>
            <p className="font-semibold text-gray-900">{formData.customer || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-gray-600">Billing Period:</span>
            <p className="font-semibold text-gray-900">{getBillingPeriodDisplay()}</p>
          </div>
          <div>
            <span className="text-gray-600">Billing Scope:</span>
            <p className="font-semibold text-gray-900">
              {formData.billingScope === 'state'
                ? 'Entire State'
                : `Selected Sites (${formData.selectedSites?.length || 0})`}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Invoice Type:</span>
            <p className="font-semibold text-gray-900">{formData.invoiceType || 'Not selected'}</p>
          </div>
          <div>
            <span className="text-gray-600">Invoice Series:</span>
            <p className="font-semibold text-gray-900">
              {formData.invoiceSeries === 'proforma'
                ? 'Proforma Invoice'
                : formData.invoiceSeries === 'sales'
                  ? 'Sales Invoice'
                  : 'Not selected'}
            </p>
          </div>
          <div>
            <span className="text-gray-600">Expected Sites:</span>
            <p className="font-semibold text-gray-900">
              {formData.selectedSites?.map((s) => s.name).join(', ') || 'All Sites'}
            </p>
          </div>
        </div>
      </div>

      {/* Data Validation Check */}

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-between items-center pt-6 mt-6 border-t gap-3">
        <button
          onClick={onPrevious}
          className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous Step
        </button>

        <div className="flex gap-3">
          <button
            onClick={handleSaveConfiguration}
            className="px-6 py-2.5 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium flex items-center"
          >
            <Save className="w-5 h-5 mr-2" />
            Save Configuration
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
          >
            Next: Calculate Billing
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Step3InvoiceConfig
