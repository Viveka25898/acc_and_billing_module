/* eslint-disable no-unused-vars */
/**
 * advanceSettlementService.js
 * ─────────────────────────────
 * Service layer for ALL Advance Settlement API calls.
 *
 * PRODUCTION READY:
 * - Full multipart/form-data support for file uploads
 * - snake_case → camelCase normalization via settlementNormalizer
 * - Strict response shape validation before returning to Redux
 * - Client-side validation before hitting the API
 * - Descriptive error messages for every failure mode
 * - JWT token is attached automatically by axiosInstance
 *
 * KEY API FACTS (confirmed from Postman):
 * - Create Settlement: POST /advance-settlements → multipart/form-data
 *   Only send `excel_file` + `attachments[]`. Backend reads employee info from JWT.
 * - My Settlements: GET /advance-settlements/my-settlements → paginated list
 * - OS Balance: GET /employees/{employeeId}/os-balance → osBalance is already camelCase
 * - Status values: SCREAMING_SNAKE_CASE enums (e.g. PENDING_REGIONAL_HEAD)
 * - Settlement No format: SET-20260624051447127193
 *
 * STRUCTURE:
 *   Section 1  — Employee APIs (submit, my-settlements, os-balance, template)
 *   Section 2  — Regional Head APIs (queue, approve, reject)
 *   Section 3  — AVP Operations APIs (queue, approve, reject)
 *   Section 4  — VP Operations APIs (queue, approve, reject)
 *   Section 5  — Account Executive APIs (queue, approve, reject)
 *   Section 6  — Account Manager APIs (queue, approve, reject)
 */

import axiosInstance from '../../../api/axiosInstance'
import {
  normalizeSettlement,
  normalizeSettlementList,
  normalizeOsBalance,
  normalizePagination,
} from '../utils/settlementNormalizer'

// ─── Configuration ─────────────────────────────────────────────────────────────
const SETTLEMENT_API = {
  BASE:            '/accounts/advance-settlements',
  MY:              '/accounts/advance-settlements/my-settlements',
  TEMPLATE:        '/accounts/advance-settlements/download-template',
  OS_BALANCE:      (employeeId) => `/accounts/employees/${employeeId}/os-balance`,
  DETAIL:          (id) => `/accounts/advance-settlements/${id}`,
  CLARIFICATION:   (id) => `/accounts/advance-settlements/${id}/clarification`,
  // ── Unified Endpoints (backend routes by JWT role) ──────────────────────────
  QUEUE:           '/accounts/advance-settlements/queue',
  WORKFLOW:        (id) => `/accounts/advance-settlements/${id}/workflow`,
  // ── Legacy role-specific endpoints (kept for reference / fallback) ──────────
  RH_QUEUE:        '/accounts/advance-settlements/regional-head/queue',
  RH_APPROVE:      (id) => `/accounts/advance-settlements/${id}/regional-head/approve`,
  RH_REJECT:       (id) => `/accounts/advance-settlements/${id}/regional-head/reject`,
  AVP_QUEUE:       '/accounts/advance-settlements/avp/queue',
  AVP_APPROVE:     (id) => `/accounts/advance-settlements/${id}/avp/approve`,
  AVP_REJECT:      (id) => `/accounts/advance-settlements/${id}/avp/reject`,
  VP_QUEUE:        '/accounts/advance-settlements/vp/queue',
  VP_APPROVE:      (id) => `/accounts/advance-settlements/${id}/vp/approve`,
  VP_REJECT:       (id) => `/accounts/advance-settlements/${id}/vp/reject`,
  AE_QUEUE:        '/accounts/advance-settlements/ae/queue',
  AE_APPROVE:      (id) => `/accounts/advance-settlements/${id}/ae/approve`,
  AE_REJECT:       (id) => `/accounts/advance-settlements/${id}/ae/reject`,
  AM_QUEUE:        '/accounts/advance-settlements/am/queue',
  AM_APPROVE:      (id) => `/accounts/advance-settlements/${id}/am/approve`,
  AM_REJECT:       (id) => `/accounts/advance-settlements/${id}/am/reject`,
}

