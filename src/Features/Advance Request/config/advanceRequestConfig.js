/**
 * advanceRequestConfig.js
 * ───────────────────────
 * Centralized configuration for Advance Request feature.
 * Makes it easy to update settings without modifying component code.
 *
 * PRODUCTION READY:
 * - All magic numbers centralized
 * - Easy to override per environment
 * - Self-documented with comments
 */

// ── DEADLINES ───────────────────────────────────────────────────────────────
export const DEADLINES = {
  VP_APPROVAL_HOUR: 12,      // 12:00 PM - Before this = same-day processing
  AE_APPROVAL_HOUR: 15,      // 15:00 (3 PM) - Before this = eligible for processing
  VP_LABEL: '12:00 PM',
  AE_LABEL: '15:00 (3 PM)',
}

// ── BANK ACCOUNT SETTINGS ───────────────────────────────────────────────────
export const BANK_ACCOUNT_CONFIG = {
  PARENT_CODE: 'A3004001',   // GL code for bank accounts in Chart of Accounts
  TYPE: 'ACCOUNT',           // Filter by account type
  DESCRIPTION: 'Bank account for advance disbursement',
}

// ── PAGINATION ──────────────────────────────────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 5,      // Items per page in tables
  MAX_PAGE_SIZE: 100,        // Max items that can be fetched
}

// ── STATUS VALUES ───────────────────────────────────────────────────────────
export const REQUEST_STATUS = {
  PENDING_MANAGER: 'Pending Manager Approval',
  REJECTED_BY_MANAGER: 'Rejected by Line Manager',
  PENDING_VP: 'Pending VP Approval',
  REJECTED_BY_VP: 'Rejected by VP Operations',
  PENDING_AE: 'Pending AE Approval',
  REJECTED_BY_AE: 'Rejected by AE',
  APPROVED: 'Approved',
}

// ── STATUS COLORS (for UI) ──────────────────────────────────────────────────
export const STATUS_COLORS = {
  [REQUEST_STATUS.PENDING_MANAGER]: 'bg-yellow-100 text-yellow-700',
  [REQUEST_STATUS.REJECTED_BY_MANAGER]: 'bg-red-100 text-red-700',
  [REQUEST_STATUS.PENDING_VP]: 'bg-yellow-100 text-yellow-700',
  [REQUEST_STATUS.REJECTED_BY_VP]: 'bg-red-100 text-red-700',
  [REQUEST_STATUS.PENDING_AE]: 'bg-yellow-100 text-yellow-700',
  [REQUEST_STATUS.REJECTED_BY_AE]: 'bg-red-100 text-red-700',
  [REQUEST_STATUS.APPROVED]: 'bg-green-100 text-green-700',
}

// ── VALID STATUS TRANSITIONS (State Machine) ────────────────────────────────
export const VALID_TRANSITIONS = {
  [REQUEST_STATUS.PENDING_MANAGER]: [
    REQUEST_STATUS.REJECTED_BY_MANAGER,
    REQUEST_STATUS.PENDING_VP,
  ],
  [REQUEST_STATUS.REJECTED_BY_MANAGER]: [
    REQUEST_STATUS.PENDING_MANAGER,  // Only via clarification
  ],
  [REQUEST_STATUS.PENDING_VP]: [
    REQUEST_STATUS.REJECTED_BY_VP,
    REQUEST_STATUS.PENDING_AE,
  ],
  [REQUEST_STATUS.REJECTED_BY_VP]: [
    REQUEST_STATUS.PENDING_VP,  // Only via clarification
  ],
  [REQUEST_STATUS.PENDING_AE]: [
    REQUEST_STATUS.REJECTED_BY_AE,
    REQUEST_STATUS.APPROVED,
  ],
  [REQUEST_STATUS.REJECTED_BY_AE]: [
    REQUEST_STATUS.PENDING_MANAGER,  // Only via clarification
  ],
  [REQUEST_STATUS.APPROVED]: [],  // Final state - no transitions
}

// ── REASON OPTIONS ──────────────────────────────────────────────────────────
export const REASON_OPTIONS = [
  'Visit to Client',
  'Travelling Allowance',
  'Petrol Expense',
  'Office Expense',
  'Other',
]

// ── ERROR MESSAGES ──────────────────────────────────────────────────────────
export const ERROR_MESSAGES = {
  INSUFFICIENT_BALANCE: (amount, available) =>
    `Insufficient O/S balance. Requested: ₹${amount}, Available: ₹${available}`,
  INVALID_AMOUNT: 'Amount must be greater than zero',
  MANAGER_NOT_FOUND: 'No reporting manager assigned. Please configure user hierarchy.',
  VP_NOT_FOUND: 'No VP assigned. Please configure user hierarchy.',
  AE_NOT_FOUND: 'No Account Executive found in the system.',
  REQUEST_NOT_FOUND: 'Request not found',
  INVALID_STATUS_TRANSITION: (from, to) =>
    `Cannot transition from ${from} to ${to}`,
  INVALID_REQUEST_ID: 'Invalid request ID format',
}

// ── SUCCESS MESSAGES ────────────────────────────────────────────────────────
export const SUCCESS_MESSAGES = {
  SUBMITTED: 'Advance request submitted successfully',
  APPROVED_SAME_DAY: 'Request approved - Same day processing eligible',
  APPROVED_NEXT_DAY: 'Request approved - Next working day processing',
  REJECTED: 'Request rejected successfully',
  CLARIFICATION_SUBMITTED: 'Clarification submitted. Request sent for review.',
  PAYMENT_POSTED: 'Accounting entries posted successfully',
}

// ── REQUEST ID PREFIX ───────────────────────────────────────────────────────
export const REQUEST_ID_PREFIX = 'ADV'

// ── ADVANCE REQUEST FIELDS (for validation) ─────────────────────────────────
export const REQUIRED_FIELDS = {
  EMPLOYEE_NAME: 'Employee Name',
  EMPLOYEE_ID: 'Employee ID',
  AMOUNT: 'Amount',
  REASONS: 'Reason(s)',
  REQUEST_DATE: 'Request Date',
}

/**
 * Get color class for a status
 * @param {string} status - Status value
 * @returns {string} Tailwind color classes
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-600'
}

/**
 * Check if amount exceeds available balance
 * @param {number} amount - Requested amount
 * @param {number} available - Available O/S balance
 * @returns {boolean} True if insufficient balance
 */
export const isInsufficientBalance = (amount, available) => {
  return parseFloat(amount) > parseFloat(available)
}

/**
 * Check if status is in final/approved state
 * @param {string} status - Status value
 * @returns {boolean} True if approved
 */
export const isApprovedStatus = (status) => {
  return status === REQUEST_STATUS.APPROVED
}

/**
 * Check if status is rejected
 * @param {string} status - Status value
 * @returns {boolean} True if rejected
 */
export const isRejectedStatus = (status) => {
  return status.includes('Rejected')
}

/**
 * Check if status is pending
 * @param {string} status - Status value
 * @returns {boolean} True if pending
 */
export const isPendingStatus = (status) => {
  return status.includes('Pending')
}

export default {
  DEADLINES,
  BANK_ACCOUNT_CONFIG,
  PAGINATION,
  REQUEST_STATUS,
  STATUS_COLORS,
  VALID_TRANSITIONS,
  REASON_OPTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  REQUEST_ID_PREFIX,
  REQUIRED_FIELDS,
  getStatusColor,
  isInsufficientBalance,
  isApprovedStatus,
  isRejectedStatus,
  isPendingStatus,
}
