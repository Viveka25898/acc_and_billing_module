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

import axiosInstance from '../../../api/axiosInstance'  // ✅ API integration active

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

const ADVANCE_REQUEST_BASE_PATHS = [
  '/accounts/advances',
  '/v1/accounts/advances',
  '/accounts/advance-requests',
  '/v1/accounts/advance-requests',
  '/advance-requests',
  '/accounts/advance-request',
  '/v1/accounts/advance-request',
  '/advance-request',
]

const ADVANCE_REASON_CODE_MAP = {
  'Visit to Client': 'TRAVEL',
  'Travelling Allowance': 'TRAVEL',
  'Petrol Expense': 'PETROL',
  'Office Expense': 'OFFICE',
  Other: 'OTHER',
}

const isNotFoundApiError = (error) =>
  error?.response?.status === 404 ||
  /status code 404|not found|cannot (get|post|put|patch|delete)/i.test(error?.message || '')

const getApiResponsePayload = (response) =>
  response?.data?.data ?? response?.data?.results ?? response?.data

const toAdvanceReasonCode = (reason) => {
  if (typeof reason !== 'string') return reason
  return ADVANCE_REASON_CODE_MAP[reason] || reason.trim().toUpperCase().replace(/\s+/g, '_')
}

const callAdvanceRequestApi = async ({ method, suffix = '', data, config }) => {
  const triedUrls = []
  let lastError = null

  for (const basePath of ADVANCE_REQUEST_BASE_PATHS) {
    const url = `${basePath}${suffix}`
    triedUrls.push(url)

    try {
      if (method === 'get') {
        return await axiosInstance.get(url, config)
      }
      if (method === 'post') {
        return await axiosInstance.post(url, data, config)
      }
      throw new Error(`Unsupported API method: ${method}`)
    } catch (error) {
      if (!isNotFoundApiError(error)) {
        throw error
      }
      lastError = error
    }
  }

  throw new Error(
    `Advance Request API endpoint was not found. Tried: ${triedUrls.join(', ')}. ` +
    (lastError?.message || '')
  )
}

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
  // ── Payload Field Mapping ────────────────────────────────────────────────
  // API (Postman) expects snake_case: amount, reasons[], custom_reason, request_date
  // Component sends camelCase: amount, reason[], customReason, requestDate
  // Service is the translation layer — handles mapping here so components stay clean

  // ── Guard: Validate required fields before hitting API ───────────────────
  const amount      = parseFloat(payload?.amount)
  const reasons     = Array.isArray(payload?.reason) ? payload.reason : []
  const customReason = typeof payload?.customReason === 'string' ? payload.customReason.trim() : ''
  const requestDate = payload?.requestDate?.trim?.() || ''

  if (!amount || amount <= 0) {
    throw new Error('Amount must be greater than zero')
  }
  if (reasons.length === 0) {
    throw new Error('At least one reason must be selected')
  }
  if (!requestDate) {
    throw new Error('Request date is required')
  }
  if (reasons.includes('Other') && !customReason) {
    throw new Error('Custom reason is required when "Other" is selected')
  }

  // ── Build API Payload (snake_case — matches Postman) ─────────────────────
  const apiPayload = {
    amount,
    reasons: reasons.map(toAdvanceReasonCode),
    custom_reason: customReason,
    request_date:  requestDate,
  }

  // ── API Call ─────────────────────────────────────────────────────────────
  const res = await callAdvanceRequestApi({
    method: 'post',
    data: apiPayload,
  })

  // ── Validate Response Shape ───────────────────────────────────────────────
  // Postman response: { success, message, data: { id, requestId, status, assignedTo, submittedAt }, errors }
  const responseData = getApiResponsePayload(res)

  if (!responseData) {
    throw new Error('Unexpected response from server. Please try again.')
  }
  if (!responseData.requestId) {
    throw new Error('Server did not return a request ID. Please contact support.')
  }
  if (!responseData.status) {
    throw new Error('Server did not return a status. Please contact support.')
  }

  // ── Return normalized result ──────────────────────────────────────────────
  return {
    requestId:   responseData.requestId,
    status:      responseData.status,
    assignedTo:  responseData.assignedTo  || null,
    submittedAt: responseData.submittedAt || new Date().toISOString(),
    id:          responseData.id          || null,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. FETCH MY REQUESTS (for the logged-in user, any role)
//    GET /accounts/advances
//    Auth: Bearer JWT token (attached automatically by axiosInstance)
//    Response: { success, pagination: { currentPage, totalPages, totalItems, pageSize }, requests[] }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchMyRequests = async ({ date, page = 1, limit = 10 } = {}) => {
  // ── Build query params ───────────────────────────────────────────────────
  const params = { page, limit }
  if (date && typeof date === 'string' && date.trim()) {
    params.date = date.trim()
  }

  // ── API Call ─────────────────────────────────────────────────────────────
  // Direct call — no URL fallback loop needed. Endpoint is confirmed from Postman.
  const res = await axiosInstance.get('/accounts/advances', { params })

  // ── Validate Response Shape ───────────────────────────────────────────────
  // Postman confirmed response: { success, pagination, requests[] }
  // No nested 'data' or 'results' wrapper — direct top-level keys
  const data = res.data

  if (!data) {
    throw new Error('Empty response from server. Please try again.')
  }
  if (!data.success && data.success !== undefined) {
    // Server explicitly returned success: false
    throw new Error(data.message || 'Server returned an error. Please try again.')
  }
  if (!Array.isArray(data.requests)) {
    throw new Error('Invalid API response: expected requests array.')
  }

  // ── Return normalized shape (matches Redux slice expectation) ─────────────
  return {
    requests: data.requests,
    pagination: {
      currentPage: data.pagination?.currentPage  ?? 1,
      totalPages:  data.pagination?.totalPages   ?? 1,
      totalItems:  data.pagination?.totalItems   ?? data.requests.length,
      pageSize:    data.pagination?.pageSize     ?? limit,
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SUBMIT CLARIFICATION FOR REJECTED REQUEST
//    POST /accounts/advances/:requestId/clarification
//    Auth: Bearer JWT token (attached automatically by axiosInstance)
//
//    Body (raw JSON):
//      { "clarification": "Your explanation here..." }
//
//    Response (200 OK) — FLAT top-level keys (Postman confirmed, NO nested wrapper):
//      {
//        "success": true,
//        "message": "Clarification submitted successfully. Request sent back for manager review.",
//        "requestId": "ADV-202606-094744049522-302F",
//        "status": "Pending Regional Head Approval"
//      }
// ─────────────────────────────────────────────────────────────────────────────
export const submitClarification = async ({ requestId, clarification }) => {
  // ── Client-side validation (before hitting API) ──────────────────────────
  if (!requestId || typeof requestId !== 'string' || !requestId.trim()) {
    throw new Error('Request ID is required to submit clarification.')
  }
  if (!clarification || typeof clarification !== 'string' || !clarification.trim()) {
    throw new Error('Clarification text cannot be empty.')
  }
  if (clarification.trim().length < 10) {
    throw new Error('Clarification must be at least 10 characters.')
  }
  if (clarification.trim().length > 500) {
    throw new Error('Clarification cannot exceed 500 characters.')
  }

  // ── API Call ─────────────────────────────────────────────────────────────
  // NOTE: validateRequestExists() was removed — it read from localStorage.
  // The server validates the requestId. If it doesn't exist or doesn't belong
  // to the logged-in user, the server returns 404/403 which axiosInstance handles.
  const res = await axiosInstance.post(
    `/accounts/advances/${requestId.trim()}/clarification`,
    { clarification: clarification.trim() }
  )

  // ── Validate Response Shape ───────────────────────────────────────────────
  // Postman confirmed: FLAT response — { success, message, requestId, status }
  // No nested 'data' wrapper.
  const data = res.data

  if (!data) {
    throw new Error('Empty response from server after submitting clarification.')
  }
  if (data.success === false) {
    // Server explicitly returned failure
    throw new Error(data.message || 'Failed to submit clarification. Please try again.')
  }
  if (!data.requestId) {
    throw new Error('Server did not return a request ID. Please contact support.')
  }
  if (!data.status) {
    throw new Error('Server did not return updated status. Please contact support.')
  }

  // ── Return normalized result ──────────────────────────────────────────────
  return {
    requestId: data.requestId,
    status:    data.status,
    message:   data.message || 'Clarification submitted successfully.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. FETCH REGIONAL HEAD APPROVAL QUEUE
//    GET /accounts/advances/queue
//    Auth: Bearer JWT — server filters by logged-in user's region automatically
//    Response: { success, message, data: [{ id, request_id, employee_name, amount, status, region }] }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchManagerApprovalRequests = async () => {
  const res = await axiosInstance.get('/accounts/advances/queue')
  const data = res.data

  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Failed to fetch approval queue.')
  if (!Array.isArray(data.data)) throw new Error('Invalid API response: expected data array.')

  // Normalize snake_case API fields to camelCase for Redux state
  const requests = data.data.map((item) => ({
    id:           item.id,
    requestId:    item.request_id,
    employeeName: item.employee_name,
    amount:       item.amount,
    status:       item.status,
    region:       item.region,
  }))

  return { requests }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REGIONAL HEAD — APPROVE REQUEST
//    PATCH /accounts/advances/:id/workflow
//    Body: { action: 'approve', comments }
//    Response: { success, message, data: { id, requestId, status, assignedTo, submittedAt } }
// ─────────────────────────────────────────────────────────────────────────────
export const managerApproveRequest = async ({ id, comments = 'Approved' }) => {
  if (!id || typeof id !== 'string' || !id.trim()) throw new Error('Advance ID is required to approve.')

  const res = await axiosInstance.patch(`/accounts/advances/${id.trim()}/workflow`, {
    action:   'approve',
    comments: comments.trim() || 'Approved',
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server after approval.')
  if (data.success === false) throw new Error(data.message || 'Approval failed. Please try again.')
  if (!data.data?.id) throw new Error('Server did not return updated request data.')

  return {
    id:        data.data.id,
    requestId: data.data.requestId,
    status:    data.data.status,
    message:   data.message || 'Request approved successfully.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. REGIONAL HEAD — REJECT REQUEST
//    PATCH /accounts/advances/:id/workflow
//    Body: { action: 'reject', comments, rejection_reason }
//    Response: { success, message, data: { id, requestId, status, assignedTo, submittedAt } }
// ─────────────────────────────────────────────────────────────────────────────
export const managerRejectRequest = async ({ id, comments, rejectionReason }) => {
  if (!id || typeof id !== 'string' || !id.trim()) throw new Error('Advance ID is required to reject.')
  if (!comments || !comments.trim()) throw new Error('Rejection comments are required.')
  if (!rejectionReason || !rejectionReason.trim()) throw new Error('Rejection reason is required.')

  const res = await axiosInstance.patch(`/accounts/advances/${id.trim()}/workflow`, {
    action:           'reject',
    comments:         comments.trim(),
    rejection_reason: rejectionReason.trim(),
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server after rejection.')
  if (data.success === false) throw new Error(data.message || 'Rejection failed. Please try again.')
  if (!data.data?.id) throw new Error('Server did not return updated request data.')

  return {
    id:        data.data.id,
    requestId: data.data.requestId,
    status:    data.data.status,
    message:   data.message || 'Request rejected successfully.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. FETCH REQUESTS FOR AVP APPROVAL
//    GET /accounts/advances/queue
//    Auth: Bearer JWT — server filters by logged-in user's role/region
//    Response: { success, message, data: [{ id, request_id, employee_name, amount, status, region }] }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAVPApprovalRequests = async () => {
  const res = await axiosInstance.get('/accounts/advances/queue')
  const data = res.data

  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Failed to fetch AVP approval queue.')
  if (!Array.isArray(data.data)) throw new Error('Invalid API response: expected data array.')

  // Normalize snake_case API fields to camelCase for Redux state
  const requests = data.data.map((item) => ({
    id:           item.id,
    requestId:    item.request_id,
    employeeName: item.employee_name,
    amount:       item.amount,
    status:       item.status,
    region:       item.region,
  }))

  return { requests }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. AVP — APPROVE REQUEST
//    PATCH /accounts/advances/:id/workflow
//    Body: { action: 'approve', comments }
// ─────────────────────────────────────────────────────────────────────────────
export const avpApproveRequest = async ({ id, comments = 'Approved by AVP Operations' }) => {
  if (!id || typeof id !== 'string' || !id.trim()) throw new Error('Advance ID is required to approve.')

  const res = await axiosInstance.patch(`/accounts/advances/${id.trim()}/workflow`, {
    action:   'approve',
    comments: comments.trim(),
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server after approval.')
  if (data.success === false) throw new Error(data.message || 'Approval failed. Please try again.')
  if (!data.data?.id) throw new Error('Server did not return updated request data.')

  return {
    id:        data.data.id,
    requestId: data.data.requestId,
    status:    data.data.status,
    message:   data.message || 'Request approved and forwarded to VP Operations.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. AVP — REJECT REQUEST
//    PATCH /accounts/advances/:id/workflow
//    Body: { action: 'reject', comments, rejection_reason }
// ─────────────────────────────────────────────────────────────────────────────
export const avpRejectRequest = async ({ id, comments, rejectionReason }) => {
  if (!id || typeof id !== 'string' || !id.trim()) throw new Error('Advance ID is required to reject.')
  if (!comments || !comments.trim()) throw new Error('Rejection comments are required.')
  if (!rejectionReason || !rejectionReason.trim()) throw new Error('Rejection reason is required.')

  const res = await axiosInstance.patch(`/accounts/advances/${id.trim()}/workflow`, {
    action:           'reject',
    comments:         comments.trim(),
    rejection_reason: rejectionReason.trim(),
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server after rejection.')
  if (data.success === false) throw new Error(data.message || 'Rejection failed. Please try again.')
  if (!data.data?.id) throw new Error('Server did not return updated request data.')

  return {
    id:        data.data.id,
    requestId: data.data.requestId,
    status:    data.data.status,
    message:   data.message || 'Request rejected successfully.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. FETCH REQUESTS FOR VP APPROVAL
//     GET /accounts/advances/queue
//     Auth: Bearer JWT — server filters by logged-in user's role/region
//     Response: { success, message, data: [{ id, request_id, employee_name, amount, status, region }] }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchVPApprovalRequests = async () => {
  const res = await axiosInstance.get('/accounts/advances/queue')
  const data = res.data

  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Failed to fetch VP approval queue.')
  if (!Array.isArray(data.data)) throw new Error('Invalid API response: expected data array.')

  // Normalize snake_case API fields to camelCase for Redux state
  const requests = data.data.map((item) => ({
    id:           item.id,
    requestId:    item.request_id,
    employeeName: item.employee_name,
    amount:       item.amount,
    status:       item.status,
    region:       item.region,
    reasons:      item.reasons || [],
    customReason: item.custom_reason || '',
    requestDate:  item.request_date || '',
    osBalance:    item.os_balance || 0,
  }))

  return { requests }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. VP — APPROVE REQUEST
//     PATCH /accounts/advances/:id/workflow
//     Body: { action: 'approve', comments }
// ─────────────────────────────────────────────────────────────────────────────
export const vpApproveRequest = async ({ id, comments = 'Approved by VP Operations' }) => {
  if (!id || typeof id !== 'string' || !id.trim()) throw new Error('Advance ID is required to approve.')

  const res = await axiosInstance.patch(`/accounts/advances/${id.trim()}/workflow`, {
    action:   'approve',
    comments: comments.trim(),
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server after approval.')
  if (data.success === false) throw new Error(data.message || 'Approval failed. Please try again.')
  if (!data.data?.id) throw new Error('Server did not return updated request data.')

  return {
    id:        data.data.id,
    requestId: data.data.request_id || data.data.requestId,
    status:    data.data.status,
    message:   data.message || 'Request approved and forwarded to Account Executive.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. VP — REJECT REQUEST
//     PATCH /accounts/advances/:id/workflow
//     Body: { action: 'reject', comments, rejection_reason }
// ─────────────────────────────────────────────────────────────────────────────
export const vpRejectRequest = async ({ id, comments, rejectionReason }) => {
  if (!id || typeof id !== 'string' || !id.trim()) throw new Error('Advance ID is required to reject.')
  if (!comments || !comments.trim()) throw new Error('Rejection comments are required.')
  if (!rejectionReason || !rejectionReason.trim()) throw new Error('Rejection reason is required.')

  const res = await axiosInstance.patch(`/accounts/advances/${id.trim()}/workflow`, {
    action:           'reject',
    comments:         comments.trim(),
    rejection_reason: rejectionReason.trim(),
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server after rejection.')
  if (data.success === false) throw new Error(data.message || 'Rejection failed. Please try again.')
  if (!data.data?.id) throw new Error('Server did not return updated request data.')

  return {
    id:        data.data.id,
    requestId: data.data.request_id || data.data.requestId,
    status:    data.data.status,
    message:   data.message || 'Request rejected successfully.',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 10. FETCH REQUESTS FOR AE APPROVAL
//     GET /api/advance-requests/ae-approval
//     ⚠️ TODO: API NOT YET PROVIDED — Keeping localStorage until backend ready
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
//     ⚠️ TODO: API NOT YET PROVIDED — Keeping localStorage until backend ready
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
//     ⚠️ TODO: API NOT YET PROVIDED — Keeping localStorage until backend ready
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
//     ⚠️ TODO: API NOT YET PROVIDED — Keeping localStorage until backend ready
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
