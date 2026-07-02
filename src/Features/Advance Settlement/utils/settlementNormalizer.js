/**
 * settlementNormalizer.js
 * ─────────────────────────
 * Transforms raw API responses (snake_case) into camelCase UI models.
 *
 * RULE: All API-to-component data translation happens HERE.
 * Components and Redux slices always work with camelCase.
 * Service layer calls normalizer before returning data to Redux.
 */

// ─── Settlement List Item Normalizer ─────────────────────────────────────────
/**
 * Normalizes a single settlement object from the API response.
 * Handles both list (my-settlements) and detail (by-id) responses.
 *
 * @param {Object} raw - Raw settlement object from backend
 * @returns {Object} Normalized camelCase settlement object
 */
export const normalizeSettlement = (raw) => {
  if (!raw || typeof raw !== 'object') return null

  // ── Normalize Expense Items ────────────────────────────────────────────────
  // Backend: { expense_type, expense_date, amount, remarks }
  // UI needs: { expenseHead, date, amount, remarks, glCode }
  const expenseItemsRaw = raw.expense_items || raw.expenseItems
  const expenseItems = Array.isArray(expenseItemsRaw)
    ? expenseItemsRaw.map((item) => ({
        expenseHead:    item['Expense Head']   || item.expenseHead    || item.expense_head   || item.expense_type  || '',
        date:           item['Date (DD/MM/YYYY)'] || item.Date || item.date || item.expense_date || '',
        amount:         Number(item['Amount (₹)'] ?? item.amount ?? item.Amount ?? 0),
        description:    item['Description']    || item.description    || '',
        remarks:        item['Remarks']        || item.remarks        || '',
        glCode:         item.glCode            || item.gl_code        || '',
        sno:            item['S. No']          || item.sno            || item.sNo           || '',
      }))
    : []

  // ── Normalize Approval History ────────────────────────────────────────────
  const history = Array.isArray(raw.history)
    ? raw.history.map((h) => ({
        action:     h.action      || h.event      || '',
        by:         h.by          || h.actor      || h.actor_name || '',
        date:       h.date        || h.created_at || h.timestamp   || '',
        comments:   h.comments    || h.remarks    || '',
        level:      h.level       || '',
      }))
    : []

  // ── Main Normalization ─────────────────────────────────────────────────────
  return {
    // Core Identifiers
    id:                    raw.id                     || null,
    settlementId:          raw.settlement_no          || raw.settlementId       || raw.id || null,

    // Employee Info (read from JWT by backend — returned in response)
    employeeId:            raw.employee_id            || raw.employeeId         || null,
    employeeName:          raw.employee_name          || raw.employeeName       || null,
    employeeGLCode:        raw.employee_gl_code       || raw.employeeGLCode     || null,
    region:                raw.region                 || null,

    // Financial Info
    totalAmount:           Number(raw.total_amount    ?? raw.totalAmount        ?? 0),
    osBalanceBefore:       Number(raw.outstanding_balance_before ?? raw.osBalanceBefore ?? 0),
    osBalanceAfter:        Number(raw.outstanding_balance_after  ?? raw.osBalanceAfter  ?? 0),

    // JV & Posting Info (added for Account Manager final approval)
    voucherNo:             raw.voucher_no             || raw.voucherNo          || null,
    ledgerTransactionId:   raw.ledger_transaction_id  || raw.ledgerTransactionId || null,
    costCenterId:          raw.cost_center_id         || raw.costCenterId        || null,

    // Status
    status:                raw.status                 || null,

    // Timestamps
    submittedAt:           raw.submitted_at           || raw.submittedAt        || null,
    updatedAt:             raw.updated_at             || raw.updatedAt          || null,

    // Files
    excelFile:             raw.excel_file             || raw.excelFile          || null,
    attachments:           Array.isArray(raw.attachments) ? raw.attachments    : [],

    // Approval Chain Info
    assignedToId:          raw.current_approval?.assigned_user_id
                            || raw.assignedToId       || null,
    currentLevel:          raw.current_approval?.level
                            || raw.currentLevel       || null,
    assignedTo:            raw.assigned_to            || raw.assignedTo         || null,

    // Clarification
    clarification:         raw.clarification_text     || raw.clarification      || null,
    clarificationAt:       raw.clarification_submitted_at || raw.clarification_at || null,

    // Rejection
    rejectionReason:       raw.rejection_reason       || raw.rejectionReason    || null,
    rejectedBy:            raw.rejected_by            || raw.rejectedBy         || null,

    // Expense Items (normalized array)
    expenseItems,
    expenseItemsCount:     raw.expense_items_count    || expenseItems.length    || 0,

    // Approval History
    history,

    // Approval-level remarks (chain)
    approvalRemarks:       raw.approval_remarks       || raw.approvalRemarks    || [],
  }
}

