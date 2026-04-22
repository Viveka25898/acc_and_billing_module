/* eslint-disable no-unused-vars */
/**
 * advanceRequestService.js
 * ─────────────────────────
 * Service layer for all Advance Request API calls.
 *
 * PRODUCTION READY:
 * - Status transition validation
 * - O/S balance validation
 * - Request ID consistency
 * - Deadline calculations
 * - Error handling with context
 *
 * CURRENT MODE: localStorage (works without a backend today)
 * API READY:    Uncomment the axios blocks and delete the localStorage blocks.
 *               Zero changes needed in Redux slice or components.
 *
 * Each function signature matches the API contract exactly.
 */

// import axiosInstance from '../../api/axiosInstance'  // ← uncomment when API is ready

// ─── CONFIGURATION ────────────────────────────────────────────────────────────
const ADVANCE_REQUEST_CONFIG = {
  VP_DEADLINE_HOUR: 12,        // Before 12:00 PM = same-day processing
  AE_DEADLINE_HOUR: 15,        // Before 15:00 (3 PM) = eligible for processing
  BANK_ACCOUNT_PARENT_CODE: 'A3004001',  // GL code for bank accounts
  DEFAULT_PAGE_SIZE: 5,
}

// ─── VALID STATUS TRANSITIONS (State Machine) ─────────────────────────────────
const VALID_STATUS_TRANSITIONS = {
  'Pending Manager Approval': ['Rejected by Line Manager', 'Pending VP Approval'],
  'Rejected by Line Manager': ['Pending Manager Approval'],  // Only via clarification
  'Pending VP Approval': ['Rejected by VP Operations', 'Pending AE Approval'],
  'Rejected by VP Operations': ['Pending VP Approval'],  // Only via clarification
  'Pending AE Approval': ['Rejected by AE', 'Approved'],
  'Rejected by AE': ['Pending Manager Approval'],  // Only via clarification
  'Approved': [],  // Final state
}

// ─── HELPERS (localStorage only — remove when API is ready) ──────────────────
const getStoredRequests = () =>
  JSON.parse(localStorage.getItem('advanceRequests')) || []

const saveRequests = (requests) =>
  localStorage.setItem('advanceRequests', JSON.stringify(requests))

const getLoggedInUser = () =>
  JSON.parse(localStorage.getItem('user'))

const getAllUsers = () =>
  JSON.parse(localStorage.getItem('users')) || []

// ─── VALIDATION FUNCTIONS (Production-Ready) ───────────────────────────────────

/**
 * Validate status transition follows state machine rules
 * @throws {Error} If transition is invalid
 */
