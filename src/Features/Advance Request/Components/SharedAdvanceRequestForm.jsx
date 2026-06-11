/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import {
  createAdvanceRequest,
  clearSubmitResult,
  clearErrors,
  selectSubmitResult,
  selectLoading,
  selectErrors,
} from '../../../store/slices/advanceRequestSlice'
import { selectAuthContext } from '../../../Auth/authSlice'

// ─── Workflow Status Messages (Backend Now Determines Actual Status) ──────────
// Frontend only shows next expected level for UI messages
const ROLE_CONFIG = {
  employee: {
    nextApprovalLevel: 'Line Manager',
  },
  'line-manager': {
    nextApprovalLevel: 'VP Operations',
  },
  'compliance-team': {
    nextApprovalLevel: 'VP Operations',
  },
  'compliance-manager': {
    nextApprovalLevel: 'VP Operations',
  },
  'payroll-team': {
    nextApprovalLevel: 'VP Operations',
  },
  'operation-executive': {
    nextApprovalLevel: 'VP Operations',
  },
  manager: {
    nextApprovalLevel: 'Account Executive',
  },
  'vp-operations': {
    nextApprovalLevel: 'Account Executive',
  },
}

const REASON_OPTIONS = [
  'Visit to Client',
  'Travelling Allowance',
  'Petrol Expense',
  'Office Expense',
  'Other',
]

