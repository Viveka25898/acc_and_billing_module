/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeft,
  Gift,
  Briefcase,
  FileText,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Save,
  Calculator,
  Info,
  XCircle,
} from 'lucide-react'
import { getPayrollData, hasPayrollDataType } from '../data/bonusLeavePayrollData'

const BonusLeaveEncashmentForm = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {
    client,
    period,
    hasBonus: propHasBonus,
    hasLeaveEncashment: propHasLeaveEncashment,
  } = location.state || {}

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [warning, setWarning] = useState(null)

  const [formData, setFormData] = useState({
    client: client || '',
    period: period || '',
  })

  const [billingType, setBillingType] = useState({
    bonus: false,
    leaveEncashment: false,
  })

  const [payrollData, setPayrollData] = useState(null)
  const [bonusData, setBonusData] = useState(null)
  const [leaveEncashmentData, setLeaveEncashmentData] = useState(null)

  // Validate and load data on mount
  useEffect(() => {
    if (!client || !period) {
      setError('Missing client or period information. Redirecting back...')
      setTimeout(() => navigate(-1), 2000)
      return
    }

    loadPayrollData()
  }, [client, period])

  // Validate billing type selection
  useEffect(() => {
    validateBillingTypeSelection()
  }, [billingType])

  const loadPayrollData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800))

      const data = getPayrollData(client, period)

      if (!data) {
        setError('No payroll data found for the selected client and period.')
        setTimeout(() => navigate(-1), 2000)
        return
      }

      setPayrollData(data)
      setBonusData(data.bonus)
      setLeaveEncashmentData(data.leaveEncashment)
    } catch (err) {
      console.error('Error loading payroll data:', err)
      setError('Failed to load payroll data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const validateBillingTypeSelection = () => {
    try {
      setWarning(null)

      const { bonus, leaveEncashment } = billingType

      // No selection
      if (!bonus && !leaveEncashment) {
        return
      }

      // Check if selected bonus but no bonus data available
      if (bonus && !bonusData) {
        setWarning(
          `⚠️ Bonus data is not available for ${client} - ${period}. Please uncheck the Bonus option or select a different period.`
        )
        return
      }

      // Check if selected leave encashment but no leave data available
      if (leaveEncashment && !leaveEncashmentData) {
        setWarning(
          `⚠️ Leave Encashment data is not available for ${client} - ${period}. Please uncheck the Leave Encashment option or select a different period.`
        )
        return
      }

      // Both selected but both are unavailable
      if (bonus && leaveEncashment && !bonusData && !leaveEncashmentData) {
        setWarning(
          `⚠️ Neither Bonus nor Leave Encashment data is available for ${client} - ${period}. Please select a different period.`
        )
        return
      }
    } catch (err) {
      console.error('Error validating billing type:', err)
    }
  }

  const calculateTotals = () => {
    try {
      let subtotal = 0
      let itemCount = 0

      if (billingType.bonus && bonusData) {
        subtotal += bonusData.totalBonusAmount
        itemCount += bonusData.employees.length
      }

      if (billingType.leaveEncashment && leaveEncashmentData) {
        subtotal += leaveEncashmentData.totalEncashmentAmount
        itemCount += leaveEncashmentData.employees.length
      }

      const gstRate = 0.18
      const gstAmount = subtotal * gstRate
      const cgst = gstAmount / 2
      const sgst = gstAmount / 2
      const grandTotal = subtotal + gstAmount

      return {
        subtotal,
        cgst,
        sgst,
        igst: 0,
        gstAmount,
        totalTax: gstAmount,
        grandTotal,
        itemCount,
      }
    } catch (err) {
      console.error('Error calculating totals:', err)
      return {
        subtotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstAmount: 0,
        totalTax: 0,
        grandTotal: 0,
        itemCount: 0,
      }
    }
  }

  const totals = calculateTotals()

  const handleBillingTypeChange = (type) => {
    try {
      setError(null)
      setBillingType((prev) => ({
        ...prev,
        [type]: !prev[type],
      }))
    } catch (err) {
      console.error('Error changing billing type:', err)
      setError('Failed to update billing type selection.')
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      setSuccess(null)

      // Validation
      if (!billingType.bonus && !billingType.leaveEncashment) {
        setError('Please select at least one billing type (Bonus or Leave Encashment).')
        setIsGenerating(false)
        return
      }

      // Check if selected types have data
      if (billingType.bonus && !bonusData) {
        setError('Bonus data is not available. Please uncheck the Bonus option.')
        setIsGenerating(false)
        return
      }

      if (billingType.leaveEncashment && !leaveEncashmentData) {
        setError(
          'Leave Encashment data is not available. Please uncheck the Leave Encashment option.'
        )
        setIsGenerating(false)
        return
      }

      if (totals.subtotal === 0) {
        setError('Total amount cannot be zero. Please check your selection.')
        setIsGenerating(false)
        return
      }

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Navigate to calculation page
      navigate('/dashboard/billing-manager/bonus-leave-encashment/calculation', {
        state: {
          formData: {
            client,
            period,
            billingType,
          },
          bonusData: billingType.bonus ? bonusData : null,
          leaveEncashmentData: billingType.leaveEncashment ? leaveEncashmentData : null,
        },
      })
    } catch (err) {
      console.error('Error generating invoice:', err)
      setError('Failed to generate invoice. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // Validation
      if (!billingType.bonus && !billingType.leaveEncashment) {
        setError('Please select at least one billing type before saving as draft.')
        setIsSaving(false)
        return
      }

      // Simulate save
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage
      const draftData = {
        formData: {
          ...formData,
          billingType,
        },
        bonusData: billingType.bonus ? bonusData : null,
        leaveEncashmentData: billingType.leaveEncashment ? leaveEncashmentData : null,
        calculations: totals,
        savedAt: new Date().toISOString(),
      }

      localStorage.setItem(`bonus-leave-draft-${client}-${period}`, JSON.stringify(draftData))

      setSuccess('Draft saved successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error saving draft:', err)
      setError('Failed to save draft. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading payroll data...</p>
        </div>
      </div>
    )
  }

  if (!client || !period || !payrollData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Data Not Available</h2>
          <p className="text-gray-600 mb-6">
            No payroll data found for the selected client and period.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to List</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Bonus & Leave Encashment Billing
              </h1>
              <p className="text-sm text-gray-600">
                Configure billing for {client} - {period}
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Warning Message */}
        {warning && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-700">{warning}</p>
          </div>
        )}

        {/* Payroll Data Confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800 mb-1">✓ Payroll Data Received</p>
              <p className="text-xs text-green-700">
                {bonusData && leaveEncashmentData
                  ? 'Festival bonus and leave encashment data imported from Payroll module'
                  : bonusData
                    ? 'Festival bonus data imported from Payroll module'
                    : 'Leave encashment data imported from Payroll module'}{' '}
                for {period}.
              </p>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Client & Period Info */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-purple-100 mb-1 block">Client *</label>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white font-semibold">{formData.client}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-purple-100 mb-1 block">
                  Billing Period *
                </label>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-white font-semibold">{formData.period}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Type Selection */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Billing Type *
            </h3>

            <div className="space-y-4">
              {/* Festival Bonus */}
              <div
                className={`border-2 rounded-lg p-4 transition-all ${
                  billingType.bonus
                    ? 'border-purple-500 bg-purple-50'
                    : bonusData
                      ? 'border-gray-200 hover:border-purple-300'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingType.bonus}
                    onChange={() => handleBillingTypeChange('bonus')}
                    disabled={!bonusData}
                    className="mt-1 w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Gift className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-gray-900">Festival Bonus</span>
                      {!bonusData && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Not Available
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Add bonus payments to client invoice</p>
                    {bonusData && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>
                          • Type: <span className="font-medium">{bonusData.type}</span>
                        </p>
                        <p>
                          • Employees:{' '}
                          <span className="font-medium">{bonusData.employees.length}</span>
                        </p>
                        <p>
                          • Amount:{' '}
                          <span className="font-bold text-purple-700">
                            {formatCurrency(bonusData.totalBonusAmount)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Leave Encashment */}
              <div
                className={`border-2 rounded-lg p-4 transition-all ${
                  billingType.leaveEncashment
                    ? 'border-blue-500 bg-blue-50'
                    : leaveEncashmentData
                      ? 'border-gray-200 hover:border-blue-300'
                      : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={billingType.leaveEncashment}
                    onChange={() => handleBillingTypeChange('leaveEncashment')}
                    disabled={!leaveEncashmentData}
                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">Leave Encashment</span>
                      {!leaveEncashmentData && (
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">
                          Not Available
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">Add leave encashment to client invoice</p>
                    {leaveEncashmentData && (
                      <div className="mt-2 text-sm text-gray-700">
                        <p>
                          • Employees:{' '}
                          <span className="font-medium">
                            {leaveEncashmentData.employees.length}
                          </span>
                        </p>
                        <p>
                          • Total Leave Days:{' '}
                          <span className="font-medium">{leaveEncashmentData.totalLeaveDays}</span>
                        </p>
                        <p>
                          • Amount:{' '}
                          <span className="font-bold text-blue-700">
                            {formatCurrency(leaveEncashmentData.totalEncashmentAmount)}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                </label>
              </div>
            </div>

            {/* Info Note */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-semibold">Note:</span> Select at least one component to
                generate the invoice. A separate invoice will be created for the selected
                components.
              </p>
            </div>
          </div>

          {/* Billing Summary */}
          {(billingType.bonus || billingType.leaveEncashment) && !warning && (
            <div className="p-6 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-purple-600" />
                Billing Summary
              </h3>

              <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({totals.itemCount} employees)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">CGST (9%)</span>
                  <span className="text-gray-700">{formatCurrency(totals.cgst)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">SGST (9%)</span>
                  <span className="text-gray-700">{formatCurrency(totals.sgst)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between">
                  <span className="font-bold text-gray-900">Grand Total</span>
                  <span className="font-bold text-purple-700 text-lg">
                    {formatCurrency(totals.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAsDraft}
                disabled={isSaving || (!billingType.bonus && !billingType.leaveEncashment)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save as Draft
                  </>
                )}
              </button>

              <button
                onClick={handleGenerateInvoice}
                disabled={
                  isGenerating || (!billingType.bonus && !billingType.leaveEncashment) || warning
                }
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
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
                onClick={() => navigate(-1)}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BonusLeaveEncashmentForm
