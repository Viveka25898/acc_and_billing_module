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

const mapApiStatusToUi = (status) => {
  if (status === 'PENDING_AE') return 'Pending AE Approval'
  if (status === 'PENDING_VP') return 'Pending VP Approval'
  if (status === 'PENDING_AVP') return 'Pending AVP Approval'
  if (status === 'PENDING_MANAGER') return 'Pending Manager Approval'
  return status
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

/**
 * Cleans relative API paths to prevent duplicate prefixing (e.g. /api/v1/api/v1/...)
 */
export const cleanApiUrl = (url) => {
  if (!url || typeof url !== 'string') return url
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) {
    return url
  }

  const baseURL = axiosInstance.defaults.baseURL || ''
  let targetPath = url

  let basePath = ''
  try {
    basePath = new URL(baseURL, window.location.origin).pathname.replace(/\/$/, '')
  } catch (_) {
    basePath = baseURL.replace(/\/$/, '')
  }

  if (basePath && basePath !== '/' && targetPath.startsWith(basePath)) {
    targetPath = targetPath.slice(basePath.length)
  }

  return targetPath.startsWith('/') ? targetPath : `/${targetPath}`
}

/**
 * Helper to build full clickable URL for attachments opening in a new tab
 */
export const resolveAttachmentUrl = (fileUrl) => {
  if (!fileUrl) return '#'
  if (fileUrl.startsWith('http://') || fileUrl.startsWith('https://') || fileUrl.startsWith('blob:')) {
    return fileUrl
  }
  const baseURL = axiosInstance.defaults.baseURL || ''
  const cleanedPath = cleanApiUrl(fileUrl)
  try {
    const origin = new URL(baseURL, window.location.origin).origin
    const basePath = new URL(baseURL, window.location.origin).pathname.replace(/\/$/, '')
    return `${origin}${basePath}${cleanedPath}`
  } catch (_) {
    return fileUrl
  }
}

/**
 * Helper to safely view protected attachments in a new tab using JWT Authorization header.
 * Fetches file as a Blob with axiosInstance and opens the Blob URL in a new browser tab.
 */