// ─── Component ────────────────────────────────────────────────────────────────
const SharedAdvanceRequestForm = ({
  role = 'employee',
  myRequestsPath = '/dashboard/employee/my-requests',
}) => {
  const dispatch = useDispatch()
  const submitResult = useSelector(selectSubmitResult)
  const loading = useSelector(selectLoading)
  const errors = useSelector(selectErrors)
  // ✅ Step 4.2: Get auth context from Redux (replaces localStorage)
  const authContext = useSelector(selectAuthContext)

  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG['employee']

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    reasons: [],
    customReason: '',
    requestDate: new Date().toISOString().slice(0, 10),
  })

  const [localError, setLocalError] = useState('')
  const [isPreFilled, setIsPreFilled] = useState(false)
  const prefillRef = React.useRef(false)  // ✅ Prevent re-runs with ref

  // ✅ Step 4.3: Pre-fill from Redux auth state (replaces localStorage lookup)
  // ✅ Only run ONCE on mount to prevent overwriting user input
  useEffect(() => {
    // ✅ Use ref to prevent re-running even if deps array changes
    if (prefillRef.current) return
    if (!authContext) return  // Not logged in yet, skip
    
    try {
      // ─── Extract empId and empName from Redux auth context ─────────────────
      // Our authSlice stores: { empId, empName, email, role, region }
      // Old field names (employeeId / employeeName) no longer exist in the store
      const empId   = authContext?.empId   || authContext?.email || ''
      const empName = authContext?.empName || authContext?.email || ''

      // ✅ Validate before setting
      if (typeof empId !== 'string' || typeof empName !== 'string') {
        throw new Error('Invalid auth context data')
      }

      setFormData((prev) => ({
        ...prev,
        employeeId: empId,
        employeeName: empName,
      }))
      prefillRef.current = true  // ✅ Mark as done with ref
      setIsPreFilled(true)
    } catch (error) {
      console.error('Failed to pre-fill form from auth context:', error)
      setLocalError('Unable to auto-fill employee details. Please enter manually.')
      prefillRef.current = true  // ✅ Mark as attempted
      setIsPreFilled(true)
    }
  }, [])  // ✅ Empty dependency array = run ONLY once on mount

  // ── Clear submit result when unmounting ────────────────────────────────────
  useEffect(() => {
    return () => { dispatch(clearSubmitResult()) }
  }, [dispatch])

  // ── Show toast for service errors ──────────────────────────────────────────
  useEffect(() => {
    if (errors.submit) {
      // ✅ Step 9.3: Show server error in toast
      toast.error(`❌ ${errors.submit}`)
    }
  }, [errors.submit])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    // ✅ Clear error when user starts editing
    setLocalError('')
    dispatch(clearErrors())  // ✅ Clear Redux errors too
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReasonSelect = (e) => {
    const selected = e.target.value
    e.target.value = ''
    if (selected && !formData.reasons.includes(selected)) {
      setFormData((prev) => ({ ...prev, reasons: [...prev.reasons, selected] }))
    }
  }

  const handleReasonRemove = (reasonToRemove) => {
    setFormData((prev) => ({
      ...prev,
      reasons: prev.reasons.filter((r) => r !== reasonToRemove),
      customReason: reasonToRemove === 'Other' ? '' : prev.customReason,
    }))
  }

  const isFormValid = () => {
    const { employeeName, employeeId, amount, reasons, customReason } = formData
    if (!employeeName.trim() || !employeeId.trim() || !amount || Number(amount) <= 0) return false
    if (reasons.length === 0) return false
    if (reasons.includes('Other') && !customReason.trim()) return false
    return true
  }

  // ── Submit → dispatch createAdvanceRequest thunk ───────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()
    setLocalError('')
    
    console.log('📤 Form submitted. Validating...', formData)

    // ✅ Step 9.2: Client-side validation before submit
    if (!isFormValid()) {
      const msg = 'Please fill in all required fields.'
      console.warn('❌ Form validation failed:', msg, formData)
      setLocalError(msg)
      return
    }

    try {
      // ✅ Step 9.2: Try-catch for form preparation errors
      // Build API-ready payload
      const finalReasons = formData.reasons.map((r) =>
        r === 'Other' && formData.customReason.trim() ? formData.customReason.trim() : r
      )

      // Validate employeeId and employeeName before submit (edge cases)
      const empId = formData.employeeId?.trim()
      const empName = formData.employeeName?.trim()

      console.log('✅ Employee Info:', { empId, empName })

      if (!empId) {
        const msg = 'Employee ID is required. Please refresh and try again.'
        console.warn('❌', msg)
        setLocalError(msg)
        return
      }
      if (!empName) {
        const msg = 'Employee Name is required. Please enter your name.'
        console.warn('❌', msg)
        setLocalError(msg)
        return
      }

      // Build payload
      const payload = {
        employeeName: empName,
        employeeId: empId,
        amount: formData.amount,
        reason: finalReasons,
        customReason: formData.reasons.includes('Other') ? formData.customReason : '',
        requestDate: formData.requestDate,
      }

      console.log('📦 Submitting payload:', payload)

      // ✅ Step 9.2: Dispatch with error handling
      const dispatchResult = dispatch(createAdvanceRequest(payload))
      
      console.log('✅ Dispatch called, waiting for response...', dispatchResult)
      
      // Handle async thunk completion
      if (dispatchResult && typeof dispatchResult.then === 'function') {
        dispatchResult
          .then((result) => {
            console.log('✅ Thunk completed successfully:', result)
          })
          .catch((error) => {
            console.error('❌ Thunk error:', error)
            setLocalError('An unexpected error occurred. Please try again.')
          })
      }
    } catch (error) {
      // ✅ Step 9.3: Catch validation/preparation errors
      console.error('❌ Error preparing advance request:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare request'
      setLocalError(`Validation error: ${errorMessage}`)
      // ✅ Also show in toast for visibility
      toast.error(`Error: ${errorMessage}`)
    }
  }

  const handleReset = () => {
    dispatch(clearSubmitResult())
    setFormData((prev) => ({
      ...prev,
      amount: '',
      reasons: [],
      customReason: '',
      requestDate: new Date().toISOString().slice(0, 10),
    }))
  }

  const isSubmitting = loading.submit

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5 flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                💼 Advance Request
              </h1>
              <p className="text-green-100 text-sm mt-0.5">Fill the form to submit your advance request</p>
            </div>
            <NavLink to={myRequestsPath}>
              <button className="bg-white text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full hover:bg-green-50 transition shadow-sm border border-green-200">
                My Requests →
              </button>
            </NavLink>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {submitResult ? (
              // ── Success State ───────────────────────────────────────────────
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl">✅</div>
                <h2 className="text-xl font-bold text-green-700">Request Submitted!</h2>
                <p className="text-gray-600 text-sm">Your advance request has been submitted successfully.</p>

                <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-3">
                  <p className="text-xs text-gray-500 mb-1">Your Request ID</p>
                  <p className="text-lg font-bold text-green-700 tracking-wider">
                    {submitResult.requestId}
                  </p>
                </div>

                <div className="flex gap-3 justify-center mt-4 flex-wrap">
                  <button
                    onClick={handleReset}
                    className="bg-green-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition"
                  >
                    Submit Another Request
                  </button>
                  <NavLink to={myRequestsPath}>
                    <button className="bg-white border border-green-300 text-green-700 px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-50 transition">
                      View My Requests
                    </button>
                  </NavLink>
                </div>
              </div>
            ) : (
              // ── Form ────────────────────────────────────────────────────────
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Error Banner */}
                {(localError || errors.submit) && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{localError || errors.submit}</span>
                  </div>
                )}

                {/* Employee Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Employee Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 cursor-not-allowed focus:outline-none"
                      placeholder="Auto-filled"
                    />
                  </div>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Advance Amount (₹) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-sm">₹</span>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      min="1"
                      className="w-full border border-gray-300 pl-8 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Reason for Advance <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-400 font-normal ml-2">(can select multiple)</span>
                  </label>

                  {formData.reasons.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2 p-3 bg-green-50 border border-green-200 rounded-lg min-h-[44px]">
                      {formData.reasons.map((reason) => (
                        <span
                          key={reason}
                          className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full border border-green-200"
                        >
                          {reason}
                          <button
                            type="button"
                            onClick={() => handleReasonRemove(reason)}
                            className="text-green-500 hover:text-red-500 transition font-bold ml-0.5 text-sm leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <select
                    onChange={handleReasonSelect}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  >
                    <option value="">-- Select Reason to Add --</option>
                    {REASON_OPTIONS.filter((opt) => !formData.reasons.includes(opt)).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Reason */}
                {formData.reasons.includes('Other') && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Specify Other Reason <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="customReason"
                      value={formData.customReason}
                      onChange={handleChange}
                      className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      placeholder="Describe your reason..."
                    />
                  </div>
                )}

                {/* Request Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Request Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="requestDate"
                    value={formData.requestDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isFormValid() && !isSubmitting
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  {isSubmitting
                    ? '⏳ Submitting...'
                    : isFormValid()
                    ? '📤 Submit Request'
                    : 'Fill all fields to submit'}
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Your request will be reviewed by {roleConfig.nextApprovalLevel || 'the approver'}.
        </p>
      </div>
    </div>
  )
}

export default SharedAdvanceRequestForm
