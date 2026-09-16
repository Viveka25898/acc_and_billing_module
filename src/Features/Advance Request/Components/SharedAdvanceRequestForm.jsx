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
// ─── Role → Next Approval Level Map ─────────────────────────────────────────────────────
const ROLE_CONFIG = {
  // ─── Level 1: Requesters (go to Regional Head) ────────────────────────────────
  'operation-executive': { nextApprovalLevel: 'Regional Head' },
  'operation-manager':   { nextApprovalLevel: 'Regional Head' },
  'supervisor':          { nextApprovalLevel: 'Regional Head' },

  // ─── Level 2: Regional Head (go to AVP Operations) ─────────────────────────
  'regional-head':       { nextApprovalLevel: 'AVP Operations' },

  // ─── Level 3: AVP Operations (go to VP Operations) ─────────────────────────
  'avp-operations':      { nextApprovalLevel: 'VP Operations' },

  // ─── Legacy fallback (old hierarchy) ────────────────────────────────────
  'employee':            { nextApprovalLevel: 'Regional Head' },
  'line-manager':        { nextApprovalLevel: 'VP Operations' },
  'compliance-team':     { nextApprovalLevel: 'VP Operations' },
  'compliance-manager':  { nextApprovalLevel: 'VP Operations' },
  'payroll-team':        { nextApprovalLevel: 'VP Operations' },
  'manager':             { nextApprovalLevel: 'Account Executive' },
  'vp-operations':       { nextApprovalLevel: 'Account Executive' },
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

  const MAX_FILE_SIZE = 1 * 1024 * 1024 // 1 MB limit
  const MAX_FILES = 5
  const ALLOWED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.png', '.jpg', '.jpeg', '.webp']

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    reasons: [],
    customReason: '',
    requestDate: new Date().toISOString().slice(0, 10),
    attachments: [], // Array of File objects
  })

  const [localError, setLocalError] = useState('')
  const [isPreFilled, setIsPreFilled] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const prefillRef = React.useRef(false)  // ✅ Prevent re-runs with ref

  // ✅ Step 4.3: Pre-fill from Redux auth state (replaces localStorage lookup)
  useEffect(() => {
    if (prefillRef.current) return
    if (!authContext) return  // Not logged in yet, skip
    
    try {
      const empId   = authContext?.empId   || authContext?.email || ''
      const empName = authContext?.empName || authContext?.email || ''

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
      toast.error(`❌ ${errors.submit}`)
    }
  }, [errors.submit])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setLocalError('')
    dispatch(clearErrors())
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

  // ── File Attachment Handlers ────────────────────────────────────────────────
  const validateAndAddFiles = (fileList) => {
    setLocalError('')
    dispatch(clearErrors())
    try {
      const incomingFiles = Array.from(fileList || [])
      if (incomingFiles.length === 0) return

      let currentFiles = [...(formData.attachments || [])]
      let errorMsgs = []

      for (const file of incomingFiles) {
        if (currentFiles.length >= MAX_FILES) {
          errorMsgs.push(`Maximum ${MAX_FILES} attachments allowed per request.`)
          break
        }

        // Check file size limit (1 MB)
        if (file.size > MAX_FILE_SIZE) {
          errorMsgs.push(`File "${file.name}" exceeds 1MB limit (${(file.size / (1024 * 1024)).toFixed(2)} MB).`)
          continue
        }

        // Check extension
        const ext = '.' + file.name.split('.').pop().toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
          errorMsgs.push(`File "${file.name}" format is invalid. Only PDF, Excel (.xlsx/.xls), and Images (PNG, JPG, WEBP) are allowed.`)
          continue
        }

        // Check duplicate
        if (currentFiles.some((f) => f.name === file.name && f.size === file.size)) {
          errorMsgs.push(`File "${file.name}" is already attached.`)
          continue
        }

        currentFiles.push(file)
      }

      if (errorMsgs.length > 0) {
        const combinedMsg = errorMsgs.join(' ')
        setLocalError(combinedMsg)
        toast.error(`⚠️ ${combinedMsg}`)
      }

      setFormData((prev) => ({ ...prev, attachments: currentFiles }))
    } catch (err) {
      console.error('Error attaching file:', err)
      const msg = err instanceof Error ? err.message : 'Failed to attach file'
      setLocalError(msg)
      toast.error(`❌ ${msg}`)
    }
  }

  const handleFileInputChange = (e) => {
    validateAndAddFiles(e.target.files)
    e.target.value = '' // Reset input so re-selecting same file triggers event
  }

  const handleFileDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer?.files) {
      validateAndAddFiles(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      attachments: (prev.attachments || []).filter((_, i) => i !== indexToRemove),
    }))
  }

  const formatFileSize = (bytes) => {
    if (!bytes || isNaN(bytes)) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const getFileBadgeDetails = (filename) => {
    const ext = filename?.split('.').pop().toLowerCase()
    if (ext === 'pdf') {
      return { label: 'PDF', badgeStyle: 'bg-red-100 text-red-700 border-red-200', icon: '📄' }
    }
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      return { label: 'EXCEL', badgeStyle: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: '📊' }
    }
    if (['png', 'jpg', 'jpeg', 'webp'].includes(ext)) {
      return { label: 'IMAGE', badgeStyle: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🖼️' }
    }
    return { label: 'FILE', badgeStyle: 'bg-gray-100 text-gray-700 border-gray-200', icon: '📎' }
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

    if (!isFormValid()) {
      const msg = 'Please fill in all required fields.'
      console.warn('❌ Form validation failed:', msg, formData)
      setLocalError(msg)
      return
    }

    try {
      const finalReasons = formData.reasons.map((r) =>
        r === 'Other' && formData.customReason.trim() ? formData.customReason.trim() : r
      )

      const empId = formData.employeeId?.trim()
      const empName = formData.employeeName?.trim()

      if (!empId) {
        const msg = 'Employee ID is required. Please refresh and try again.'
        setLocalError(msg)
        return
      }
      if (!empName) {
        const msg = 'Employee Name is required. Please enter your name.'
        setLocalError(msg)
        return
      }

      const payload = {
        employeeName: empName,
        employeeId: empId,
        amount: formData.amount,
        reason: finalReasons,
        customReason: formData.reasons.includes('Other') ? formData.customReason : '',
        requestDate: formData.requestDate,
        attachments: formData.attachments || [],
      }

      console.log('📦 Submitting payload with attachments:', payload)

      const dispatchResult = dispatch(createAdvanceRequest(payload))
      
      if (dispatchResult && typeof dispatchResult.then === 'function') {
        dispatchResult
          .then((result) => {
            if (result?.error) {
              console.error('Thunk rejected:', result.error)
            }
          })
          .catch((error) => {
            console.error('Thunk unexpected error:', error)
            setLocalError('An unexpected error occurred. Please try again.')
          })
      }
    } catch (error) {
      console.error('❌ Error preparing advance request:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to prepare request'
      setLocalError(`Validation error: ${errorMessage}`)
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
      attachments: [],
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

                {/* Attachments Section */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-semibold text-gray-700">
                      Attachments <span className="text-xs text-gray-400 font-normal">(PDF, Excel, Images • max 1MB each)</span>
                    </label>
                    <span className="text-xs font-semibold text-gray-500">
                      {formData.attachments?.length || 0} / {MAX_FILES} files
                    </span>
                  </div>

                  {/* Dropzone Container */}
                  {(!formData.attachments || formData.attachments.length < MAX_FILES) && (
                    <div
                      onDrop={handleFileDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-200 ${
                        isDragging
                          ? 'border-green-500 bg-green-50 scale-[1.01]'
                          : 'border-gray-300 bg-gray-50 hover:bg-green-50/50 hover:border-green-400'
                      }`}
                    >
                      <input
                        type="file"
                        id="advance-request-attachment-input"
                        multiple
                        accept=".pdf,.xlsx,.xls,.png,.jpg,.jpeg,.webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                      <label htmlFor="advance-request-attachment-input" className="cursor-pointer block">
                        <div className="text-2xl mb-1">📎</div>
                        <p className="text-sm font-semibold text-gray-700">
                          Click to upload or drag & drop files
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Allowed formats: PDF, XLSX, XLS, PNG, JPG, WEBP (Max 1MB per file)
                        </p>
                      </label>
                    </div>
                  )}

                  {/* Selected Attachments List */}
                  {formData.attachments && formData.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {formData.attachments.map((file, idx) => {
                        const badge = getFileBadgeDetails(file.name)
                        return (
                          <div
                            key={`${file.name}-${idx}`}
                            className="flex items-center justify-between bg-white border border-green-200 rounded-xl px-3 py-2 shadow-sm text-sm"
                          >
                            <div className="flex items-center gap-2 overflow-hidden mr-2">
                              <span className="text-lg flex-shrink-0">{badge.icon}</span>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${badge.badgeStyle}`}>
                                {badge.label}
                              </span>
                              <span className="font-medium text-gray-800 truncate text-xs" title={file.name}>
                                {file.name}
                              </span>
                              <span className="text-xs text-gray-400 whitespace-nowrap">
                                ({formatFileSize(file.size)})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleFileRemove(idx)}
                              className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-full transition flex-shrink-0"
                              title="Remove attachment"
                            >
                              ✕
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
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
