import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Calculator,
  Loader,
  AlertCircle,
  FileText,
  TrendingUp,
  Save,
  ArrowLeft,
  CheckCircle,
  XCircle,
} from 'lucide-react'

const BonusLeaveEncashmentCalculation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const { formData, bonusData, leaveEncashmentData } = location.state || {}

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [poWoNumber, setPoWoNumber] = useState('')
  const [bonusEmployees, setBonusEmployees] = useState([])
  const [leaveEmployees, setLeaveEmployees] = useState([])
  const [calculations, setCalculations] = useState({
    subtotal: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    gstAmount: 0,
    totalTax: 0,
    grandTotal: 0,
    itemCount: 0,
  })

  // Generate PO/WO Number
  useEffect(() => {
    if (formData?.client && formData?.period) {
      const generatedNumber = generatePoWoNumber()
      setPoWoNumber(generatedNumber)
    }
  }, [formData])

  const generatePoWoNumber = () => {
    try {
      const prefix = 'BL'
      const date = new Date()
      const year = date.getFullYear().toString().slice(-2)
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const random = Math.floor(Math.random() * 999) + 1
      const sequentialNumber = `${year}${month}${random.toString().padStart(3, '0')}`
      return `${prefix}-${sequentialNumber}`
    } catch (err) {
      console.error('Error generating PO/WO number:', err)
      return `BL-${Date.now()}`
    }
  }

  // Load and process employee data
  useEffect(() => {
    const loadEmployeeData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!formData || (!bonusData && !leaveEncashmentData)) {
          throw new Error('Missing required data. Please go back and select billing types.')
        }

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Process bonus employees
        if (bonusData && formData.billingType?.bonus) {
          const processedBonus = bonusData.employees.map((emp, index) => ({
            id: `bonus-${index + 1}`,
            employeeId: emp.employeeId,
            employeeName: emp.employeeName,
            designation: emp.designation,
            site: emp.site,
            bonusAmount: emp.bonusAmount,
            type: 'bonus',
          }))
          setBonusEmployees(processedBonus)
        }

        // Process leave employees
        if (leaveEncashmentData && formData.billingType?.leaveEncashment) {
          const processedLeave = leaveEncashmentData.employees.map((emp, index) => ({
            id: `leave-${index + 1}`,
            employeeId: emp.employeeId,
            employeeName: emp.employeeName,
            designation: emp.designation,
            site: emp.site,
            leaveDays: emp.leaveDays,
            dailyRate: emp.dailyRate,
            encashmentAmount: emp.encashmentAmount,
            type: 'leave',
          }))
          setLeaveEmployees(processedLeave)
        }

        setLoading(false)
      } catch (err) {
        console.error('Error loading employee data:', err)
        setError(err.message || 'Failed to load employee data')
        setLoading(false)
      }
    }

    loadEmployeeData()
  }, [formData, bonusData, leaveEncashmentData])

  // Calculate totals
  useEffect(() => {
    if (!loading && (bonusEmployees.length > 0 || leaveEmployees.length > 0)) {
      calculateTotals()
    }
  }, [bonusEmployees, leaveEmployees, loading])

  const calculateTotals = () => {
    try {
      let subtotal = 0
      let itemCount = 0

      // Sum bonus amounts
      if (bonusEmployees.length > 0) {
        const bonusTotal = bonusEmployees.reduce((sum, emp) => sum + (emp.bonusAmount || 0), 0)
        subtotal += bonusTotal
        itemCount++
      }

      // Sum leave encashment amounts
      if (leaveEmployees.length > 0) {
        const leaveTotal = leaveEmployees.reduce((sum, emp) => sum + (emp.encashmentAmount || 0), 0)
        subtotal += leaveTotal
        itemCount++
      }

      // Calculate GST (18% = 9% CGST + 9% SGST)
      const cgst = (subtotal * 9) / 100
      const sgst = (subtotal * 9) / 100
      const igst = 0 // For intra-state, IGST is 0
      const gstAmount = cgst + sgst + igst
      const totalTax = gstAmount
      const grandTotal = subtotal + totalTax

      setCalculations({
        subtotal,
        cgst,
        sgst,
        igst,
        gstAmount,
        totalTax,
        grandTotal,
        itemCount,
      })
    } catch (err) {
      console.error('Error calculating totals:', err)
      setError('Failed to calculate totals')
    }
  }

  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount || 0)
    } catch (err) {
      console.error('Currency formatting error:', err)
      return '₹0.00'
    }
  }

  const handleSaveAsDraft = async () => {
    try {
      setIsSaving(true)
      setError(null)

      const draftData = {
        formData,
        bonusData,
        leaveEncashmentData,
        bonusEmployees,
        leaveEmployees,
        calculations,
        poWoNumber,
        savedAt: new Date().toISOString(),
      }

      const draftKey = `bonus-leave-calculation-draft-${formData.client}-${formData.period}`
      localStorage.setItem(draftKey, JSON.stringify(draftData))

      setSuccess('Calculation saved as draft successfully!')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      console.error('Error saving draft:', err)
      setError('Failed to save draft')
    } finally {
      setIsSaving(false)
    }
  }

  const handleProceedToPreview = () => {
    try {
      if (!poWoNumber.trim()) {
        setError('Please enter PO/WO number before proceeding')
        return
      }

      navigate('/dashboard/billing-manager/bonus-leave-encashment/invoice-preview', {
        state: {
          formData: {
            ...formData,
            poWoNumber,
            branch: `Bonus/Leave Encashment - ${formData.period}`,
          },
          bonusData: bonusData,
          leaveEncashmentData: leaveEncashmentData,
          bonusEmployees,
          leaveEmployees,
          calculations,
        },
      })
    } catch (err) {
      console.error('Navigation error:', err)
      setError('Failed to proceed to preview')
    }
  }

  const handleBack = () => {
    navigate('/dashboard/billing-manager/bonus-leave-encashment/form', {
      state: {
        client: formData.client,
        period: formData.period,
        hasBonus: !!bonusData,
        hasLeaveEncashment: !!leaveEncashmentData,
      },
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 flex flex-col items-center justify-center min-h-[400px]">
            <Loader className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
            <p className="text-gray-600 text-lg font-medium">Processing employee data...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we calculate the billing</p>
          </div>
        </div>
      </div>
    )
  }

  if (error && !bonusEmployees.length && !leaveEmployees.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={handleBack}
                  className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-emerald-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Form</span>
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Billing Calculation
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Review employee-wise calculations for {formData?.client}
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-semibold text-emerald-800">
                Period: {formData?.period}
              </span>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* PO/WO Number */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-emerald-600" />
            <h2 className="text-lg font-bold text-gray-800">Invoice Number</h2>
          </div>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PO/WO Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={poWoNumber}
              onChange={(e) => setPoWoNumber(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter PO/WO number"
            />
            <p className="text-xs text-gray-500 mt-1">Auto-generated. You can modify if needed.</p>
          </div>
        </div>

        {/* Bonus Employee Table */}
        {bonusEmployees.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Bonus Calculation</h2>
                <p className="text-sm text-gray-600">
                  {bonusData?.type} - {bonusEmployees.length} employees
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-purple-600 to-purple-700 text-white">
                    <th className="text-left p-3 font-semibold">Sr. No.</th>
                    <th className="text-left p-3 font-semibold">Employee ID</th>
                    <th className="text-left p-3 font-semibold">Employee Name</th>
                    <th className="text-left p-3 font-semibold">Designation</th>
                    <th className="text-left p-3 font-semibold">Site</th>
                    <th className="text-right p-3 font-semibold">Bonus Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {bonusEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className={`hover:bg-purple-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-3 text-gray-700 font-medium">{index + 1}</td>
                      <td className="p-3 text-gray-700">{emp.employeeId}</td>
                      <td className="p-3 text-gray-900 font-medium">{emp.employeeName}</td>
                      <td className="p-3 text-gray-700">{emp.designation}</td>
                      <td className="p-3 text-gray-700">{emp.site}</td>
                      <td className="p-3 text-right font-bold text-gray-900">
                        {formatCurrency(emp.bonusAmount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-purple-100 to-purple-200 font-bold">
                    <td colSpan="5" className="p-3 text-purple-900 text-right">
                      Total Bonus Amount:
                    </td>
                    <td className="p-3 text-right text-purple-900">
                      {formatCurrency(
                        bonusEmployees.reduce((sum, emp) => sum + emp.bonusAmount, 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leave Encashment Employee Table */}
        {leaveEmployees.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-800">Leave Encashment Calculation</h2>
                <p className="text-sm text-gray-600">
                  Total {leaveEncashmentData?.totalLeaveDays} days - {leaveEmployees.length}{' '}
                  employees
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="text-left p-3 font-semibold">Sr. No.</th>
                    <th className="text-left p-3 font-semibold">Employee ID</th>
                    <th className="text-left p-3 font-semibold">Employee Name</th>
                    <th className="text-left p-3 font-semibold">Designation</th>
                    <th className="text-left p-3 font-semibold">Site</th>
                    <th className="text-center p-3 font-semibold">Leave Days</th>
                    <th className="text-right p-3 font-semibold">Daily Rate</th>
                    <th className="text-right p-3 font-semibold">Encashment Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaveEmployees.map((emp, index) => (
                    <tr
                      key={emp.id}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="p-3 text-gray-700 font-medium">{index + 1}</td>
                      <td className="p-3 text-gray-700">{emp.employeeId}</td>
                      <td className="p-3 text-gray-900 font-medium">{emp.employeeName}</td>
                      <td className="p-3 text-gray-700">{emp.designation}</td>
                      <td className="p-3 text-gray-700">{emp.site}</td>
                      <td className="p-3 text-center text-gray-900 font-semibold">
                        {emp.leaveDays}
                      </td>
                      <td className="p-3 text-right text-gray-900">
                        {formatCurrency(emp.dailyRate)}
                      </td>
                      <td className="p-3 text-right font-bold text-gray-900">
                        {formatCurrency(emp.encashmentAmount)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-200 font-bold">
                    <td colSpan="5" className="p-3 text-blue-900 text-right">
                      Total Days: {leaveEncashmentData?.totalLeaveDays}
                    </td>
                    <td colSpan="2" className="p-3 text-blue-900 text-right">
                      Total Encashment:
                    </td>
                    <td className="p-3 text-right text-blue-900">
                      {formatCurrency(
                        leaveEmployees.reduce((sum, emp) => sum + emp.encashmentAmount, 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Billing Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-800">Billing Summary</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Subtotal</span>
              <span className="text-gray-900 font-bold text-lg">
                {formatCurrency(calculations.subtotal)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <span className="text-blue-700 font-medium">CGST (9%)</span>
                <span className="text-blue-900 font-bold">{formatCurrency(calculations.cgst)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <span className="text-purple-700 font-medium">SGST (9%)</span>
                <span className="text-purple-900 font-bold">
                  {formatCurrency(calculations.sgst)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg border border-gray-300">
              <span className="text-gray-700 font-medium">Total Tax (18%)</span>
              <span className="text-gray-900 font-bold">
                {formatCurrency(calculations.totalTax)}
              </span>
            </div>

            <div className="flex justify-between items-center p-5 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg shadow-md">
              <span className="text-white font-bold text-lg">Grand Total</span>
              <span className="text-white font-bold text-2xl">
                {formatCurrency(calculations.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSaveAsDraft}
            disabled={isSaving}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
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
            onClick={handleProceedToPreview}
            disabled={!poWoNumber.trim()}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Invoice Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default BonusLeaveEncashmentCalculation
