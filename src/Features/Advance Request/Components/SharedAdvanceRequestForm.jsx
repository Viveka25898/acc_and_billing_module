/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

// ─── Role Configuration ───────────────────────────────────────────────────────
// Defines the submission behaviour per role
const ROLE_CONFIG = {
  employee: {
    status: 'Pending Manager Approval',
    currentLevel: 'line-manager',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No reporting manager assigned. Please set 'reportsTo' in users.",
  },
  'line-manager': {
    status: 'Pending VP Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  'compliance-team': {
    status: 'Pending VP Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  'compliance-manager': {
    status: 'Pending VP Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  'payroll-team': {
    status: 'Pending VP Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  'operation-executive': {
    status: 'Pending VP Approval',
    currentLevel: 'vp-operations',
    getAssignedTo: (fullUser) => fullUser?.reportsTo,
    errorMsg: "No VP assigned. Please set 'reportsTo' in users.",
  },
  manager: {
    status: 'Pending AE Approval',
    currentLevel: 'account-executive',
    getAssignedTo: (_fullUser, allUsers) => {
      const ae = allUsers.find((u) => u.role === 'ae' || u.role === 'account-executive')
      return ae?.username
    },
    errorMsg: 'No Account Executive found in the system.',
    isManagerRole: true,
  },
  'vp-operations': {
    status: 'Pending AE Approval',
    currentLevel: 'account-executive',
    getAssignedTo: (_fullUser, allUsers) => {
      const ae = allUsers.find((u) => u.role === 'ae' || u.role === 'account-executive')
      return ae?.username
    },
    errorMsg: 'No Account Executive found in the system.',
    isVPRole: true,
  },
}

const REASON_OPTIONS = [
  'Visit to Client',
  'Travelling Allowance',
  'Petrol Expense',
  'Office Expense',
  'Other',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const generateRequestId = () => {
  const existing = JSON.parse(localStorage.getItem('advanceRequests') || '[]')
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `ADV-${year}${month}-${String(existing.length + 1).padStart(4, '0')}`
}

// ─── Component ────────────────────────────────────────────────────────────────
/**
 * SharedAdvanceRequestForm
 * @param {string} role            - The role key (e.g. 'employee', 'line-manager')
 * @param {string} myRequestsPath  - Route for the "My Requests" button
 */
const SharedAdvanceRequestForm = ({ role = 'employee', myRequestsPath = '/dashboard/employee/my-requests' }) => {
  const roleConfig = ROLE_CONFIG[role] || ROLE_CONFIG['employee']

  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    amount: '',
    reasons: [],       // always stored as array internally
    customReason: '',
    requestDate: new Date().toISOString().slice(0, 10),
  })

  const [submitted, setSubmitted] = useState(false)
  const [submittedRequestId, setSubmittedRequestId] = useState('')
  const [error, setError] = useState('')

  // Pre-fill employee info from localStorage
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('user'))
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    if (currentUser) {
      const fullUser = allUsers.find((u) => u.username === currentUser.username)
      setFormData((prev) => ({
        ...prev,
        employeeName: fullUser?.fullName || fullUser?.username || '',
        employeeId: fullUser?.employeeId || fullUser?.empId || fullUser?.username || '',
      }))
    }
  }, [])

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
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

  // ── Validation ──────────────────────────────────────────────────────────────
  const isFormValid = () => {
    const { employeeName, employeeId, amount, reasons, customReason } = formData
    if (!employeeName.trim() || !employeeId.trim() || !amount || Number(amount) <= 0) return false
    if (reasons.length === 0) return false
    if (reasons.includes('Other') && !customReason.trim()) return false
    return true
  }

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!isFormValid()) {
      setError('Please fill in all required fields.')
      return
    }

    const currentUser = JSON.parse(localStorage.getItem('user'))
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    const fullUser = allUsers.find((u) => u.username === currentUser.username)

    const assignedTo = roleConfig.getAssignedTo(fullUser, allUsers)
    if (!assignedTo) {
      setError(`❌ ${roleConfig.errorMsg}`)
      return
    }

    // Resolve final reasons — replace 'Other' with custom text
    const finalReasons = formData.reasons.map((r) =>
      r === 'Other' && formData.customReason.trim() ? formData.customReason.trim() : r
    )

    const requestId = generateRequestId()

    const newRequest = {
      requestId,
      employeeName: formData.employeeName,
      employeeId: formData.employeeId,
      amount: formData.amount,
      reason: finalReasons,           // unified: always array
      requestDate: formData.requestDate,
      status: roleConfig.status,
      currentLevel: roleConfig.currentLevel,
      assignedTo,
      submittedBy: currentUser.username,
      submittedAt: new Date().toISOString(),
      remarks: '',
      clarification: '',
      ...(roleConfig.isVPRole && { isVPRequest: true }),
      ...(roleConfig.isManagerRole && { isManagerRequest: true }),
    }

    const existing = JSON.parse(localStorage.getItem('advanceRequests') || '[]')
    existing.push(newRequest)
    localStorage.setItem('advanceRequests', JSON.stringify(existing))

    setSubmittedRequestId(requestId)
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    setSubmittedRequestId('')
    setFormData((prev) => ({
      ...prev,
      amount: '',
      reasons: [],
      customReason: '',
      requestDate: new Date().toISOString().slice(0, 10),
    }))
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="px-4 py-6 flex justify-center">
      <div className="w-full max-w-2xl">

        {/* Card */}
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
            {submitted ? (
              // ── Success State ─────────────────────────────────────────────
              <div className="text-center py-8 space-y-4">
                <div className="text-5xl">✅</div>
                <h2 className="text-xl font-bold text-green-700">Request Submitted!</h2>
                <p className="text-gray-600 text-sm">Your advance request has been submitted successfully.</p>

                {/* Request ID badge */}
                <div className="inline-block bg-green-50 border border-green-200 rounded-xl px-6 py-3">
                  <p className="text-xs text-gray-500 mb-1">Your Request ID</p>
                  <p className="text-lg font-bold text-green-700 tracking-wider">{submittedRequestId}</p>
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
              // ── Form ──────────────────────────────────────────────────────
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg flex items-start gap-2">
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                {/* Employee Info Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      name="employeeName"
                      value={formData.employeeName}
                      onChange={handleChange}
                      readOnly
                      className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg text-sm text-gray-700 cursor-not-allowed focus:outline-none"
                      placeholder="Auto-filled"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Employee ID
                    </label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
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
                      className="w-full border border-gray-300 pl-8 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
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

                  {/* Selected Reasons Tags */}
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
                            aria-label={`Remove ${reason}`}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <select
                    onChange={handleReasonSelect}
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  >
                    <option value="">-- Select Reason to Add --</option>
                    {REASON_OPTIONS.filter((opt) => !formData.reasons.includes(opt)).map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                {/* Custom Reason (if 'Other' selected) */}
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
                      className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
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
                    className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!isFormValid()}
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                    isFormValid()
                      ? 'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg active:scale-[0.98]'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
                >
                  {isFormValid() ? '📤 Submit Request' : 'Fill all fields to submit'}
                </button>

              </form>
            )}
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Your request will be reviewed by your reporting manager.
        </p>
      </div>
    </div>
  )
}

export default SharedAdvanceRequestForm
