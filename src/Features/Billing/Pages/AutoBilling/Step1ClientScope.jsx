import React, { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import {
  BRANCHES,
  CUSTOMERS,
  STATES,
  CITIES_BY_STATE,
  BILLING_SCOPE_OPTIONS,
} from '../../data/autoBillingData'

const Step1ClientScope = ({ formData, setFormData, onNext, onCancel }) => {
  const [errors, setErrors] = useState({})
  const [availableCities, setAvailableCities] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  // Filter cities based on selected state
  useEffect(() => {
    if (formData.state) {
      setAvailableCities(CITIES_BY_STATE[formData.state] || [])

      // Reset city if it doesn't belong to the new state
      if (formData.city) {
        const cityExists = (CITIES_BY_STATE[formData.state] || []).some(
          (city) => city.name === formData.city
        )
        if (!cityExists) {
          setFormData((prev) => ({ ...prev, city: '' }))
        }
      }
    } else {
      setAvailableCities([])
    }
  }, [formData.state])

  // Filter customers based on branch, state, and city
  useEffect(() => {
    let filtered = CUSTOMERS

    if (formData.branch) {
      filtered = filtered.filter((customer) => customer.branch === formData.branch)
    }

    if (formData.state) {
      filtered = filtered.filter((customer) => customer.state === formData.state)
    }

    if (formData.city) {
      filtered = filtered.filter((customer) => customer.city === formData.city)
    }

    setFilteredCustomers(filtered)

    // Reset customer if it's not in the filtered list
    if (formData.customer) {
      const customerExists = filtered.some((c) => c.name === formData.customer)
      if (!customerExists) {
        setFormData((prev) => ({ ...prev, customer: '', selectedSites: [] }))
        setSelectedCustomer(null)
      }
    }
  }, [formData.branch, formData.state, formData.city])

  // Load selected customer details
  useEffect(() => {
    if (formData.customer) {
      const customer = CUSTOMERS.find((c) => c.name === formData.customer)
      setSelectedCustomer(customer)
    } else {
      setSelectedCustomer(null)
    }
  }, [formData.customer])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleSiteToggle = (siteId) => {
    const currentSites = formData.selectedSites || []
    const isSelected = currentSites.includes(siteId)

    const newSelectedSites = isSelected
      ? currentSites.filter((id) => id !== siteId)
      : [...currentSites, siteId]

    setFormData((prev) => ({ ...prev, selectedSites: newSelectedSites }))
    setErrors((prev) => ({ ...prev, selectedSites: '' }))
  }

  const validateStep = () => {
    const newErrors = {}

    if (!formData.branch) newErrors.branch = 'Branch is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.customer) newErrors.customer = 'Customer is required'
    if (!formData.billingScope) newErrors.billingScope = 'Billing scope is required'

    if (formData.billingScope === BILLING_SCOPE_OPTIONS.SPECIFIC_SITES) {
      if (!formData.selectedSites || formData.selectedSites.length === 0) {
        newErrors.selectedSites = 'Please select at least one site'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Step 1: Select Client & Billing Scope
      </h2>

      {/* Branch, State, City Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* State */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.state || ''}
            onChange={(e) => handleInputChange('state', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              errors.state ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select State</option>
            {STATES.map((state) => (
              <option key={state.id} value={state.name}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.state}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.city || ''}
            onChange={(e) => handleInputChange('city', e.target.value)}
            disabled={!formData.state}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${
              errors.city ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select City</option>
            {availableCities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.city && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.city}
            </p>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Branch <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.branch || ''}
            onChange={(e) => handleInputChange('branch', e.target.value)}
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
              errors.branch ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select Branch</option>
            {BRANCHES.map((branch) => (
              <option key={branch.id} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch && (
            <p className="text-red-500 text-xs mt-1 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.branch}
            </p>
          )}
        </div>
      </div>

      {/* Customer */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Customer <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.customer || ''}
          onChange={(e) => handleInputChange('customer', e.target.value)}
          className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            errors.customer ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select Customer</option>
          {filteredCustomers.map((customer) => (
            <option key={customer.id} value={customer.name}>
              {customer.name}
            </option>
          ))}
        </select>
        {errors.customer && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.customer}
          </p>
        )}
        {filteredCustomers.length === 0 && formData.branch && (
          <p className="text-gray-500 text-xs mt-1">No customers found for the selected filters</p>
        )}
      </div>

      {/* Billing Scope */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Billing Scope <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="billingScope"
              value={BILLING_SCOPE_OPTIONS.ENTIRE_STATE}
              checked={formData.billingScope === BILLING_SCOPE_OPTIONS.ENTIRE_STATE}
              onChange={(e) => {
                handleInputChange('billingScope', e.target.value)
                handleInputChange('selectedSites', [])
              }}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">
              Bill entire State <span className="text-gray-500">(All sites for this customer)</span>
            </span>
          </label>

          <label className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="billingScope"
              value={BILLING_SCOPE_OPTIONS.SPECIFIC_SITES}
              checked={formData.billingScope === BILLING_SCOPE_OPTIONS.SPECIFIC_SITES}
              onChange={(e) => handleInputChange('billingScope', e.target.value)}
              className="w-4 h-4 text-green-600 focus:ring-green-500"
            />
            <span className="ml-3 text-sm font-medium text-gray-700">Bill specific sites only</span>
          </label>
        </div>
        {errors.billingScope && (
          <p className="text-red-500 text-xs mt-1 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            {errors.billingScope}
          </p>
        )}
      </div>

      {/* Site Selection (only if specific sites selected) */}
      {formData.billingScope === BILLING_SCOPE_OPTIONS.SPECIFIC_SITES && selectedCustomer && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Select Sites <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {selectedCustomer.sites.map((site) => (
              <label
                key={site.id}
                className="flex items-start p-3 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-green-50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={(formData.selectedSites || []).includes(site.id)}
                  onChange={() => handleSiteToggle(site.id)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 mt-0.5"
                />
                <div className="ml-3">
                  <span className="text-sm font-medium text-gray-800">{site.name}</span>
                  <p className="text-xs text-gray-500">{site.location}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.selectedSites && (
            <p className="text-red-500 text-xs mt-2 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.selectedSites}
            </p>
          )}
        </div>
      )}

      {/* Selected Customer Info */}
      {selectedCustomer && (
        <div className="mb-6 p-5 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Selected Customer Info:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-semibold text-gray-700">Customer:</span>
              <span className="ml-2 text-gray-900">{selectedCustomer.name}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Total Sites:</span>
              <span className="ml-2 text-gray-900">{selectedCustomer.totalSites} sites</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Active Rate Cards:</span>
              <span className="ml-2 text-gray-900">{selectedCustomer.activeRateCards}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Last Invoice:</span>
              <span className="ml-2 text-gray-900">
                {selectedCustomer.lastInvoice.month} - ₹
                {selectedCustomer.lastInvoice.amount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t">
        <button
          onClick={onCancel}
          className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
        >
          Cancel
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
        >
          Next Step
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Step1ClientScope
