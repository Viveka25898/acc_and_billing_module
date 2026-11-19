/**
 * nonPoExpenseConfig.js
 * ─────────────────────────────────────────────────────────────
 * Central configuration file for Non-PO / Emergency Expense feature.
 * Defines workflow statuses, colors, approval hierarchy, validation
 * constants, categories, and utility helpers.
 */

// ─── APPROVAL CHAIN ──────────────────────────────────────────────────────────
export const APPROVAL_CHAIN = [
  { stage: 'RH', role: 'regional-head', label: 'Regional Head' },
  { stage: 'AVP', role: 'avp-operations', label: 'AVP Operations' },
  { stage: 'VP', role: 'vp-operations', label: 'VP Operations' },
  { stage: 'AE', role: 'ae', label: 'Account Executive' },
  { stage: 'AM', role: 'account-manager', label: 'Accounts Manager' },
]

// ─── STATUS CONSTANTS ────────────────────────────────────────────────────────
export const WORKFLOW_STATUS = {
  DRAFT: 'Draft',
  PENDING_RH: 'Pending with Regional Head',
  PENDING_AVP: 'Pending with AVP',
  PENDING_VP: 'Pending with VP',
  PENDING_AE: 'Pending with Account Executive',
  PENDING_AM: 'Pending with Accounts Manager',
  APPROVED_ACCOUNTS: 'Approved - Awaiting Accounts Processing',
  READY_PAYMENT: 'Ready for Payment',
  PAYMENT_RECORDED: 'Payment Recorded - Awaiting Release',
  RELEASED: 'Released',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  CLOSED: 'Closed',
}

export const PAYMENT_STATUS = {
  NOT_APPLICABLE: 'Not Applicable',
  PENDING_PROCESSING: 'Pending Processing',
  READY_FOR_PAYMENT: 'Ready for Payment',
  PAID: 'Paid',
}

// ─── BADGE COLORS (Tailwind) ────────────────────────────────────────────────
export const STATUS_COLORS = {
  [WORKFLOW_STATUS.DRAFT]: 'bg-gray-100 text-gray-700 border-gray-200',
  [WORKFLOW_STATUS.PENDING_RH]: 'bg-amber-100 text-amber-800 border-amber-300',
  [WORKFLOW_STATUS.PENDING_AVP]: 'bg-amber-100 text-amber-800 border-amber-300',
  [WORKFLOW_STATUS.PENDING_VP]: 'bg-amber-100 text-amber-800 border-amber-300',
  [WORKFLOW_STATUS.PENDING_AE]: 'bg-amber-100 text-amber-800 border-amber-300',
  [WORKFLOW_STATUS.PENDING_AM]: 'bg-amber-100 text-amber-800 border-amber-300',
  [WORKFLOW_STATUS.APPROVED_ACCOUNTS]: 'bg-blue-100 text-blue-800 border-blue-300',
  [WORKFLOW_STATUS.READY_PAYMENT]: 'bg-blue-100 text-blue-800 border-blue-300',
  [WORKFLOW_STATUS.PAYMENT_RECORDED]: 'bg-indigo-100 text-indigo-800 border-indigo-300',
  [WORKFLOW_STATUS.RELEASED]: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  [WORKFLOW_STATUS.REJECTED]: 'bg-red-100 text-red-800 border-red-300',
  [WORKFLOW_STATUS.CANCELLED]: 'bg-gray-200 text-gray-800 border-gray-300',
  [WORKFLOW_STATUS.CLOSED]: 'bg-gray-300 text-gray-900 border-gray-400',
}

// ─── URGENCY CONSTANTS & COLORS ─────────────────────────────────────────────
export const URGENCY_OPTIONS = [
  { value: 'critical', label: 'Critical (Same day)' },
  { value: 'high', label: 'High (Within 3 days)' },
  { value: 'normal', label: 'Normal (Within 7 days)' },
]

export const URGENCY_COLORS = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  normal: 'bg-gray-100 text-gray-600 border-gray-200',
}

// ─── EXPENSE TYPES & CATEGORIES ─────────────────────────────────────────────
export const EXPENSE_TYPES = [
  'Emergency Repair',
  'Site Operational Expense',
  'Reliever / Consultant',
  'Other',
]