// ─── Internal Helpers ──────────────────────────────────────────────────────────

/**
 * Extracts the nested data payload from an API response.
 * Handles both { data: {} } and flat { key: value } response shapes.
 */
const getPayload = (res) =>
  res?.data?.data ?? res?.data?.results ?? res?.data

/**
 * Normalizes an approval queue response (shared across all roles).
 * Queue endpoints return: { success, message, data: [], pagination: {} }
 */
const normalizeQueueResponse = (data, roleName) => {
  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) {
    throw new Error(data.message || `Failed to fetch ${roleName} settlement queue.`)
  }

  // Flexible payload extraction: data.data[] or data.settlements[] or data[]
  const rawList = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.settlements)
      ? data.settlements
      : Array.isArray(data.results)
        ? data.results
        : []

  const settlements = normalizeSettlementList(rawList)
  const pagination = normalizePagination(
    data.pagination ?? data.meta,
    settlements.length,
    10
  )

  return { settlements, pagination }
}

/**
 * Normalizes an approval action response (shared across all roles).
 * Approve/Reject endpoints return: { success, message, data: { settlement } }
 */
const normalizeActionResponse = (data, defaultMessage) => {
  if (!data) throw new Error('Empty response from server after action.')
  if (data.success === false) {
    throw new Error(data.message || 'Action failed. Please try again.')
  }

  // Flexible: data.data may have the updated settlement
  const updatedRaw = data.data?.settlement ?? data.data ?? null
  const updated = updatedRaw ? normalizeSettlement(updatedRaw) : null

  return {
    success:      true,
    message:      data.message || defaultMessage,
    settlementId: updated?.settlementId ?? data.data?.settlement_no ?? null,
    status:       updated?.status       ?? data.data?.status        ?? null,
    updated,
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — EMPLOYEE APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 1A. GET OS BALANCE
//     GET /employees/{employeeId}/os-balance
//     Auth: Bearer JWT
//     Response: {
//       success, message, data: {
//         employeeId, employeeName, employeeGLCode, osBalance,
//         lastCalculated, transactionSummary, recentTransactions
//       }
//     }
// ─────────────────────────────────────────────────────────────────────────────
export const getOsBalance = async (employeeId) => {
  // ── Client-side validation ─────────────────────────────────────────────────
  if (!employeeId || typeof employeeId !== 'string' || !employeeId.trim()) {
    throw new Error('Employee ID is required to fetch OS balance.')
  }

  try {
    // ── API Call ─────────────────────────────────────────────────────────────
    const res = await axiosInstance.get(SETTLEMENT_API.OS_BALANCE(employeeId.trim()))
    const data = res.data

    // ── Response Validation ───────────────────────────────────────────────────
    if (!data) throw new Error('Empty response from server while fetching OS balance.')
    if (data.success === false) {
      throw new Error(data.message || 'Failed to fetch OS balance. Please try again.')
    }

    // ── Normalize & Return ────────────────────────────────────────────────────
    // OS balance response wraps data inside data.data
    const rawBalance = data.data || data
    const normalized = normalizeOsBalance(rawBalance)

    if (normalized === null) {
      throw new Error('Invalid OS balance response from server.')
    }

    return normalized

  } catch (err) {
    // ── 404 = Employee has no advance transactions yet ────────────────────────
    // Backend returns 404 when there is no OS balance record for this employee.
    // This is a VALID business state (new employee / no advances taken).
    // Return a zero-balance object so the form renders correctly.
    if (err?.response?.status === 404) {
      console.info(`[OsBalance] Employee ${employeeId} has no advance records — returning zero balance.`)
      return {
        employeeId,
        employeeName:       null,
        employeeGLCode:     null,
        osBalance:          0,
        lastCalculated:     null,
        transactionSummary: { totalDebits: 0, totalCredits: 0, netBalance: 0 },
        recentTransactions: [],
      }
    }

    // All other errors — re-throw so thunk's rejectWithValue handles them
    throw err
  }
}



// ─────────────────────────────────────────────────────────────────────────────
// 1B. DOWNLOAD EXCEL TEMPLATE
//     GET /advance-settlements/download-template
//     Auth: Bearer JWT
//     Response: Binary blob (.xlsx file) — triggers browser download
// ─────────────────────────────────────────────────────────────────────────────
export const downloadSettlementTemplate = async () => {
  // ── API Call (responseType blob = binary file) ─────────────────────────────
  const res = await axiosInstance.get(SETTLEMENT_API.TEMPLATE, {
    responseType: 'blob',
  })

  // ── Validate we received a file-like blob ──────────────────────────────────
  if (!res?.data || res.data.size === 0) {
    throw new Error('Template download failed: empty file received. Please try again.')
  }

  // ── Extract filename from Content-Disposition header (if available) ─────────
  const contentDisposition = res.headers?.['content-disposition'] || ''
  const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
  const fileName = fileNameMatch
    ? fileNameMatch[1].replace(/['"]/g, '').trim()
    : `Advance_Settlement_Template_${Date.now()}.xlsx`

  // ── Return blob + filename for component to trigger download ────────────────
  return {
    blob: res.data,
    fileName,
    contentType: res.headers?.['content-type'] || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 1C. SUBMIT SETTLEMENT (Create)
//     POST /advance-settlements
//     Auth: Bearer JWT (backend reads employee info from token — NO JSON body)
//     Content-Type: multipart/form-data
//     Body: excel_file (File) + attachments[] (File[])
//     Response: {
//       success, message, data: {
//         settlement_no, status, outstanding_balance_before,
//         expense_items_count, submitted_at
//       }
//     }
// ─────────────────────────────────────────────────────────────────────────────
export const createSettlement = async ({ excelFile, attachments = [] }) => {
  // ── Client-side validation ─────────────────────────────────────────────────
  if (!excelFile || !(excelFile instanceof File)) {
    throw new Error('Excel file is required to submit a settlement.')
  }

  const allowedExcelTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'application/octet-stream',
  ]
  const isExcelByName = /\.(xlsx|xls)$/i.test(excelFile.name)
  if (!allowedExcelTypes.includes(excelFile.type) && !isExcelByName) {
    throw new Error('Invalid file type. Please upload an Excel file (.xlsx or .xls).')
  }

  const MAX_EXCEL_SIZE = 10 * 1024 * 1024 // 10 MB
  if (excelFile.size > MAX_EXCEL_SIZE) {
    throw new Error('Excel file size exceeds 10 MB. Please reduce the file size and try again.')
  }

  const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024 // 5 MB per file
  const MAX_ATTACHMENTS = 10

  if (!Array.isArray(attachments)) {
    throw new Error('Attachments must be an array of files.')
  }

  if (attachments.length > MAX_ATTACHMENTS) {
    throw new Error(`Maximum ${MAX_ATTACHMENTS} attachments are allowed.`)
  }

  for (const file of attachments) {
    if (!(file instanceof File)) {
      throw new Error('Each attachment must be a valid file.')
    }
    if (file.size > MAX_ATTACHMENT_SIZE) {
      throw new Error(`Attachment "${file.name}" exceeds 5 MB. Please compress and try again.`)
    }
  }

  // ── Build FormData ─────────────────────────────────────────────────────────
  // CRITICAL: Backend reads employee data from JWT — NO JSON body needed.
  // Only send excel_file + attachments[].
  const formData = new FormData()
  formData.append('excel_file', excelFile, excelFile.name)

  attachments.forEach((file, index) => {
    formData.append('attachments', file, file.name)
  })

  // ── API Call ───────────────────────────────────────────────────────────────
  // Override Content-Type to let browser set multipart boundary automatically
  const res = await axiosInstance.post(SETTLEMENT_API.BASE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000, // 30 seconds for file upload
  })

  const data = res.data

  // ── Response Validation ────────────────────────────────────────────────────
  if (!data) throw new Error('Empty response from server after settlement submission.')
  if (data.success === false) {
    throw new Error(data.message || 'Settlement submission failed. Please try again.')
  }

  const responseData = data.data || data

  // settlement_no is the canonical ID returned by backend
  const settlementNo = responseData.settlement_no || responseData.settlementId || responseData.id
  if (!settlementNo) {
    throw new Error('Server did not return a Settlement ID. Please contact support.')
  }

  const status = responseData.status
  if (!status) {
    throw new Error('Server did not return a status. Please contact support.')
  }

  // ── Return normalized result ───────────────────────────────────────────────
  return {
    settlementId:          settlementNo,
    status,
    osBalanceBefore:       Number(responseData.outstanding_balance_before ?? responseData.osBalanceBefore ?? 0),
    expenseItemsCount:     Number(responseData.expense_items_count ?? 0),
    submittedAt:           responseData.submitted_at || responseData.submittedAt || new Date().toISOString(),
    message:               data.message || 'Settlement submitted successfully.',
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// 1D. FETCH MY SETTLEMENTS
//     GET /advance-settlements/my-settlements
//     Auth: Bearer JWT (server filters by logged-in user)
//     Query: { page, limit, status }
//     Response: {
//       success, message,
//       data: [{ settlement objects }],
//       pagination: { page, limit, total }
//     }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchMySettlements = async ({ page = 1, limit = 10, status = '' } = {}) => {
  // ── Build query params ─────────────────────────────────────────────────────
  const params = {
    page:  Math.max(1, Number(page) || 1),
    limit: Math.max(1, Number(limit) || 10),
  }
  // Only send status filter if it's a non-empty valid value
  if (status && typeof status === 'string' && status.trim() && status !== 'All') {
    params.status = status.trim()
  }

  // ── API Call ───────────────────────────────────────────────────────────────
  const res = await axiosInstance.get(SETTLEMENT_API.MY, { params })
  const data = res.data

  // ── Response Validation ────────────────────────────────────────────────────
  if (!data) throw new Error('Empty response from server while fetching settlements.')
  if (data.success === false) {
    throw new Error(data.message || 'Failed to fetch your settlements. Please try again.')
  }

  // Flexible: data.data[] or data.settlements[] or data[]
  const rawList = Array.isArray(data.data)
    ? data.data
    : Array.isArray(data.settlements)
      ? data.settlements
      : Array.isArray(data)
        ? data
        : []

  // ── Normalize ──────────────────────────────────────────────────────────────
  const settlements = normalizeSettlementList(rawList)
  const pagination  = normalizePagination(data.pagination ?? data.meta, settlements.length, limit)

  return { settlements, pagination }
}


// ─────────────────────────────────────────────────────────────────────────────
// 1E. FETCH SETTLEMENT BY ID
//     GET /advance-settlements/{settlementId}
//     Auth: Bearer JWT
//     Response: { success, message, data: { settlement object } }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchSettlementById = async (settlementId) => {
  if (!settlementId || typeof settlementId !== 'string' || !settlementId.trim()) {
    throw new Error('Settlement ID is required.')
  }

  const res = await axiosInstance.get(SETTLEMENT_API.DETAIL(settlementId.trim()))
  const data = res.data

  if (!data) throw new Error('Empty response from server.')
  if (data.success === false) {
    throw new Error(data.message || 'Failed to fetch settlement details.')
  }

  const rawSettlement = data.data ?? data
  const settlement = normalizeSettlement(rawSettlement)
  if (!settlement) throw new Error('Invalid settlement data received from server.')

  return settlement
}


// ─────────────────────────────────────────────────────────────────────────────
// 1F. SUBMIT CLARIFICATION
//     POST /advance-settlements/{settlementId}/clarification
//     Auth: Bearer JWT (employee who owns the rejected settlement)
//     Body: { clarification: string (min 20 chars) }
//     Response: { success, message, data: { full settlement object } }
//
//     Business Rules:
//       - Only allowed when settlement status is REJECTED
//       - Clarification text must be ≥ 20 characters
//       - After submission, status reverts to the previous pending level (e.g. PENDING_REGIONAL_HEAD)
// ─────────────────────────────────────────────────────────────────────────────
export const submitClarification = async (settlementId, clarificationText) => {
  // ── Client-side validation ─────────────────────────────────────────────────
  if (!settlementId || typeof settlementId !== 'string' || !settlementId.trim()) {
    throw new Error('Settlement ID is required to submit a clarification.')
  }
  if (!clarificationText || typeof clarificationText !== 'string' || !clarificationText.trim()) {
    throw new Error('Clarification text cannot be empty.')
  }
  const trimmed = clarificationText.trim()
  if (trimmed.length < 20) {
    throw new Error(`Clarification must be at least 20 characters (currently ${trimmed.length}).`)
  }

  // ── API Call ───────────────────────────────────────────────────────────────
  const res = await axiosInstance.post(
    SETTLEMENT_API.CLARIFICATION(settlementId.trim()),
    { clarification: trimmed }
  )
  const data = res.data

  // ── Response Validation ────────────────────────────────────────────────────
  if (!data) throw new Error('Empty response from server after submitting clarification.')
  if (data.success === false) {
    throw new Error(data.message || 'Failed to submit clarification. Please try again.')
  }

  // ── Normalize & Return ─────────────────────────────────────────────────────
  const rawSettlement = data.data ?? data
  const updated = normalizeSettlement(rawSettlement)

  return {
    success:      true,
    message:      data.message || 'Clarification submitted successfully.',
    settlementId: updated?.settlementId ?? settlementId.trim(),
    status:       updated?.status ?? null,
    updated,
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — REGIONAL HEAD APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 2A. FETCH REGIONAL HEAD QUEUE
//     GET /advance-settlements/queue
//     Auth: Bearer JWT — backend resolves approver role from token
//     Response: { success, message, data: [...settlements], pagination? }
// ─────────────────────────────────────────────────────────────────────────────
export const fetchRegionalHeadQueue = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axiosInstance.get(SETTLEMENT_API.QUEUE, { params: { page, limit } })
  return normalizeQueueResponse(res.data, 'Regional Head')
}

// ─────────────────────────────────────────────────────────────────────────────
// 2B. REGIONAL HEAD — APPROVE
//     PATCH /advance-settlements/{id}/workflow
//     Body: { action: "APPROVE", comments?: string }
//     On success status → PENDING_AVP
// ─────────────────────────────────────────────────────────────────────────────
export const approveByRegionalHead = async ({ id, remarks = '' }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to approve.')

  const res = await axiosInstance.patch(SETTLEMENT_API.WORKFLOW(id), {
    action:   'APPROVE',
    comments: remarks.trim() || undefined,
  })
  return normalizeActionResponse(res.data, 'Settlement approved and forwarded to AVP Operations.')
}

// ─────────────────────────────────────────────────────────────────────────────
// 2C. REGIONAL HEAD — REJECT
//     PATCH /advance-settlements/{id}/workflow
//     Body: { action: "REJECT", comments: string, rejection_reason: string }
//     On success status → REJECTED
// ─────────────────────────────────────────────────────────────────────────────
export const rejectByRegionalHead = async ({ id, remarks }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to reject.')
  if (!remarks || !remarks.trim()) throw new Error('Rejection remarks are required.')
  if (remarks.trim().length < 5) throw new Error('Rejection remarks must be at least 5 characters.')

  const trimmedRemarks = remarks.trim()
  const res = await axiosInstance.patch(SETTLEMENT_API.WORKFLOW(id), {
    action:           'REJECT',
    comments:         trimmedRemarks,
    rejection_reason: trimmedRemarks,
  })
  return normalizeActionResponse(res.data, 'Settlement rejected. Employee has been notified.')
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — AVP OPERATIONS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 3A. FETCH AVP QUEUE
//     GET /advance-settlements/avp/queue
//     Auth: Bearer JWT (server filters by AVP's region scope)
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAvpQueue = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axiosInstance.get(SETTLEMENT_API.AVP_QUEUE, { params: { page, limit } })
  return normalizeQueueResponse(res.data, 'AVP Operations')
}

// ─────────────────────────────────────────────────────────────────────────────
// 3B. AVP — APPROVE
//     PUT /advance-settlements/{id}/avp/approve
// ─────────────────────────────────────────────────────────────────────────────
export const approveByAvp = async ({ id, remarks = 'Approved by AVP Operations' }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to approve.')

  const res = await axiosInstance.put(SETTLEMENT_API.AVP_APPROVE(id), {
    remarks: remarks.trim() || 'Approved by AVP Operations',
  })
  return normalizeActionResponse(res.data, 'Settlement approved and forwarded to VP Operations.')
}

// ─────────────────────────────────────────────────────────────────────────────
// 3C. AVP — REJECT
//     PUT /advance-settlements/{id}/avp/reject
// ─────────────────────────────────────────────────────────────────────────────
export const rejectByAvp = async ({ id, remarks }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to reject.')
  if (!remarks || !remarks.trim()) throw new Error('Rejection remarks are required.')
  if (remarks.trim().length < 5) throw new Error('Rejection remarks must be at least 5 characters.')

  const res = await axiosInstance.put(SETTLEMENT_API.AVP_REJECT(id), {
    remarks: remarks.trim(),
  })
  return normalizeActionResponse(res.data, 'Settlement rejected. Employee has been notified.')
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — VP OPERATIONS APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 4A. FETCH VP QUEUE
//     GET /advance-settlements/vp/queue
// ─────────────────────────────────────────────────────────────────────────────
export const fetchVpQueue = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axiosInstance.get(SETTLEMENT_API.VP_QUEUE, { params: { page, limit } })
  return normalizeQueueResponse(res.data, 'VP Operations')
}

// ─────────────────────────────────────────────────────────────────────────────
// 4B. VP — APPROVE
//     PUT /advance-settlements/{id}/vp/approve
// ─────────────────────────────────────────────────────────────────────────────
export const approveByVp = async ({ id, remarks = 'Approved by VP Operations' }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to approve.')

  const res = await axiosInstance.put(SETTLEMENT_API.VP_APPROVE(id), {
    remarks: remarks.trim() || 'Approved by VP Operations',
  })
  return normalizeActionResponse(res.data, 'Settlement approved and forwarded to Account Executive.')
}

// ─────────────────────────────────────────────────────────────────────────────
// 4C. VP — REJECT
//     PUT /advance-settlements/{id}/vp/reject
// ─────────────────────────────────────────────────────────────────────────────
export const rejectByVp = async ({ id, remarks }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to reject.')
  if (!remarks || !remarks.trim()) throw new Error('Rejection remarks are required.')
  if (remarks.trim().length < 5) throw new Error('Rejection remarks must be at least 5 characters.')

  const res = await axiosInstance.put(SETTLEMENT_API.VP_REJECT(id), {
    remarks: remarks.trim(),
  })
  return normalizeActionResponse(res.data, 'Settlement rejected. Employee has been notified.')
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — ACCOUNT EXECUTIVE APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 5A. FETCH AE QUEUE
//     GET /advance-settlements/ae/queue
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAeQueue = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axiosInstance.get(SETTLEMENT_API.AE_QUEUE, { params: { page, limit } })
  return normalizeQueueResponse(res.data, 'Account Executive')
}

// ─────────────────────────────────────────────────────────────────────────────
// 5B. AE — APPROVE (Final Approval + Payment Recording)
//     PUT /advance-settlements/{id}/ae/approve
//     Body: { remarks, paymentMode, transactionRef, paymentDate, glEntries[] }
// ─────────────────────────────────────────────────────────────────────────────
export const approveByAe = async ({
  id,
  remarks = 'Approved by Account Executive',
  paymentMode = '',
  transactionRef = '',
  paymentDate = '',
  glEntries = [],
}) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to approve.')

  const payload = {
    remarks:         remarks.trim() || 'Approved by Account Executive',
    payment_mode:    paymentMode.trim()    || undefined,
    transaction_ref: transactionRef.trim() || undefined,
    payment_date:    paymentDate.trim()    || undefined,
  }

  // Only include gl_entries if we have any
  if (Array.isArray(glEntries) && glEntries.length > 0) {
    payload.gl_entries = glEntries
  }

  // Remove undefined keys (optional fields not provided)
  Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key])

  const res = await axiosInstance.put(SETTLEMENT_API.AE_APPROVE(id), payload)
  return normalizeActionResponse(res.data, 'Settlement fully approved. GL entries posted and payment recorded.')
}

// ─────────────────────────────────────────────────────────────────────────────
// 5C. AE — REJECT
//     PUT /advance-settlements/{id}/ae/reject
// ─────────────────────────────────────────────────────────────────────────────
export const rejectByAe = async ({ id, remarks }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to reject.')
  if (!remarks || !remarks.trim()) throw new Error('Rejection remarks are required.')
  if (remarks.trim().length < 5) throw new Error('Rejection remarks must be at least 5 characters.')

  const res = await axiosInstance.put(SETTLEMENT_API.AE_REJECT(id), {
    remarks: remarks.trim(),
  })
  return normalizeActionResponse(res.data, 'Settlement rejected. Employee has been notified.')
}


// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — ACCOUNT MANAGER APIs
// ═══════════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────────────────────
// 6A. FETCH AM QUEUE
//     GET /advance-settlements/am/queue
// ─────────────────────────────────────────────────────────────────────────────
export const fetchAmQueue = async ({ page = 1, limit = 10 } = {}) => {
  const res = await axiosInstance.get(SETTLEMENT_API.AM_QUEUE, { params: { page, limit } })
  return normalizeQueueResponse(res.data, 'Account Manager')
}

// ─────────────────────────────────────────────────────────────────────────────
// 6B. AM — APPROVE
//     PUT /advance-settlements/{id}/am/approve
// ─────────────────────────────────────────────────────────────────────────────
export const approveByAm = async ({ id, remarks = 'Approved by Account Manager' }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to approve.')

  const res = await axiosInstance.put(SETTLEMENT_API.AM_APPROVE(id), {
    remarks: remarks.trim() || 'Approved by Account Manager',
  })
  return normalizeActionResponse(res.data, 'Settlement approved and forwarded to Account Executive.')
}

// ─────────────────────────────────────────────────────────────────────────────
// 6C. AM — REJECT
//     PUT /advance-settlements/{id}/am/reject
// ─────────────────────────────────────────────────────────────────────────────
export const rejectByAm = async ({ id, remarks }) => {
  if (!id || !String(id).trim()) throw new Error('Settlement ID is required to reject.')
  if (!remarks || !remarks.trim()) throw new Error('Rejection remarks are required.')
  if (remarks.trim().length < 5) throw new Error('Rejection remarks must be at least 5 characters.')

  const res = await axiosInstance.put(SETTLEMENT_API.AM_REJECT(id), {
    remarks: remarks.trim(),
  })
  return normalizeActionResponse(res.data, 'Settlement rejected. Employee has been notified.')
}