// ─── OS Balance Normalizer ────────────────────────────────────────────────────
/**
 * Normalizes OS Balance API response.
 * The backend already returns mostly camelCase for this endpoint —
 * we still go through a normalizer to guard against future changes.
 *
 * @param {Object} raw - Raw OS balance data object from backend
 * @returns {Object} Normalized OS balance object
 */
export const normalizeOsBalance = (raw) => {
  if (!raw || typeof raw !== 'object') return null

  const recentTransactions = Array.isArray(raw.recentTransactions)
    ? raw.recentTransactions.map((txn) => ({
        date:      txn.date      || null,
        voucherNo: txn.voucherNo || txn.voucher_no || null,
        type:      txn.type      || null,
        debit:     Number(txn.debit  ?? 0),
        credit:    Number(txn.credit ?? 0),
        balance:   Number(txn.balance ?? 0),
      }))
    : []

  return {
    employeeId:   raw.employeeId   || raw.employee_id   || null,
    employeeName: raw.employeeName || raw.employee_name  || null,
    employeeGLCode: raw.employeeGLCode || raw.employee_gl_code || null,

    // Already camelCase from backend (confirmed from Postman)
    osBalance:        Number(raw.osBalance    ?? 0),
    lastCalculated:   raw.lastCalculated      || null,

    transactionSummary: {
      totalDebits:  Number(raw.transactionSummary?.totalDebits  ?? 0),
      totalCredits: Number(raw.transactionSummary?.totalCredits ?? 0),
      netBalance:   Number(raw.transactionSummary?.netBalance   ?? 0),
    },

    recentTransactions,
  }
}

// ─── Settlement List Normalizer ───────────────────────────────────────────────
/**
 * Normalizes an array of settlements from a list API response.
 *
 * @param {Array} rawList - Array of raw settlement objects
 * @returns {Array} Array of normalized settlement objects
 */
export const normalizeSettlementList = (rawList) => {
  if (!Array.isArray(rawList)) return []
  return rawList
    .map(normalizeSettlement)
    .filter(Boolean) // Remove any nulls from malformed items
}

// ─── Pagination Normalizer ────────────────────────────────────────────────────
/**
 * Normalizes pagination data from any API response.
 *
 * @param {Object} rawPagination - Raw pagination object from backend
 * @param {number} fallbackTotal - Fallback total items if missing
 * @param {number} defaultLimit - Default page size
 * @returns {Object} Normalized pagination object
 */
export const normalizePagination = (rawPagination, fallbackTotal = 0, defaultLimit = 10) => {
  if (!rawPagination || typeof rawPagination !== 'object') {
    return {
      currentPage: 1,
      totalPages:  1,
      totalItems:  fallbackTotal,
      pageSize:    defaultLimit,
    }
  }

  const totalItems = rawPagination.total
    ?? rawPagination.totalItems
    ?? rawPagination.total_count
    ?? fallbackTotal

  const pageSize = rawPagination.limit
    ?? rawPagination.pageSize
    ?? rawPagination.page_size
    ?? defaultLimit

  const currentPage = rawPagination.page
    ?? rawPagination.currentPage
    ?? rawPagination.current_page
    ?? 1

  const totalPages = rawPagination.totalPages
    ?? rawPagination.total_pages
    ?? (pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1)

  return {
    currentPage: Number(currentPage),
    totalPages:  Number(totalPages),
    totalItems:  Number(totalItems),
    pageSize:    Number(pageSize),
  }
}
