import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  AlertTriangle,
  Calendar,
  Building2,
  Plus,
  Trash2,
  Save,
  FileText,
  Calculator,
  Info,
  CheckCircle,
  X,
  Users,
} from 'lucide-react'
import { RATE_CARDS, PAYROLL_DATA } from '../data/billingCalculationData'

const ArrearBillingForm = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { client, notifications } = location.state || {}

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const [formData, setFormData] = useState({
    client: client || '',
    rateChangeDate: '',
    effectiveDate: '',
    arrearPeriodStart: '',
    arrearPeriodEnd: '',
    invoiceDescription: '',
  })

  const [rateChanges, setRateChanges] = useState([])
  const [manualLineItems, setManualLineItems] = useState([])

  useEffect(() => {
    try {
      if (!notifications || notifications.length === 0) {
        setError('No rate change data found. Please select a client from the list.')
        return
      }

      // Get employee count from PAYROLL_DATA
      const getEmployeeCount = (client, site, designation) => {
        try {
          const payrollData = PAYROLL_DATA[client]?.sites[site]
          if (payrollData) {
            const employee = payrollData.find((p) => p.designation === designation)
            return employee?.numberOfWorkers || 1
          }
          return 1
        } catch {
          return 1
        }
      }

      // Initialize rate changes from notifications
      const initialRateChanges = notifications.map((notif) => {
        const employeeCount = getEmployeeCount(notif.client, notif.site, notif.designation)
        const difference = notif.newDailyRate - notif.oldDailyRate
        // Use total working days from payroll data (not calendar days)
        const workingDays = notif.totalWorkingDays || 65

        return {
          id: notif.id,
          site: notif.site,
          designation: notif.designation,
          oldDailyRate: notif.oldDailyRate,
          newDailyRate: notif.newDailyRate,
          oldMonthlyRate: notif.oldMonthlyRate,
          newMonthlyRate: notif.newMonthlyRate,
          difference,
          employeeCount,
          daysWorked: workingDays,
          totalWorkingDays: workingDays,
          arrearAmount: difference * employeeCount * workingDays,
          rateChangeDate: notif.rateChangeDate,
          effectiveDate: notif.effectiveDate,
        }
      })

      setRateChanges(initialRateChanges)

      // Set dates from first notification
      if (notifications[0]) {
        const rateChangeDate = notifications[0].rateChangeDate
          ? new Date(notifications[0].rateChangeDate)
          : new Date()

        const effectiveDate = notifications[0].effectiveDate
          ? new Date(notifications[0].effectiveDate)
          : new Date()

        // Yesterday (arrear period ends yesterday, new rate effective from today)
        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)

        setFormData((prev) => ({
          ...prev,
          rateChangeDate: rateChangeDate.toISOString().split('T')[0],
          effectiveDate: effectiveDate.toISOString().split('T')[0],
          arrearPeriodStart: rateChangeDate.toISOString().split('T')[0],
          arrearPeriodEnd: yesterday.toISOString().split('T')[0],
        }))
      }
    } catch (err) {
      console.error('Error initializing form:', err)
      setError('Failed to load rate change data.')
    }
  }, [notifications])

  const handleDaysWorkedChange = (index, value) => {
    try {
      const days = parseInt(value) || 0
      if (days < 0 || days > 31) {
        setError('Days worked must be between 0 and 31')
        return
      }

      setRateChanges((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          daysWorked: days,
          arrearAmount: updated[index].difference * updated[index].employeeCount * days,
        }
        return updated
      })
      setError(null)
    } catch (err) {
      console.error('Error updating days worked:', err)
      setError('Failed to update days worked')
    }
  }

  const handleEmployeeCountChange = (index, value) => {
    try {
      const count = parseFloat(value) || 0
      if (count < 0) {
        setError('Employee count cannot be negative')
        return
      }

      setRateChanges((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          employeeCount: count,
          arrearAmount: updated[index].difference * count * updated[index].daysWorked,
        }
        return updated
      })
      setError(null)
    } catch (err) {
      console.error('Error updating employee count:', err)
      setError('Failed to update employee count')
    }
  }

  const handleAddManualLineItem = () => {
    try {
      const newItem = {
        id: `manual-${Date.now()}`,
        description: '',
        rate: 0,
        quantity: 1,
        amount: 0,
      }
      setManualLineItems((prev) => [...prev, newItem])
    } catch (err) {
      console.error('Error adding manual line item:', err)
      setError('Failed to add line item')
    }
  }

  const handleManualLineItemChange = (index, field, value) => {
    try {
      setManualLineItems((prev) => {
        const updated = [...prev]
        updated[index] = {
          ...updated[index],
          [field]: value,
        }

        // Auto-calculate amount if rate or quantity changes
        if (field === 'rate' || field === 'quantity') {
          const rate = field === 'rate' ? parseFloat(value) || 0 : updated[index].rate
          const quantity = field === 'quantity' ? parseFloat(value) || 0 : updated[index].quantity
          updated[index].amount = rate * quantity
        }

        return updated
      })
    } catch (err) {
      console.error('Error updating manual line item:', err)
      setError('Failed to update line item')
    }
  }

  const handleRemoveManualLineItem = (index) => {
    try {
      setManualLineItems((prev) => prev.filter((_, i) => i !== index))
    } catch (err) {
      console.error('Error removing manual line item:', err)
      setError('Failed to remove line item')
    }
  }

  const calculateTotals = () => {
    try {
      // Calculate total arrear amount from rate changes
      const totalArrear = rateChanges.reduce((sum, item) => sum + item.arrearAmount, 0)

      // Calculate total from manual line items
      const manualTotal = manualLineItems.reduce((sum, item) => sum + (item.amount || 0), 0)

      // Subtotal
      const subtotal = totalArrear + manualTotal

      // GST calculation (18% split into CGST 9% + SGST 9%)
      const cgst = subtotal * 0.09
      const sgst = subtotal * 0.09
      const gstAmount = cgst + sgst
      const totalTax = gstAmount

      // Grand total
      const grandTotal = subtotal + gstAmount

      return {
        totalArrear,
        manualTotal,
        subtotal,
        cgst,
        sgst,
        igst: 0,
        gstAmount,
        totalTax,
        grandTotal,
      }
    } catch (err) {
      console.error('Error calculating totals:', err)
      return {
        totalArrear: 0,
        manualTotal: 0,
        subtotal: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstAmount: 0,
        totalTax: 0,
        grandTotal: 0,
      }
    }
  }

  const totals = calculateTotals()

  const handleSaveAsDraft = async () => {
    try {
      setIsSaving(true)
      setError(null)

      // Validation
      if (!formData.arrearPeriodStart || !formData.arrearPeriodEnd) {
        setError('Please select arrear period start and end dates')
        setIsSaving(false)
        return
      }

      // Save draft logic here
      const draftData = {
        ...formData,
        rateChanges,
        manualLineItems,
        totals,
        savedAt: new Date().toISOString(),
        status: 'draft',
      }

      console.log('Saving draft:', draftData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccess('Draft saved successfully!')
      setIsSaving(false)

      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err) {
      console.error('Error saving draft:', err)
      setError('Failed to save draft. Please try again.')
      setIsSaving(false)
    }
  }

  const handleGenerateInvoice = async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Validation
      if (!formData.arrearPeriodStart || !formData.arrearPeriodEnd) {
        setError('Please select arrear period start and end dates')
        setIsLoading(false)
        return
      }

      if (!formData.invoiceDescription.trim()) {
        setError('Please enter invoice description')
        setIsLoading(false)
        return
      }

      if (rateChanges.some((item) => item.daysWorked === 0)) {
        setError('Days worked cannot be zero for any line item')
        setIsLoading(false)
        return
      }

      // Simulate processing
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Navigate to invoice preview with all data
      navigate('/dashboard/billing-manager/arrear-billing/invoice-preview', {
        state: {
          formData,
          rateChanges,
          manualLineItems,
          calculations: totals,
        },
      })
    } catch (err) {
      console.error('Error generating invoice:', err)
      setError('Failed to generate invoice. Please try again.')
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate(-1)
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

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (!client || !notifications) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Data Found</h2>
          <p className="text-gray-600 mb-6">
            Please select a client from the Arrear Billing list to continue.
          </p>
          <button
            onClick={() => navigate('/dashboard/billing-manager/arrear-billing')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back to List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-3 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Arrear Billing List</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Arrear Billing - Rate Change Adjustment
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Automatically calculate back payments when client rates are updated retroactively
              </p>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-700">{success}</p>
            </div>
            <button
              onClick={() => setSuccess(null)}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Rate Change Detection Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-yellow-900">
              ⚠️ Rate Change Detected: <span className="font-bold">{client}</span> rate updated on{' '}
              {formatDate(formData.rateChangeDate)}. Arrear calculation required for previous
              periods.
            </p>
          </div>
        </div>

        {/* Effective Date Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-2">
              📌 Understanding Arrear Billing Logic
            </p>
            <p className="text-xs text-blue-700 mb-2">
              <strong>Rate Change Date (Past):</strong> When the rate was actually changed (e.g.,
              Nov 1, 2025)
            </p>
            <p className="text-xs text-blue-700 mb-2">
              <strong>Effective Date (Today):</strong> When the NEW rate becomes effective going
              forward (e.g., Today - Jan 10, 2026)
            </p>
            <p className="text-xs text-blue-700 mb-2">
              <strong>Arrear Period:</strong> From Rate Change Date to Yesterday (Nov 1, 2025 to Jan
              9, 2026)
            </p>
            <div className="mt-3 p-3 bg-white rounded border border-blue-200">
              <p className="text-xs text-blue-900 font-medium mb-1">💡 Example Scenario:</p>
              <p className="text-xs text-blue-700">
                • Rate increased from ₹800 to ₹850 on <strong>Nov 1, 2025</strong> (Rate Change
                Date)
                <br />• Arrear period: <strong>Nov 1, 2025 to Jan 9, 2026</strong> (Yesterday)
                <br />• Working Days from Payroll: <strong>65 days</strong> (actual work days, not
                calendar days)
                <br />• New rate effective from: <strong>Today (Jan 10, 2026)</strong>
                <br />• Arrear Amount = ₹50 difference × 4 employees × 65 working days ={' '}
                <strong>₹13,000</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building2 className="w-4 h-4 inline mr-1" />
                Client *
              </label>
              <input
                type="text"
                value={formData.client}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Auto-selected based on rate change</p>
            </div>

            {/* Rate Change Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Rate Change Date (Past)
              </label>
              <input
                type="date"
                value={formData.rateChangeDate}
                disabled
                className="w-full px-3 py-2 border border-orange-300 rounded-lg bg-orange-50 text-orange-900 cursor-not-allowed font-medium"
              />
              <p className="text-xs text-orange-600 mt-1 font-medium">
                📅 Past date when the rate was actually changed (e.g., November 2025)
              </p>
            </div>

            {/* Effective Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Effective Date (Today)
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                disabled
                className="w-full px-3 py-2 border border-blue-300 rounded-lg bg-blue-50 text-blue-900 cursor-not-allowed font-medium"
              />
              <p className="text-xs text-blue-600 mt-1 font-medium">
                ✅ Date from which the NEW rate applies going forward (Today - Jan 10, 2026)
              </p>
            </div>

            {/* Arrear Period Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Arrear Period Start *
              </label>
              <input
                type="date"
                value={formData.arrearPeriodStart}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, arrearPeriodStart: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-50 text-green-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-green-600 mt-1 font-medium">
                📍 Same as Rate Change Date (November 2025)
              </p>
            </div>

            {/* Arrear Period End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Arrear Period End *
              </label>
              <input
                type="date"
                value={formData.arrearPeriodEnd}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, arrearPeriodEnd: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-green-50 text-green-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <p className="text-xs text-green-600 mt-1 font-medium">
                📍 Yesterday (Jan 9, 2026) - Last day of old rate
              </p>
            </div>
          </div>
        </div>

        {/* Rate Changes Summary */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Rate Changes Summary
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Site
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Designation
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Old Rate (₹)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    New Rate (₹)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Difference (₹)
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Employee Count
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                    Working Days (Payroll)
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Arrear Amount (₹)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rateChanges.map((item, index) => (
                  <tr key={item.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900 border-r border-gray-200">
                      {item.site}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      {item.designation}
                    </td>
                    <td className="px-4 py-3 text-sm text-right text-gray-700 border-r border-gray-200">
                      {formatCurrency(item.oldDailyRate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-semibold text-blue-700 border-r border-gray-200">
                      {formatCurrency(item.newDailyRate)}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-semibold border-r border-gray-200 ${
                        item.difference > 0 ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {item.difference > 0 ? '+' : ''}
                      {formatCurrency(item.difference)}
                    </td>
                    <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                      <div className="flex items-center justify-center gap-1">
                        <Users className="w-3 h-3 text-gray-500" />
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={item.employeeCount}
                          onChange={(e) => handleEmployeeCountChange(index, e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-center border-r border-gray-200">
                      <input
                        type="number"
                        min="0"
                        max="31"
                        value={item.daysWorked}
                        onChange={(e) => handleDaysWorkedChange(index, e.target.value)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-right font-bold text-blue-900">
                      {formatCurrency(item.arrearAmount)}
                    </td>
                  </tr>
                ))}
                <tr className="bg-blue-50 font-bold">
                  <td colSpan="7" className="px-4 py-3 text-right text-sm text-gray-900">
                    Total Arrear Amount:
                  </td>
                  <td className="px-4 py-3 text-right text-lg text-blue-900">
                    {formatCurrency(totals.totalArrear)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Manual Line Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gradient-to-r from-green-50 to-green-100 border-b border-green-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Manual Line Items (Optional)
            </h2>
            <button
              onClick={handleAddManualLineItem}
              className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              Add Line Item
            </button>
          </div>

          {manualLineItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Rate (₹)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider border-r border-gray-200">
                      Amount (₹)
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {manualLineItems.map((item, index) => (
                    <tr key={item.id} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 border-r border-gray-200">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) =>
                            handleManualLineItemChange(index, 'description', e.target.value)
                          }
                          placeholder="Enter description"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.rate}
                          onChange={(e) =>
                            handleManualLineItemChange(index, 'rate', e.target.value)
                          }
                          className="w-full px-2 py-1 border border-gray-300 rounded text-right text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-gray-200">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleManualLineItemChange(index, 'quantity', e.target.value)
                          }
                          className="w-24 mx-auto px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900 border-r border-gray-200">
                        {formatCurrency(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleRemoveManualLineItem(index)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {manualLineItems.length > 0 && (
                    <tr className="bg-green-50 font-bold">
                      <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">
                        Manual Items Total:
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-green-900" colSpan="2">
                        {formatCurrency(totals.manualTotal)}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Info className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm">No manual line items added</p>
              <p className="text-xs text-gray-400 mt-1">
                Click "Add Line Item" to add additional charges
              </p>
            </div>
          )}
        </div>

        {/* Calculation Formula */}
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Calculation Formula Applied:
          </h3>
          <div className="text-sm text-blue-800 space-y-2">
            <p className="font-semibold">
              <span className="font-mono bg-white px-3 py-1.5 rounded border border-blue-200 inline-block">
                Arrear Amount = (New Rate - Old Rate) × Employee Count × Working Days from Payroll
              </span>
            </p>
            <div className="bg-white rounded p-3 border border-blue-200">
              <p className="text-xs text-blue-900 font-semibold mb-1">Example Calculation:</p>
              <p className="text-xs text-blue-700">
                • Rate Difference: ₹{rateChanges[0]?.difference || 50}/day per employee
              </p>
              <p className="text-xs text-blue-700">
                • Employee Count: {rateChanges[0]?.employeeCount || 4} employees
              </p>
              <p className="text-xs text-blue-700">
                • Working Days (from Payroll): {rateChanges[0]?.totalWorkingDays || 65} days
              </p>
              <p className="text-xs text-blue-700 mt-2 font-semibold">
                = ₹{rateChanges[0]?.difference || 50} × {rateChanges[0]?.employeeCount || 4} ×{' '}
                {rateChanges[0]?.totalWorkingDays || 65} = ₹
                {formatCurrency(
                  (rateChanges[0]?.difference || 50) *
                    (rateChanges[0]?.employeeCount || 4) *
                    (rateChanges[0]?.totalWorkingDays || 65)
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Invoice Description */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="w-4 h-4 inline mr-1" />
            Invoice Description *
          </label>
          <textarea
            value={formData.invoiceDescription}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, invoiceDescription: e.target.value }))
            }
            placeholder="Enter invoice description (e.g., Rate adjustment arrears for ABC Mall - June to August 2024 (New rates effective from September 15, 2024))"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
        </div>

        {/* Arrear Invoice Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 p-6 mb-6">
          <h2 className="text-lg font-bold text-blue-900 mb-4">Arrear Invoice Summary:</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">
                Period: {formatDate(formData.arrearPeriodStart)} to{' '}
                {formatDate(formData.arrearPeriodEnd)}
              </span>
            </div>
            <div className="flex justify-between text-base border-t border-blue-300 pt-2">
              <span className="font-medium text-gray-900">Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between text-base">
              <span className="font-medium text-gray-900">GST (18%):</span>
              <span className="font-semibold text-gray-900">
                {formatCurrency(totals.gstAmount)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t-2 border-blue-400 pt-2">
              <span className="text-blue-900">Total:</span>
              <span className="text-blue-900">{formatCurrency(totals.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleCancel}
            className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveAsDraft}
            disabled={isSaving}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save as Draft
              </>
            )}
          </button>
          <button
            onClick={handleGenerateInvoice}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Arrear Invoice
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ArrearBillingForm