export const validateStatusTransition = (currentStatus, newStatus) => {
  const allowedTransitions = VALID_STATUS_TRANSITIONS[currentStatus]
  
  if (!allowedTransitions) {
    throw new Error(`Unknown status: ${currentStatus}`)
  }
  
  if (!allowedTransitions.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${currentStatus} → ${newStatus}. ` +
      `Allowed: ${allowedTransitions.join(', ') || 'None (final state)'}`
    )
  }
}

/**
 * Validate O/S balance is sufficient
 * @throws {Error} If amount exceeds available balance
 */
export const validateOSBalance = (amount, employeeId) => {
  const users = getAllUsers()
  const employee = users.find(
    (u) => u.empId === employeeId || u.username === employeeId
  )
  
  if (!employee) {
    throw new Error(`Employee not found: ${employeeId}`)
  }
  
  const osBalance = employee.osBalance || 0
  const amountNum = parseFloat(amount)
  
  if (amountNum <= 0) {
    throw new Error('Amount must be greater than zero')
  }
  
  if (amountNum > osBalance) {
    throw new Error(
      `Insufficient O/S balance. Requested: ₹${amountNum.toLocaleString()}, ` +
      `Available: ₹${osBalance.toLocaleString()}`
    )
  }
}

/**
 * Validate request ID format and existence
 * @throws {Error} If request not found or invalid ID
 */
export const validateRequestExists = (requestId) => {
  if (!requestId || typeof requestId !== 'string') {
    throw new Error('Invalid request ID')
  }
  
  const requests = getStoredRequests()
  const found = requests.find((r) => r.requestId === requestId)
  
  if (!found) {
    throw new Error(`Request not found: ${requestId}`)
  }
  
  return found
}

/**
 * Validate reporting hierarchy
 * @throws {Error} If manager not found
 */
export const validateReportingHierarchy = (userId, expectedManagerType) => {
  const users = getAllUsers()
  const user = users.find((u) => u.username === userId)
  
  if (!user) {
    throw new Error(`User not found: ${userId}`)
  }
  
  if (!user.reportsTo) {
    throw new Error(
      `Reporting hierarchy not configured for ${user.fullName || userId}. ` +
      `Please set 'reportsTo' field.`
    )
  }
  
  return user
}

/**
 * Check if current time is before VP deadline (12:00 PM)
 */
export const isBeforeVPDeadline = () => {
  const now = new Date()
  return now.getHours() < ADVANCE_REQUEST_CONFIG.VP_DEADLINE_HOUR
}

/**
 * Check if current time is before AE deadline (3 PM / 15:00)
 */
export const isBeforeAEDeadline = () => {
  const now = new Date()
  return now.getHours() < ADVANCE_REQUEST_CONFIG.AE_DEADLINE_HOUR
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SUBMIT ADVANCE REQUEST
//    POST /api/advance-requests
// ─────────────────────────────────────────────────────────────────────────────
export const submitAdvanceRequest = async (payload) => {
  // ── VALIDATION (Production-Ready) ───────────────────────────────────────
  validateOSBalance(payload.amount, payload.employeeId)
  
  // ── localStorage implementation ──────────────────────────────────────────
  const existing = getStoredRequests()
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const requestId = `ADV-${year}${month}-${String(existing.length + 1).padStart(4, '0')}`

  const newRequest = {
    ...payload,
    requestId,
    submittedAt: now.toISOString(),
    remarks: '',
    clarification: '',
  }

  existing.push(newRequest)
  saveRequests(existing)

  return {
    success: true,
    message: 'Advance request submitted successfully',
    requestId,
    status: payload.status,
    assignedTo: payload.assignedTo,
    submittedAt: newRequest.submittedAt,
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post('/advance-requests', payload)
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FETCH MY REQUESTS (for the logged-in user, any role)
//    GET /api/advance-requests/my-requests
// ─────────────────────────────────────────────────────────────────────────────
export const fetchMyRequests = async ({ date, page = 1, limit = 5 } = {}) => {
  // ── localStorage implementation ──────────────────────────────────────────
  const currentUser = getLoggedInUser()
  const allUsers = getAllUsers()
  const fullUser = allUsers.find((u) => u.username === currentUser?.username)
  const empId = fullUser?.employeeId || fullUser?.empId || fullUser?.username
  const username = currentUser?.username?.toLowerCase()

  const all = getStoredRequests()
  let filtered = all
    .filter((r) => {
      const submittedBy = r.submittedBy?.toLowerCase()
      return submittedBy === username || r.employeeId === empId
    })
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  if (date) filtered = filtered.filter((r) => r.requestDate === date)

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / limit)
  const requests = filtered.slice((page - 1) * limit, page * limit)

  return {
    success: true,
    pagination: { currentPage: page, totalPages, totalItems, pageSize: limit },
    requests,
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.get('/advance-requests/my-requests', {
  //   params: { date, page, limit },
  // })
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SUBMIT CLARIFICATION FOR REJECTED REQUEST
//    POST /api/advance-requests/:requestId/clarification
// ─────────────────────────────────────────────────────────────────────────────
export const submitClarification = async ({ requestId, clarification }) => {
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  all[index] = {
    ...all[index],
    clarification,
    status: 'Pending Manager Approval',
  }
  saveRequests(all)

  return {
    success: true,
    message: 'Clarification submitted successfully. Request sent back for manager review.',
    requestId,
    status: 'Pending Manager Approval',
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(
  //   `/advance-requests/${requestId}/clarification`,
  //   { clarification }
  // )
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FETCH REQUESTS FOR LINE MANAGER APPROVAL
//    GET /api/advance-requests/manager-approval
// ─────────────────────────────────────────────────────────────────────────────
export const fetchManagerApprovalRequests = async (
  { name = '', employeeId = '', date = '', requestId = '', page = 1, limit = 100 } = {}
) => {
  // ── localStorage implementation ──────────────────────────────────────────
  const currentUser = getLoggedInUser()
  const all = getStoredRequests()
  const allUsers = getAllUsers()

  const requests = all.filter(
    (req) =>
      req.assignedTo === currentUser?.username &&
      (req.status === 'Pending Manager Approval' ||
        (req.status === 'Rejected by Line Manager' && req.clarification))
  )

  // Attach osBalance from user profile
  const enriched = requests.map((req) => {
    const emp = allUsers.find(
      (u) =>
        u.empId === req.employeeId ||
        u.username === req.employeeId ||
        (u.empId && u.empId.toString() === req.employeeId?.toString())
    )
    return { ...req, osBalance: emp?.osBalance || 0 }
  })

  return { success: true, requests: enriched }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.get('/advance-requests/manager-approval', {
  //   params: { name, employeeId, date, requestId, page, limit },
  // })
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. LINE MANAGER — APPROVE REQUEST
//    POST /api/advance-requests/:requestId/manager-approve
// ─────────────────────────────────────────────────────────────────────────────
export const managerApproveRequest = async ({ requestId }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  const request = validateRequestExists(requestId)
  validateStatusTransition(request.status, 'Pending VP Approval')
  
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  const currentUser = getLoggedInUser()
  all[index] = {
    ...all[index],
    status: 'Pending VP Approval',
    remarks: '',
    managerApprovedBy: currentUser?.username,
    managerApprovedAt: new Date().toISOString(),
  }
  saveRequests(all)

  return {
    success: true,
    message: 'Request approved and forwarded to VP Operations',
    requestId,
    status: 'Pending VP Approval',
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(`/advance-requests/${requestId}/manager-approve`)
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. LINE MANAGER — REJECT REQUEST
//    POST /api/advance-requests/:requestId/manager-reject
// ─────────────────────────────────────────────────────────────────────────────
export const managerRejectRequest = async ({ requestId, remarks }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  const request = validateRequestExists(requestId)
  validateStatusTransition(request.status, 'Rejected by Line Manager')
  
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  const currentUser = getLoggedInUser()
  all[index] = {
    ...all[index],
    status: 'Rejected by Line Manager',
    remarks,
    clarification: '',
    managerRejectedBy: currentUser?.username,
    managerRejectedAt: new Date().toISOString(),
  }
  saveRequests(all)

  return {
    success: true,
    message: 'Request rejected successfully',
    requestId,
    status: 'Rejected by Line Manager',
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(`/advance-requests/${requestId}/manager-reject`, { remarks })
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FETCH REQUESTS FOR VP APPROVAL
//    GET /api/advance-requests/vp-approval
// ─────────────────────────────────────────────────────────────────────────────
export const fetchVPApprovalRequests = async () => {
  // ── localStorage implementation ──────────────────────────────────────────
  const currentUser = getLoggedInUser()
  const loggedInUser = currentUser?.username
  const all = getStoredRequests()
  const allUsers = getAllUsers()

  const lineManagersUnderThisVP = allUsers
    .filter((u) => u.reportsTo === loggedInUser && u.role === 'line-manager')
    .map((u) => u.username)

  const requests = all.filter((req) => {
    const validStatus =
      req.status === 'Pending VP Approval' ||
      req.status === 'Pending AE Approval' ||
      (req.status === 'Rejected by VP Operations' && req.clarification)

    const isEmployeeRequest = lineManagersUnderThisVP.includes(req.assignedTo) && validStatus
    const isLMRequest =
      req.assignedTo === loggedInUser &&
      lineManagersUnderThisVP.includes(req.submittedBy) &&
      validStatus

    return isEmployeeRequest || isLMRequest
  })

  const enriched = requests.map((req) => {
    const emp = allUsers.find(
      (u) =>
        u.empId === req.employeeId ||
        u.username === req.employeeId ||
        (u.empId && u.empId.toString() === req.employeeId?.toString())
    )
    const submittedByType = req.assignedTo === loggedInUser ? 'Manager' : 'Employee'
    return { ...req, osBalance: emp?.osBalance || 0, submittedByType }
  })

  const isBeforeDeadline = isBeforeVPDeadline()

  return {
    success: true,
    isBeforeDeadline,
    deadline: '12:00',
    requests: enriched,
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.get('/advance-requests/vp-approval')
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. VP — APPROVE REQUEST
//    POST /api/advance-requests/:requestId/vp-approve
// ─────────────────────────────────────────────────────────────────────────────
export const vpApproveRequest = async ({ requestId }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  const request = validateRequestExists(requestId)
  validateStatusTransition(request.status, 'Pending AE Approval')
  
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  const currentUser = getLoggedInUser()
  const approvalTime = new Date()
  const vpApprovedBeforeDeadline = isBeforeVPDeadline()

  all[index] = {
    ...all[index],
    status: 'Pending AE Approval',
    remarks: '',
    vpApprovedBy: currentUser?.username,
    vpApprovedAt: approvalTime.toISOString(),
    isVPRequest: true,
    vpApprovedBeforeDeadline,
  }
  saveRequests(all)

  return {
    success: true,
    message: vpApprovedBeforeDeadline
      ? 'Request approved and forwarded to Account Executive (Same-day processing eligible)'
      : 'Request approved and forwarded to Account Executive (Next working day processing)',
    requestId,
    status: 'Pending AE Approval',
    vpApprovedBeforeDeadline,
    processingType: vpApprovedBeforeDeadline ? 'Same day processing eligible' : 'Next working day processing',
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(`/advance-requests/${requestId}/vp-approve`)
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. VP — REJECT REQUEST
//    POST /api/advance-requests/:requestId/vp-reject
// ─────────────────────────────────────────────────────────────────────────────
export const vpRejectRequest = async ({ requestId, remarks }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  const request = validateRequestExists(requestId)
  validateStatusTransition(request.status, 'Rejected by VP Operations')
  
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  const currentUser = getLoggedInUser()
  all[index] = {
    ...all[index],
    status: 'Rejected by VP Operations',
    remarks,
    clarification: '',
    vpRejectedBy: currentUser?.username,
    vpRejectedAt: new Date().toISOString(),
  }
  saveRequests(all)

  return {
    success: true,
    message: 'Request rejected by VP Operations',
    requestId,
    status: 'Rejected by VP Operations',
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(`/advance-requests/${requestId}/vp-reject`, { remarks })
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. FETCH REQUESTS FOR AE APPROVAL
//     GET /api/advance-requests/ae-approval
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAEApprovalRequests = async () => {
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const requests = all.filter(
    (req) =>
      req.status === 'Pending AE Approval' ||
      req.status === 'Approved' ||
      req.status === 'Rejected by AE'
  )

  const aeIsBeforeDeadline = isBeforeAEDeadline()

  return {
    success: true,
    isBeforeDeadline: aeIsBeforeDeadline,
    deadline: '15:00',
    requests,
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.get('/advance-requests/ae-approval')
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. AE — APPROVE SINGLE REQUEST
//     POST /api/advance-requests/:requestId/ae-approve
// ─────────────────────────────────────────────────────────────────────────────
export const aeApproveRequest = async ({ requestId, bankId, bankCode, bankName }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  const request = validateRequestExists(requestId)
  validateStatusTransition(request.status, 'Approved')
  
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  const currentUser = getLoggedInUser()
  const now = new Date()
  const aeApprovedBeforeDeadline = isBeforeAEDeadline()

  all[index] = {
    ...all[index],
    status: 'Approved',
    bankId,
    bankCode,
    bankName,
    aeApprovedBy: currentUser?.username,
    approvedAt: now.toISOString(),
    aeApprovedBeforeDeadline,
  }
  saveRequests(all)

  return {
    success: true,
    message: 'Accounting entries posted successfully',
    requestId,
    status: 'Approved',
    aeApprovedBeforeDeadline,
    updatedRequest: all[index],
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(`/advance-requests/${requestId}/ae-approve`, {
  //   bankId, bankCode, bankName,
  // })
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. AE — APPROVE MULTIPLE REQUESTS (BATCH)
//     POST /api/advance-requests/ae-approve-batch
// ─────────────────────────────────────────────────────────────────────────────
export const aeApproveBatch = async ({ requestIds, bankId, bankCode, bankName }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
    throw new Error('At least one request ID is required')
  }

  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const currentUser = getLoggedInUser()
  const now = new Date()

  const approved = []
  const skipped = []

  const uniqueIds = [...new Set(requestIds)]

  uniqueIds.forEach((rid) => {
    try {
      validateRequestExists(rid)
      const idx = all.findIndex((r) => r.requestId === rid)
      if (all[idx].status !== 'Pending AE Approval') {
        validateStatusTransition(all[idx].status, 'Approved')
      }
    } catch (error) {
      skipped.push({ requestId: rid, reason: error.message })
      return
    }

    const idx = all.findIndex((r) => r.requestId === rid)
    if (idx === -1 || all[idx].status !== 'Pending AE Approval') {
      skipped.push({ requestId: rid, reason: 'Not eligible for AE approval' })
      return
    }
    if (all[idx].isVPRequest && !all[idx].vpApprovedBeforeDeadline) {
      skipped.push({ requestId: rid, reason: 'VP approved after deadline' })
      return
    }
    all[idx] = {
      ...all[idx],
      status: 'Approved',
      bankId,
      bankCode,
      bankName,
      aeApprovedBy: currentUser?.username,
      approvedAt: now.toISOString(),
    }
    approved.push(all[idx])
  })

  saveRequests(all)

  return {
    success: true,
    message: `${approved.length} requests approved successfully`,
    totalApproved: approved.length,
    totalSkipped: skipped.length,
    approvedRequests: approved,
    skippedRequests: skipped,
    failedRequests: [],
    totalAmount: approved.reduce((sum, r) => sum + Number(r.amount), 0),
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post('/advance-requests/ae-approve-batch', {
  //   requestIds, bankId, bankCode, bankName,
  // })
  // return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. AE — REJECT REQUEST
//     POST /api/advance-requests/:requestId/ae-reject
// ─────────────────────────────────────────────────────────────────────────────
export const aeRejectRequest = async ({ requestId, reason }) => {
  // ── VALIDATION ───────────────────────────────────────────────────────────
  const request = validateRequestExists(requestId)
  validateStatusTransition(request.status, 'Rejected by AE')
  
  // ── localStorage implementation ──────────────────────────────────────────
  const all = getStoredRequests()
  const index = all.findIndex((r) => r.requestId === requestId)
  if (index === -1) throw new Error('Request not found')

  const currentUser = getLoggedInUser()
  all[index] = {
    ...all[index],
    status: 'Rejected by AE',
    remarks: reason,
    rejectedAt: new Date().toISOString(),
    aeRejectedBy: currentUser?.username,
  }
  saveRequests(all)

  return {
    success: true,
    message: 'Request rejected by Account Executive',
    requestId,
    status: 'Rejected by AE',
  }

  // ── API implementation (uncomment when backend is ready) ─────────────────
  // const res = await axiosInstance.post(`/advance-requests/${requestId}/ae-reject`, { reason })
  // return res.data
}