export const viewAttachmentInNewTab = async (fileUrl, fileName = 'attachment') => {
  if (!fileUrl) {
    throw new Error('File URL is required')
  }

  if (fileUrl.startsWith('blob:') || fileUrl.startsWith('data:')) {
    window.open(fileUrl, '_blank')
    return
  }

  const fileId = fileUrl.split('/').pop()
  const primaryPath = cleanApiUrl(fileUrl)

  // Candidate paths to try if backend routes differ
  const candidatePaths = [
    primaryPath,
    `/accounts/advances/files/${fileId}`,
    `/accounts/advance-files/${fileId}`,
    `/accounts/files/${fileId}`,
    `/advances/files/${fileId}`,
    `/files/${fileId}`,
    `/v1/accounts/advances/files/${fileId}`,
  ]

  const uniquePaths = [...new Set(candidatePaths)]
  let response = null

  for (const path of uniquePaths) {
    try {
      response = await axiosInstance.get(path, { responseType: 'blob' })
      if (response && response.data) {
        break // Found file!
      }
    } catch (err) {
      if (!isNotFoundApiError(err)) {
        throw err // Re-throw non-404 errors (like 401 session expired)
      }
    }
  }

  if (!response || !response.data) {
    throw new Error('File not found on server. It may have been submitted in a previous test run or deleted.')
  }

  const contentType = response.headers['content-type'] || 'application/octet-stream'
  const blob = new Blob([response.data], { type: contentType })
  const blobUrl = window.URL.createObjectURL(blob)

  const newWindow = window.open(blobUrl, '_blank')
  if (!newWindow) {
    // Popup fallback
    const a = document.createElement('a')
    a.href = blobUrl
    a.target = '_blank'
    a.rel = 'noopener noreferrer'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}



// ─────────────────────────────────────────────────────────────────────────────
// 1. SUBMIT ADVANCE REQUEST
//    POST /api/advance-requests (or /accounts/advances)
// ─────────────────────────────────────────────────────────────────────────────
export const submitAdvanceRequest = async (payload) => {
  // ── Payload Field Mapping ────────────────────────────────────────────────
  // API (Postman) expects form-data: amount, reasons[], custom_reason, request_date, attachments[]
  // Component sends camelCase + attachments File array
  
  const amount       = parseFloat(payload?.amount)
  const reasons      = Array.isArray(payload?.reason) ? payload.reason : []
  const customReason = typeof payload?.customReason === 'string' ? payload.customReason.trim() : ''
  const requestDate  = payload?.requestDate?.trim?.() || ''
  const attachments  = Array.isArray(payload?.attachments) ? payload.attachments : []

  // ── Guard: Validate required fields before hitting API ───────────────────
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

  // ── Build FormData API Payload (matches Postman form-data) ────────────────
  const formData = new FormData()
  formData.append('amount', amount)

  // Append each reason (mapped to backend reason codes)
  const formattedReasons = reasons.map(toAdvanceReasonCode)
  formattedReasons.forEach((r) => {
    formData.append('reasons', r)
  })

  formData.append('custom_reason', customReason || 'N/A')
  formData.append('request_date', requestDate)

  // Append attachments if present
  attachments.forEach((file) => {
    if (file instanceof File) {
      formData.append('attachments', file)
    }
  })

  // ── API Call ─────────────────────────────────────────────────────────────
  const res = await callAdvanceRequestApi({
    method: 'post',
    data: formData,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  })

  // ── Validate Response Shape ───────────────────────────────────────────────
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
    attachments: responseData.attachments || [],
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
    employeeId:   item.employee_id,
    employeeName: item.employee_name,
    amount:       item.amount,
    status:       item.status,
    region:       item.region,
    requestDate:  item.request_date || '',
    osBalance:    item.os_balance || 0,
    reason:       item.reasons || [],
    reasons:      item.reasons || [],
    customReason: item.custom_reason || '',
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
    employeeId:   item.employee_id,
    employeeName: item.employee_name,
    amount:       item.amount,
    status:       item.status,
    region:       item.region,
    requestDate:  item.request_date || '',
    osBalance:    item.os_balance || 0,
    reason:       item.reasons || [],
    reasons:      item.reasons || [],
    customReason: item.custom_reason || '',
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
    employeeId:   item.employee_id,
    employeeName: item.employee_name,
    amount:       item.amount,
    status:       item.status,
    region:       item.region,
    reasons:      item.reasons || [],
    reason:       item.reasons || [],
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
//     GET /accounts/advances/queue
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAEApprovalRequests = async () => {
  const res = await axiosInstance.get('/accounts/advances/queue')
  const data = res.data

  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Failed to fetch queue.')
  if (!Array.isArray(data.data)) throw new Error('Invalid API response: expected data array.')

  const aeIsBeforeDeadline = isBeforeAEDeadline()

  const requests = data.data.map((item) => ({
    id:                       item.id,
    requestId:                item.request_id,
    employeeId:               item.employee_id,
    employeeName:             item.employee_name,
    amount:                   item.amount,
    status:                   mapApiStatusToUi(item.status),
    region:                   item.region,
    requestDate:              item.request_date,
    osBalance:                Number(item.os_balance || 0),
    reasons:                  item.reasons || [],
    customReason:             item.custom_reason || '',
    isVPRequest:              item.is_vp_request || false,
    vpApprovedBeforeDeadline: item.vp_approved_before_deadline ?? true,
    submittedAt:              item.submitted_at || item.request_date,
    employeeGLCode:           item.employee_gl_code || item.employeeGLCode,
    bankGLCode:               item.bank_gl_code || item.bankGLCode,
    approvedAt:               item.approved_at || item.approvedAt || null,
  }))

  return {
    success: true,
    isBeforeDeadline: aeIsBeforeDeadline,
    deadline: '15:00',
    requests,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 11. AE — APPROVE SINGLE REQUEST
//     POST /accounts/advances/:id/ae-approve
// ─────────────────────────────────────────────────────────────────────────────
export const aeApproveRequest = async ({ id, bankId, bankCode, bankName, comments = 'Approved', costCenterId = 1 }) => {
  if (!id) throw new Error('Advance ID is required to approve.')

  const res = await axiosInstance.post(`/accounts/advances/${id}/ae-approve`, {
    bank_id: bankId,
    bank_code: bankCode,
    bank_name: bankName,
    comments: comments,
    cost_center_id: Number(costCenterId) || 1
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Approval failed.')

  return {
    success: true,
    message: data.message || 'Accounting entries posted successfully',
    requestId: data.data?.requestId,
    status: 'Approved',
    aeApprovedBeforeDeadline: data.data?.aeApprovedBeforeDeadline ?? true,
    updatedRequest: data.data,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 12. AE — APPROVE MULTIPLE REQUESTS (BATCH)
//     POST /accounts/advances/batch-approve
// ─────────────────────────────────────────────────────────────────────────────
export const aeApproveBatch = async ({ requestIds, bankId, bankCode, bankName, comments = 'Batch disbursement approved', costCenterId = 1 }) => {
  if (!requestIds || !Array.isArray(requestIds) || requestIds.length === 0) {
    throw new Error('At least one request ID is required')
  }

  const res = await axiosInstance.post('/accounts/advances/batch-approve', {
    request_ids: requestIds,
    bank_id: bankId,
    bank_code: bankCode,
    bank_name: bankName,
    comments: comments,
    cost_center_id: Number(costCenterId) || 1
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Batch approval failed.')

  return {
    success: true,
    message: data.message || 'Advances batch approved successfully',
    totalApproved: data.data?.length || 0,
    approvedRequests: (data.data || []).map((item) => ({
      id: item.id,
      requestId: item.requestId || item.request_id,
      status: 'Approved',
      submittedAt: item.submittedAt || item.submitted_at || item.request_date,
      voucherNo: item.accountingDetails?.voucherNo || item.voucherNo || item.voucher_no,
      transactionId: item.accountingDetails?.transactionId || item.transactionId || item.transaction_id,
      accountingDetails: item.accountingDetails || item.accounting_details || item,
    })),
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 13. AE — REJECT REQUEST
//     PATCH /accounts/advances/:id/workflow (Same as VP/AVP)
// ─────────────────────────────────────────────────────────────────────────────
export const aeRejectRequest = async ({ id, reason }) => {
  if (!id) throw new Error('Advance ID is required to reject.')
  if (!reason || !reason.trim()) throw new Error('Rejection reason is required.')

  const res = await axiosInstance.patch(`/accounts/advances/${id}/workflow`, {
    action: 'reject',
    comments: reason.trim(),
    rejection_reason: reason.trim(),
  })

  const data = res.data
  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) throw new Error(data.message || 'Rejection failed.')

  return {
    success: true,
    message: data.message || 'Request rejected successfully',
    status: 'Rejected by AE',
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 14. AE — FETCH BANKS
//     GET /accounts/banks
// ─────────────────────────────────────────────────────────────────────────────
export const fetchBanks = async () => {
  const res = await axiosInstance.get('/accounts/banks')
  return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 15. AE — FETCH PAYMENT ENTRY DETAILS
//     GET /accounts/advances/:id/payment-entry
// ─────────────────────────────────────────────────────────────────────────────
export const fetchPaymentEntry = async (id) => {
  if (!id) throw new Error('Advance ID is required to fetch payment entry.')
  const res = await axiosInstance.get(`/accounts/advances/${id}/payment-entry`)
  return res.data
}

// ─────────────────────────────────────────────────────────────────────────────
// 16. AE — DOWNLOAD PAYMENT FILE (EXCEL)
//     POST /accounts/advances/download-payment-file
// ─────────────────────────────────────────────────────────────────────────────
export const downloadPaymentFile = async (requestIds) => {
  const payload = {}
  if (requestIds && Array.isArray(requestIds)) {
    payload.request_ids = requestIds
  } else {
    payload.request_ids = []
  }

  const res = await axiosInstance.post('/accounts/advances/download-payment-file', payload, {
    responseType: 'blob'
  })

  return res.data
}