export const EXPENSE_CATEGORIES_MAP = {
  'Emergency Repair': [
    { id: 'cat_er_elec', name: 'Electrical Failure & Urgent Fixes' },
    { id: 'cat_er_plumb', name: 'Plumbing & Drainage Leaks' },
    { id: 'cat_er_hvac', name: 'HVAC / AC Emergency Repair' },
    { id: 'cat_er_fire', name: 'Fire Safety & Damaged Equipment' },
    { id: 'cat_er_struct', name: 'Structural & Glass Breakdown' },
  ],
  'Site Operational Expense': [
    { id: 'cat_so_diesel', name: 'Generator / Diesel Refueling' },
    { id: 'cat_so_chem', name: 'Emergency Chemicals & Consumables' },
    { id: 'cat_so_trans', name: 'Unscheduled Site Transport / Vehicle' },
    { id: 'cat_so_water', name: 'Emergency Water Tanker Supply' },
    { id: 'cat_so_pest', name: 'Urgent Pest Management' },
  ],
  'Reliever / Consultant': [
    { id: 'cat_rc_reliever', name: 'Emergency Reliever Staff' },
    { id: 'cat_rc_expert', name: 'Technical / Audit Consultant' },
    { id: 'cat_rc_safety', name: 'Third-party Safety Inspector' },
  ],
  'Other': [
    { id: 'cat_ot_gov', name: 'Local Authority / Municipal Fee' },
    { id: 'cat_ot_gen', name: 'Miscellaneous Unplanned Expense' },
  ],
}

// ─── PAYEE TYPES ─────────────────────────────────────────────────────────────
export const PAYEE_TYPES = [
  'Vendor',
  'Employee',
  'Consultant / Reliever',
  'Other approved beneficiary',
]

// ─── ATTACHMENTS ─────────────────────────────────────────────────────────────
export const ATTACHMENT_TYPES = [
  'Invoice',
  'Quotation',
  'Photo',
  'Incident Report',
  'Approval Evidence',
  'Other',
]

export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx']
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
export const MAX_ATTACHMENTS_COUNT = 10

// ─── VALIDATION LIMITS ───────────────────────────────────────────────────────
export const VALIDATION_LIMITS = {
  REASON_MIN: 20,
  REASON_MAX: 1000,
  JUSTIFICATION_MIN: 20,
  JUSTIFICATION_MAX: 1000,
  REJECTION_MIN: 10,
  MAX_AMOUNT: 999999999.99,
  MAX_PAST_DAYS: 30,
}

// ─── ACCOUNTING GL MASTER CONSTANTS ─────────────────────────────────────────
export const NON_PO_GL_ACCOUNTS = {
  // Expense Ledger (P&L)
  EXPENSE_LEDGER_CODE: 'X2003001',
  EXPENSE_LEDGER_NAME: 'Non PO Expense Ledger',
  EXPENSE_PARENT_GL: 'X2003',

  // Liability Ledger (Current Liability)
  LIABILITY_LEDGER_CODE: 'L2001003',
  LIABILITY_LEDGER_NAME: 'Non PO Liability Ledger',
  LIABILITY_PARENT_GL: 'L2001',

  // GST Input Credit (Parent: A3007001 - GST input accounts)
  GST_INPUT_PARENT_GL: 'A3007001',
  GST_INPUT_PARENT_NAME: 'GST input accounts',

  CGST_INPUT_CODE: 'A3007001001',
  CGST_INPUT_NAME: 'CGST input',

  SGST_INPUT_CODE: 'A3007001002',
  SGST_INPUT_NAME: 'SGST input',

  IGST_INPUT_CODE: 'A3007001003',
  IGST_INPUT_NAME: 'IGST input',
}

// ─── UTILITY FORMATTERS ──────────────────────────────────────────────────────
export const formatAmountINR = (amount) => {
  const num = Number(amount)
  if (isNaN(num)) return '₹0.00'
  return `₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export const formatDateDMY = (dateStr) => {
  if (!dateStr) return '—'
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    const day = String(d.getDate()).padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day}-${month}-${year}`
  } catch {
    return dateStr
  }
}
