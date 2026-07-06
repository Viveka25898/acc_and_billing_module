/**
 * settlementConstants.js
 * ─────────────────────────
 * Central constants for the Advance Settlement feature.
 *
 * ALL status values from the backend are SCREAMING_SNAKE_CASE enums.
 * This file maps them to human-readable labels and UI badge colors.
 *
 * Import from here in ALL components — never hard-code status strings.
 */

// ─── Status Enum ──────────────────────────────────────────────────────────────
// Matches exactly what the backend sends in the `status` field
export const SETTLEMENT_STATUS = {
  PENDING_REGIONAL_HEAD:    'PENDING_REGIONAL_HEAD',
  PENDING_AVP:              'PENDING_AVP',
  PENDING_VP:               'PENDING_VP',
  PENDING_AE:               'PENDING_AE',
  PENDING_AM:               'PENDING_AM',
  CLARIFICATION_REQUESTED:  'CLARIFICATION_REQUESTED',
  APPROVED:                 'APPROVED',
  REJECTED:                 'REJECTED',
}

// ─── Human-Readable Labels ────────────────────────────────────────────────────
// Used in tables, badges, and detail views
export const STATUS_LABELS = {
  [SETTLEMENT_STATUS.PENDING_REGIONAL_HEAD]:   'Pending Regional Head Approval',
  [SETTLEMENT_STATUS.PENDING_AVP]:             'Pending AVP Operations Approval',
  [SETTLEMENT_STATUS.PENDING_VP]:              'Pending VP Operations Approval',
  [SETTLEMENT_STATUS.PENDING_AE]:              'Pending Account Executive Approval',
  [SETTLEMENT_STATUS.PENDING_AM]:              'Pending Account Manager Approval',
  [SETTLEMENT_STATUS.CLARIFICATION_REQUESTED]: 'Clarification Requested',
  [SETTLEMENT_STATUS.APPROVED]:                'Approved',
  [SETTLEMENT_STATUS.REJECTED]:                'Rejected',
}

// ─── Badge Color Classes (Tailwind) ───────────────────────────────────────────
// Returns Tailwind class string for each status badge
export const STATUS_COLORS = {
  [SETTLEMENT_STATUS.PENDING_REGIONAL_HEAD]:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  [SETTLEMENT_STATUS.PENDING_AVP]:             'bg-orange-100 text-orange-800 border-orange-200',
  [SETTLEMENT_STATUS.PENDING_VP]:              'bg-blue-100 text-blue-800 border-blue-200',
  [SETTLEMENT_STATUS.PENDING_AE]:              'bg-purple-100 text-purple-800 border-purple-200',
  [SETTLEMENT_STATUS.PENDING_AM]:              'bg-indigo-100 text-indigo-800 border-indigo-200',
  [SETTLEMENT_STATUS.CLARIFICATION_REQUESTED]: 'bg-amber-100 text-amber-800 border-amber-200',
  [SETTLEMENT_STATUS.APPROVED]:                'bg-green-100 text-green-800 border-green-200',
  [SETTLEMENT_STATUS.REJECTED]:                'bg-red-100 text-red-800 border-red-200',
}

// ─── Status Filter Groups ─────────────────────────────────────────────────────
// For filter dropdowns in My Settlements list
export const STATUS_FILTER_MAP = {
  'All':      null,
  'Pending':  [
    SETTLEMENT_STATUS.PENDING_REGIONAL_HEAD,
    SETTLEMENT_STATUS.PENDING_AVP,
    SETTLEMENT_STATUS.PENDING_VP,
    SETTLEMENT_STATUS.PENDING_AE,
    SETTLEMENT_STATUS.PENDING_AM,
    SETTLEMENT_STATUS.CLARIFICATION_REQUESTED,
  ],
  'Approved': [SETTLEMENT_STATUS.APPROVED],
  'Rejected': [SETTLEMENT_STATUS.REJECTED],
}

// ─── Approval Level → Role Map ────────────────────────────────────────────────
// Which backend role is responsible for which pending status
export const APPROVAL_ROLE_MAP = {
  [SETTLEMENT_STATUS.PENDING_REGIONAL_HEAD]: 'regional-head',
  [SETTLEMENT_STATUS.PENDING_AVP]:           'avp-operations',
  [SETTLEMENT_STATUS.PENDING_VP]:            'vp-operations',
  [SETTLEMENT_STATUS.PENDING_AE]:            'ae',
  [SETTLEMENT_STATUS.PENDING_AM]:            'account-manager',
}

// ─── Helper: Get Human-Readable Label ────────────────────────────────────────
/**
 * @param {string} status - Backend status enum string
 * @returns {string} Human-readable status label
 */
export const getStatusLabel = (status) => {
  if (!status) return 'Unknown'
  return STATUS_LABELS[status] || status
}

// ─── Helper: Get Badge Color Classes ─────────────────────────────────────────
/**
 * @param {string} status - Backend status enum string
 * @returns {string} Tailwind CSS class string for the badge
 */
export const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200'
  const normalized = String(status).toUpperCase()
  if (normalized.startsWith('REJECTED')) {
    return 'bg-red-100 text-red-800 border-red-200'
  }
  return STATUS_COLORS[status] || 'bg-gray-100 text-gray-800 border-gray-200'
}

// ─── Helper: Is Pending Status ────────────────────────────────────────────────
/**
 * @param {string} status - Backend status enum string
 * @returns {boolean} True if settlement is still in an approval queue
 */
export const isPendingStatus = (status) => {
  return [
    SETTLEMENT_STATUS.PENDING_REGIONAL_HEAD,
    SETTLEMENT_STATUS.PENDING_AVP,
    SETTLEMENT_STATUS.PENDING_VP,
    SETTLEMENT_STATUS.PENDING_AE,
    SETTLEMENT_STATUS.PENDING_AM,
    SETTLEMENT_STATUS.CLARIFICATION_REQUESTED,
  ].includes(status)
}

// ─── Helper: Is Final Status ──────────────────────────────────────────────────
/**
 * @param {string} status - Backend status enum string
 * @returns {boolean} True if settlement has reached a terminal state
 */
export const isFinalStatus = (status) => {
  return [SETTLEMENT_STATUS.APPROVED, SETTLEMENT_STATUS.REJECTED].includes(status)
}

// ─── Expense Heads Master (GL Code Map) ──────────────────────────────────────
// Used both by the Excel template generator and the settlement form
export const EXPENSE_HEADS_MASTER = {
  'Travel': {
    code: 'TRAVEL',
    name: 'Travel',
    glCode: 'X1001002001',
    category: 'DIRECT_EXPENSES',
  },
  'Food & Refreshments': {
    code: 'FOOD',
    name: 'Food & Refreshments',
    glCode: 'X1001003001',
    category: 'DIRECT_EXPENSES',
  },
  'Hotel Accommodation': {
    code: 'ACCOMMODATION',
    name: 'Hotel Accommodation',
    glCode: 'X1001002002',
    category: 'DIRECT_EXPENSES',
  },
  'Parking Charges': {
    code: 'PARKING',
    name: 'Parking Charges',
    glCode: 'X1001002003',
    category: 'DIRECT_EXPENSES',
  },
  'Office Supplies': {
    code: 'OFFICE_SUPPLIES',
    name: 'Office Supplies',
    glCode: 'X2001002001',
    category: 'BRANCH_EXPENSES',
  },
  'Client Entertainment': {
    code: 'CLIENT_ENTERTAINMENT',
    name: 'Client Entertainment',
    glCode: 'X2002002001',
    category: 'CORPORATE_EXPENSES',
  },
  'Other Expenses': {
    code: 'OTHER',
    name: 'Other Expenses',
    glCode: 'X2002002001',
    category: 'CORPORATE_EXPENSES',
  },
}
