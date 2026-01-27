/* eslint-disable no-unused-vars */
/**
 * P&L Report Data Service
 * Fetches and aggregates real ledger data from transactions for P&L reports.
 * Supports monthly period with All / State / Client filters.
 * Production-ready with try-catch and validation.
 */

/** P&L bucket keys */
/** P&L bucket keys - Schedule III Mapped */
export const PL_KEYS = {
  // Revenue
  REVENUE_FROM_OPS: 'revenueFromOps', // Note 15
  OTHER_INCOME: 'otherIncome', // Note 16
  TOTAL_REVENUE: 'totalRevenue', // III = I + II

  // Expenses
  COST_OF_MATERIALS: 'costOfMaterials', // Note 17
  EMPLOYEE_BENEFITS: 'employeeBenefits', // Note 18
  FINANCE_COSTS: 'financeCosts', // Note 19
  DEPRECIATION_AMORT: 'depreciationAmort', // Note 9 (as per image)
  OTHER_EXPENSES: 'otherExpenses', // Note 20
  TOTAL_EXPENSES: 'totalExpenses', // V = Sum of IV

  // Profit Analysis
  PROFIT_BEFORE_TAX: 'profitBeforeTax', // VI = III - V

  // Tax
  CURRENT_TAX: 'currentTax',
  DEFERRED_TAX: 'deferredTax',
  TAX_SUBTOTAL: 'taxSubtotal', // VII

  // Final Profit
  PROFIT_AFTER_TAX: 'profitAfterTax', // VIII = VI - VII
}

/**
 * GL → P&L mapping (Notes 15-20).
 * Revenue: Credit - Debit
 * Expense: Debit - Credit
 */
const GL_TO_PL = {
  // Note 15: Revenue from Operations
  // Includes 'Facility Management Contractual charges'
  [PL_KEYS.REVENUE_FROM_OPS]: {
    type: 'revenue',
    match: (code) => {
      // Logic: Starts with 'R' but EXCLUDE 'Miscellaneous Income'
      return typeof code === 'string' && code.startsWith('R') && code !== 'R2001001'
    },
  },

  // Note 16: Other Income
  // Includes 'Miscellaneous Income' (R2001001)
  [PL_KEYS.OTHER_INCOME]: {
    type: 'revenue',
    match: (code) => code === 'R2001001',
  },

  // Note 17: Cost of Materials Consumed
  // Includes 'Material Consumed', 'Uniform Consumed'
  [PL_KEYS.COST_OF_MATERIALS]: {
    type: 'expense',
    match: (code) =>
      typeof code === 'string' &&
      (code.startsWith('X1001004') || code === 'X2001004'),
  },

  // Note 18: Employee Benefits Expense
  // Includes Salaries, EPF, Staff Welfare, Bonus, Leave Encashment
  [PL_KEYS.EMPLOYEE_BENEFITS]: {
    type: 'expense',
    match: (code) =>
      typeof code === 'string' &&
      (code.startsWith('X2001001') || // Salaries & Wages family
        code.startsWith('X2002001') || // Contribution to funds family
        code.startsWith('X1001001') || // Site Salaries
        /salary|wages|staff welfare|bonus|leave encashment|gratuity/i.test(code)), // Fallback text match if codes vary
  },

  // Note 19: Finance Costs
  // Includes Interest on borrowings, Bank charges (if categorized here)
  [PL_KEYS.FINANCE_COSTS]: {
    type: 'expense',
    match: (code) =>
      typeof code === 'string' &&
      (/^X.*[Ff]inance|Interest|X2.*19/i.test(code)),
  },

  // Note 9: Depreciation and Amortization
  [PL_KEYS.DEPRECIATION_AMORT]: {
    type: 'expense',
    useCreditMinusDebit: true, // Accumulated Dep usually Credit balance
    match: (code) =>
      typeof code === 'string' &&
      (code === 'A1008' || code.startsWith('A1008') || /[Dd]epreciation|[Aa]mort/i.test(code)),
  },

  // Note 20: Other Expenses
  // Catch-all for everything else starting with 'X' that isn't matched above
  [PL_KEYS.OTHER_EXPENSES]: {
    type: 'expense',
    match: (code) => {
      if (typeof code !== 'string' || !code.startsWith('X')) return false
      // Exclude matches from above categories to prevent double counting
      if (code.startsWith('X1001004') || code === 'X2001004') return false // Materials
      if (code.startsWith('X2001001') || code.startsWith('X2002001') || code.startsWith('X1001001') || /salary|wages/i.test(code)) return false // Employee
      if (/^X.*[Ff]inance|Interest|X2.*19/i.test(code)) return false // Finance
      // Add more specific exclusions if keys overlap
      return true
    },
  },

  // Tax Expense - Placeholder placeholders if distinct GL codes exist
  [PL_KEYS.CURRENT_TAX]: {
    type: 'expense',
    match: (code) => /Current Tax/i.test(code),
  },
  [PL_KEYS.DEFERRED_TAX]: {
    type: 'expense',
    match: (code) => /Deferred Tax/i.test(code),
  }
}

function safeParseFloat(val) {
  if (val == null) return 0
  const n = typeof val === 'number' ? val : parseFloat(String(val).replace(/[₹,\s]/g, ''))
  return Number.isFinite(n) ? n : 0
}

/**
 * Parse transaction date to Date. Handles YYYY-MM-DD, DD-MM-YYYY, DD-MM-YY, etc.
 * @param {string|Date} dateInput
 * @returns {Date|null}
 */
function parseTransactionDate(dateInput) {
  try {
    if (!dateInput) return null
    if (dateInput instanceof Date) return isNaN(dateInput.getTime()) ? null : dateInput
    const s = String(dateInput).trim()
    if (!s) return null
    if (s.includes('-')) {
      const parts = s.split('-').map((p) => p.trim())
      if (parts.length !== 3) return null
      const [a, b, c] = parts
      let y, m, d
      if (a.length === 4) {
        y = parseInt(a, 10)
        m = parseInt(b, 10)
        d = parseInt(c, 10)
      } else {
        d = parseInt(a, 10)
        m = parseInt(b, 10)
        y = parseInt(c, 10)
        if (y < 100) y += 2000
      }
      const dt = new Date(y, m - 1, d)
      return isNaN(dt.getTime()) ? null : dt
    }
    const dt = new Date(s)
    return isNaN(dt.getTime()) ? null : dt
  } catch {
    return null
  }
}

/**
 * Check if transaction falls in given month (1-based) and year.
 * @param {Date|null} txDate
 * @param {number} year
 * @param {number} month 1-12
 */
function isInMonth(txDate, year, month) {
  if (!txDate) return false
  return txDate.getFullYear() === year && txDate.getMonth() + 1 === month
}

/**
 * Check if transaction passes client filter.
 * @param {object} txn
 * @param {string|null} clientFilter 'All' | client name | client code
 */
function passesClientFilter(txn, clientFilter) {
  if (!clientFilter || clientFilter === 'All' || clientFilter === 'all') return true
  const c = (txn.customer || txn.clientName || '').toString().trim()
  const code = (txn.clientCode || txn.client || '').toString().trim()
  const filter = String(clientFilter).trim()
  return c === filter || code === filter || c.toLowerCase() === filter.toLowerCase()
}

/**
 * Check if transaction passes state filter.
 * @param {object} txn
 * @param {string|null} stateFilter 'All' | state name
 */
function passesStateFilter(txn, stateFilter) {
  if (!stateFilter || stateFilter === 'All' || stateFilter === 'all') return true
  const s = (txn.state || '').toString().trim()
  const filter = String(stateFilter).trim()
  return s === filter || s.toLowerCase() === filter.toLowerCase()
}

/**
 * Filter transactions by period (monthly) and optional client/state.
 * @param {object[]} transactions
 * @param {object} periodData { month, year, client, state, clientName, stateName }
 * @returns {object[]}
 */
function filterTransactionsByPeriod(transactions, periodData) {
  try {
    const month = parseInt(periodData.month, 10)
    const year = parseInt(periodData.year, 10)
    if (!month || month < 1 || month > 12 || !year || year < 2000) return []

    const clientFilter = periodData.clientName ?? periodData.client ?? null
    const stateFilter = periodData.stateName ?? periodData.state ?? null

    // Diagnostic counts
    let total = 0
    let passedDate = 0
    let failedDate = 0
    let failedClient = 0
    let failedState = 0

    const result = transactions.filter((txn) => {
      total++
      const txDate = parseTransactionDate(txn.date)
      if (!isInMonth(txDate, year, month)) {
        failedDate++
        return false
      }
      passedDate++
      if (!passesClientFilter(txn, clientFilter)) {
        failedClient++
        return false
      }
      if (!passesStateFilter(txn, stateFilter)) {
        failedState++
        return false
      }
      return true
    })

    // console.log('[PLReportDataService] filterTransactionsByPeriod diagnostics', {
    //   period: `${month}/${year}`,
    //   totalChecked: total,
    //   passedDate,
    //   failedDate,
    //   failedClient,
    //   failedState,
    //   clientFilter,
    //   stateFilter,
    //   returned: result.length,
    // })

    return result
  } catch (e) {
    console.error('PLReportDataService: filterTransactionsByPeriod error', e)
    return []
  }
}

/**
 * Aggregate P&L buckets from transaction entries.
 * @param {object[]} transactions
 * @returns {{ totals: Record<string,number>, schedule: Record<string,Record<string,number>> }}
 */
function aggregateFromTransactions(transactions) {
  const totals = {}
  Object.keys(GL_TO_PL).forEach((k) => {
    totals[k] = 0
  })

  const schedule = {
    revenueFromOps: {},
    otherIncome: {},
    costOfMaterials: {},
    employeeBenefits: {},
    otherExpenses: {},
  }

  try {
    console.log('[PLReportDataService] aggregateFromTransactions: Processing', transactions.length, 'transactions')
    const allGLCodes = {}
    for (const txn of transactions) {
      const entries = Array.isArray(txn.entries) ? txn.entries : []
      if (entries.length > 0) {
        console.log(`[PLReportDataService] Transaction:`, txn.id || txn.date, 'with', entries.length, 'entries')
      }
      for (const entry of entries) {
        const glCode = entry?.glCode
        if (!glCode) continue
        const debit = safeParseFloat(entry.debit)
        const credit = safeParseFloat(entry.credit)

        // Track all GL codes seen
        allGLCodes[glCode] = (allGLCodes[glCode] || 0) + 1

        let matched = false
        for (const [bucket, cfg] of Object.entries(GL_TO_PL)) {
          if (!cfg.match(glCode)) continue
          matched = true
          let amount = 0
          if (cfg.type === 'revenue') {
            amount = credit - debit
          } else if (cfg.useCreditMinusDebit) {
            amount = credit - debit // e.g. A1008 accum dep credit
          } else {
            amount = debit - credit
          }
          if (amount !== 0) {
            console.log(`  [${bucket}] GL: ${glCode}, D: ${debit}, C: ${credit}, Amt: ${amount}`)
            totals[bucket] = (totals[bucket] || 0) + amount
            if (schedule[bucket] && typeof schedule[bucket] === 'object') {
              schedule[bucket][glCode] = (schedule[bucket][glCode] || 0) + amount
            }
          }
          break
        }
        if (!matched) {
          console.warn(`  [UNMATCHED] GL: ${glCode}, D: ${debit}, C: ${credit}`)
        }
      }
    }
    console.log('[PLReportDataService] All GL Codes found:', allGLCodes)

    totals[PL_KEYS.TOTAL_REVENUE] =
      (totals[PL_KEYS.REVENUE_FROM_OPS] || 0) + (totals[PL_KEYS.OTHER_INCOME] || 0)

    totals[PL_KEYS.TOTAL_EXPENSES] =
      (totals[PL_KEYS.COST_OF_MATERIALS] || 0) +
      (totals[PL_KEYS.EMPLOYEE_BENEFITS] || 0) +
      (totals[PL_KEYS.FINANCE_COSTS] || 0) +
      (totals[PL_KEYS.DEPRECIATION_AMORT] || 0) +
      (totals[PL_KEYS.OTHER_EXPENSES] || 0)

    totals[PL_KEYS.PROFIT_BEFORE_TAX] =
      (totals[PL_KEYS.TOTAL_REVENUE] || 0) - (totals[PL_KEYS.TOTAL_EXPENSES] || 0)

    totals[PL_KEYS.TAX_SUBTOTAL] =
      (totals[PL_KEYS.CURRENT_TAX] || 0) + (totals[PL_KEYS.DEFERRED_TAX] || 0)

    totals[PL_KEYS.PROFIT_AFTER_TAX] =
      (totals[PL_KEYS.PROFIT_BEFORE_TAX] || 0) - (totals[PL_KEYS.TAX_SUBTOTAL] || 0)
  } catch (e) {
    console.error('PLReportDataService: aggregateFromTransactions error', e)
  }

  return { totals, schedule }
}

/**
 * Load transactions from localStorage. Returns [] on error.
 * @returns {object[]}
 */
function loadTransactions() {
  try {
    const raw = localStorage.getItem('transactions')
    if (!raw) return []
    const data = JSON.parse(raw)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.error('PLReportDataService: loadTransactions error', e)
    return []
  }
}

/**
 * Get P&L data for the given period (monthly) and filters (All / State / Client).
 * Returns current period + previous year same month for comparison.
 *
 * @param {object} periodData - { periodType, month, year, monthName, client, state, clientName, stateName }
 * @returns {{
 *   success: boolean,
 *   error?: string,
 *   current: Record<string,number>,
 *   previous: Record<string,number>,
 *   schedule: { totals: object, schedule: object },
 *   meta: { transactionCount: number, periodLabel: string, filters: object }
 * }}
 */
export function getPLData(periodData) {
  const emptyTotals = () => {
    const o = {}
    Object.keys(PL_KEYS).forEach((k) => {
      o[PL_KEYS[k]] = 0
    })
    return o
  }

  const result = {
    success: false,
    current: emptyTotals(),
    previous: emptyTotals(),
    schedule: { totals: {}, schedule: {} },
    meta: {
      transactionCount: 0,
      previousTransactionCount: 0,
      periodLabel: '',
      filters: { client: 'All', state: 'All' },
    },
  }

  try {
    if (!periodData || typeof periodData !== 'object') {
      result.error = 'Invalid period data'
      return result
    }

    const allTxns = loadTransactions()
    const periodType = periodData.periodType || 'monthly'
    const year = parseInt(periodData.year, 10)
    const client = periodData.clientName ?? periodData.client ?? 'All'
    const state = periodData.stateName ?? periodData.state ?? 'All'

    let currentTxns = []
    let previousTxns = []
    let periodLabel = ''

    if (periodType === 'monthly') {
      const month = parseInt(periodData.month, 10)
      if (!month || month < 1 || month > 12 || !year || year < 2000) {
        result.error = 'Invalid month or year'
        return result
      }
      const currentPeriod = { ...periodData, month, year }
      const previousPeriod = { ...periodData, month, year: year - 1 }
      currentTxns = filterTransactionsByPeriod(allTxns, currentPeriod)
      previousTxns = filterTransactionsByPeriod(allTxns, previousPeriod)
      periodLabel = `${periodData.monthName || month} ${year}`
    } else if (periodType === 'quarterly') {
      // periodData.quarter: 1-4 or 'Q1'..'Q4', periodData.months: [4,5,6] etc
      let quarter = periodData.quarter
      if (typeof quarter === 'string' && quarter.startsWith('Q')) quarter = parseInt(quarter.replace('Q', ''), 10)
      else quarter = parseInt(quarter, 10)
      if (!quarter || quarter < 1 || quarter > 4 || !year || year < 2000) {
        result.error = 'Invalid quarter or year'
        return result
      }
      // months: Q1: [4,5,6], Q2: [7,8,9], Q3: [10,11,12], Q4: [1,2,3]
      let months = periodData.months
      if (!Array.isArray(months) || months.length !== 3) {
        // fallback: calculate months
        if (quarter === 1) months = [4, 5, 6]
        else if (quarter === 2) months = [7, 8, 9]
        else if (quarter === 3) months = [10, 11, 12]
        else months = [1, 2, 3]
      }
      // Ensure months are numbers (handle '01', '02', ...)
      months = months.map(m => parseInt(m, 10)).filter(m => !isNaN(m))
      // Filter for all 3 months in the quarter
      currentTxns = allTxns.filter(txn => {
        const txDate = parseTransactionDate(txn.date)
        return txDate && txDate.getFullYear() === year && months.includes(txDate.getMonth() + 1)
          && passesClientFilter(txn, client) && passesStateFilter(txn, state)
      })
      previousTxns = allTxns.filter(txn => {
        const txDate = parseTransactionDate(txn.date)
        return txDate && txDate.getFullYear() === (year - 1) && months.includes(txDate.getMonth() + 1)
          && passesClientFilter(txn, client) && passesStateFilter(txn, state)
      })
      periodLabel = periodData.quarterLabel || `Q${quarter} ${year}`
    } else if (periodType === 'yearly') {
      if (!year || year < 2000) {
        result.error = 'Invalid year'
        return result
      }
      // April to March (FY): months 4-12 of year, 1-3 of year+1
      currentTxns = allTxns.filter(txn => {
        const txDate = parseTransactionDate(txn.date)
        if (!txDate) return false
        const y = txDate.getFullYear()
        const m = txDate.getMonth() + 1
        // FY: April (4) to March (3)
        return (
          (y === year && m >= 4 && m <= 12) ||
          (y === year + 1 && m >= 1 && m <= 3)
        ) && passesClientFilter(txn, client) && passesStateFilter(txn, state)
      })
      previousTxns = allTxns.filter(txn => {
        const txDate = parseTransactionDate(txn.date)
        if (!txDate) return false
        const y = txDate.getFullYear()
        const m = txDate.getMonth() + 1
        return (
          (y === (year - 1) && m >= 4 && m <= 12) ||
          (y === year && m >= 1 && m <= 3)
        ) && passesClientFilter(txn, client) && passesStateFilter(txn, state)
      })
      periodLabel = `FY ${year} - ${year + 1}`
    } else {
      result.error = 'Unsupported period type'
      return result
    }

    const currentAgg = aggregateFromTransactions(currentTxns)
    const previousAgg = aggregateFromTransactions(previousTxns)

    result.current = currentAgg.totals
    result.previous = previousAgg.totals
    result.schedule = {
      current: currentAgg,
      previous: previousAgg,
    }
    result.meta = {
      transactionCount: currentTxns.length,
      previousTransactionCount: previousTxns.length,
      periodLabel,
      filters: {
        client,
        state,
      },
    }
    result.success = true
    // console.log('[PLReportDataService] Final P&L Result:', {
    //   periodType,
    //   periodLabel,
    //   currentTxnCount: currentTxns.length,
    //   previousTxnCount: previousTxns.length,
    //   current: result.current,
    //   previous: result.previous,
    // })
    return result
  } catch (e) {
    console.error('PLReportDataService: getPLData error', e)
    result.error = e instanceof Error ? e.message : 'Failed to compute P&L data'
    return result
  }
}

export default {
  getPLData,
  PL_KEYS,
  parseTransactionDate,
  filterTransactionsByPeriod,
  aggregateFromTransactions,
  loadTransactions,
  analyzeTransactionData,
  dumpAllTransactionsToConsole,
}

/**
 * Analyze and categorize all transactions based on data completeness and filtering.
 * Outputs detailed console logs showing:
 * - Transactions with complete data (state, client, site)
 * - Transactions missing specific fields
 * - Filtering results by state, client, and date
 * 
 * @param {object} periodData - { month, year, clientName, stateName } (optional)
 * @returns {object} Analysis summary with categorized transactions
 */
export function analyzeTransactionData(periodData = null) {
  try {
    console.group('🔍 === TRANSACTION DATA ANALYSIS ===')

    const allTxns = loadTransactions()
    console.log(`\n📊 Total Transactions Loaded: ${allTxns.length}`)

    // Category trackers
    const withCompleteData = []
    const missingState = []
    const missingClient = []
    const missingSite = []
    const missingMultiple = []
    const completelyEmpty = []

    // Filter results (if periodData provided)
    const passedAllFilters = []
    const failedDateFilter = []
    const failedStateFilter = []
    const failedClientFilter = []

    // Analyze each transaction
    allTxns.forEach((txn, index) => {
      const hasState = !!(txn.state || '').trim()
      const hasClient = !!(txn.customer || txn.clientName || txn.client || txn.clientCode || '').trim()
      const hasSite = !!(txn.site || txn.siteName || '').trim()

      // Count missing fields
      const missingFields = []
      if (!hasState) missingFields.push('state')
      if (!hasClient) missingFields.push('client')
      if (!hasSite) missingFields.push('site')

      // Categorize by completeness
      if (missingFields.length === 0) {
        withCompleteData.push({ index, txn, field: 'complete' })
      } else if (missingFields.length === 3) {
        completelyEmpty.push({ index, txn, missing: missingFields })
      } else if (missingFields.length > 1) {
        missingMultiple.push({ index, txn, missing: missingFields })
      } else {
        if (!hasState) missingState.push({ index, txn })
        if (!hasClient) missingClient.push({ index, txn })
        if (!hasSite) missingSite.push({ index, txn })
      }

      // Apply filters if period data provided
      if (periodData && periodData.month && periodData.year) {
        const month = parseInt(periodData.month, 10)
        const year = parseInt(periodData.year, 10)
        const clientFilter = periodData.clientName || 'All'
        const stateFilter = periodData.stateName || 'All'

        const txDate = parseTransactionDate(txn.date)
        const passedDate = isInMonth(txDate, year, month)

        if (!passedDate) {
          failedDateFilter.push({ index, txn, date: txn.date, parsedDate: txDate })
        } else {
          const passedClient = passesClientFilter(txn, clientFilter)
          if (!passedClient) {
            failedClientFilter.push({
              index,
              txn,
              clientFilter,
              txnClient: txn.customer || txn.clientName || txn.client
            })
          } else {
            const passedState = passesStateFilter(txn, stateFilter)
            if (!passedState) {
              failedStateFilter.push({
                index,
                txn,
                stateFilter,
                txnState: txn.state
              })
            } else {
              passedAllFilters.push({ index, txn })
            }
          }
        }
      }
    })

    // ========== CONSOLE OUTPUT ==========

    console.log('\n' + '='.repeat(80))
    console.log('📋 DATA COMPLETENESS SUMMARY')
    console.log('='.repeat(80))
    console.log(`✅ Transactions with COMPLETE data (State + Client + Site): ${withCompleteData.length}`)
    console.log(`⚠️  Transactions missing STATE only: ${missingState.length}`)
    console.log(`⚠️  Transactions missing CLIENT only: ${missingClient.length}`)
    console.log(`⚠️  Transactions missing SITE only: ${missingSite.length}`)
    console.log(`❌ Transactions missing MULTIPLE fields: ${missingMultiple.length}`)
    console.log(`🚫 Transactions with NO data (State, Client, Site all missing): ${completelyEmpty.length}`)

    // Show complete data transactions
    if (withCompleteData.length > 0) {
      console.group('\n✅ TRANSACTIONS WITH COMPLETE DATA')
      console.table(withCompleteData.slice(0, 20).map(({ index, txn }) => ({
        Index: index,
        ID: txn.id || 'N/A',
        Date: txn.date,
        State: txn.state,
        Client: txn.customer || txn.clientName || 'N/A',
        Site: txn.site || txn.siteName || 'N/A',
        Description: txn.description || 'N/A'
      })))
      if (withCompleteData.length > 20) {
        console.log(`... and ${withCompleteData.length - 20} more`)
      }
      console.groupEnd()
    }

    // Show missing state
    if (missingState.length > 0) {
      console.group('\n⚠️  TRANSACTIONS MISSING STATE')
      console.table(missingState.slice(0, 20).map(({ index, txn }) => ({
        Index: index,
        ID: txn.id || 'N/A',
        Date: txn.date,
        State: '❌ MISSING',
        Client: txn.customer || txn.clientName || 'N/A',
        Site: txn.site || txn.siteName || 'N/A'
      })))
      if (missingState.length > 20) {
        console.log(`... and ${missingState.length - 20} more`)
      }
      console.groupEnd()
    }

    // Show missing client
    if (missingClient.length > 0) {
      console.group('\n⚠️  TRANSACTIONS MISSING CLIENT')
      console.table(missingClient.slice(0, 20).map(({ index, txn }) => ({
        Index: index,
        ID: txn.id || 'N/A',
        Date: txn.date,
        State: txn.state || 'N/A',
        Client: '❌ MISSING',
        Site: txn.site || txn.siteName || 'N/A'
      })))
      if (missingClient.length > 20) {
        console.log(`... and ${missingClient.length - 20} more`)
      }
      console.groupEnd()
    }

    // Show missing site
    if (missingSite.length > 0) {
      console.group('\n⚠️  TRANSACTIONS MISSING SITE')
      console.table(missingSite.slice(0, 20).map(({ index, txn }) => ({
        Index: index,
        ID: txn.id || 'N/A',
        Date: txn.date,
        State: txn.state || 'N/A',
        Client: txn.customer || txn.clientName || 'N/A',
        Site: '❌ MISSING'
      })))
      if (missingSite.length > 20) {
        console.log(`... and ${missingSite.length - 20} more`)
      }
      console.groupEnd()
    }

    // Show missing multiple
    if (missingMultiple.length > 0) {
      console.group('\n❌ TRANSACTIONS MISSING MULTIPLE FIELDS')
      console.table(missingMultiple.slice(0, 20).map(({ index, txn, missing }) => ({
        Index: index,
        ID: txn.id || 'N/A',
        Date: txn.date,
        MissingFields: missing.join(', '),
        State: txn.state || '❌',
        Client: txn.customer || txn.clientName || '❌',
        Site: txn.site || txn.siteName || '❌'
      })))
      if (missingMultiple.length > 20) {
        console.log(`... and ${missingMultiple.length - 20} more`)
      }
      console.groupEnd()
    }

    // Show completely empty
    if (completelyEmpty.length > 0) {
      console.group('\n🚫 TRANSACTIONS WITH NO DATA (State, Client, Site all missing)')
      console.table(completelyEmpty.slice(0, 20).map(({ index, txn }) => ({
        Index: index,
        ID: txn.id || 'N/A',
        Date: txn.date,
        Description: txn.description || 'N/A',
        Narration: txn.narration || 'N/A'
      })))
      if (completelyEmpty.length > 20) {
        console.log(`... and ${completelyEmpty.length - 20} more`)
      }
      console.groupEnd()
    }

    // ========== FILTER RESULTS (if periodData provided) ==========
    if (periodData && periodData.month && periodData.year) {
      console.log('\n' + '='.repeat(80))
      console.log('🔎 FILTER RESULTS')
      console.log('='.repeat(80))
      const month = parseInt(periodData.month, 10)
      const year = parseInt(periodData.year, 10)
      const clientFilter = periodData.clientName || 'All'
      const stateFilter = periodData.stateName || 'All'

      console.log(`📅 Period Filter: Month ${month}/${year}`)
      console.log(`🏢 Client Filter: ${clientFilter}`)
      console.log(`📍 State Filter: ${stateFilter}`)
      console.log('')
      console.log(`✅ Passed ALL filters: ${passedAllFilters.length}`)
      console.log(`❌ Failed DATE filter: ${failedDateFilter.length}`)
      console.log(`❌ Failed STATE filter: ${failedStateFilter.length}`)
      console.log(`❌ Failed CLIENT filter: ${failedClientFilter.length}`)

      if (passedAllFilters.length > 0) {
        console.group('\n✅ TRANSACTIONS PASSED ALL FILTERS')
        console.table(passedAllFilters.slice(0, 20).map(({ index, txn }) => ({
          Index: index,
          ID: txn.id || 'N/A',
          Date: txn.date,
          State: txn.state || 'N/A',
          Client: txn.customer || txn.clientName || 'N/A',
          Site: txn.site || txn.siteName || 'N/A'
        })))
        if (passedAllFilters.length > 20) {
          console.log(`... and ${passedAllFilters.length - 20} more`)
        }
        console.groupEnd()
      }

      if (failedDateFilter.length > 0 && failedDateFilter.length <= 50) {
        console.group('\n❌ TRANSACTIONS FAILED DATE FILTER')
        console.table(failedDateFilter.slice(0, 20).map(({ index, txn, date, parsedDate }) => ({
          Index: index,
          ID: txn.id || 'N/A',
          Date: date,
          ParsedDate: parsedDate ? parsedDate.toISOString().split('T')[0] : 'Invalid',
          ExpectedMonth: month,
          ExpectedYear: year
        })))
        if (failedDateFilter.length > 20) {
          console.log(`... and ${failedDateFilter.length - 20} more`)
        }
        console.groupEnd()
      }

      if (failedStateFilter.length > 0) {
        console.group('\n❌ TRANSACTIONS FAILED STATE FILTER')
        console.table(failedStateFilter.slice(0, 20).map(({ index, txn, stateFilter, txnState }) => ({
          Index: index,
          ID: txn.id || 'N/A',
          Date: txn.date,
          ExpectedState: stateFilter,
          ActualState: txnState || '❌ MISSING',
          Client: txn.customer || txn.clientName || 'N/A'
        })))
        if (failedStateFilter.length > 20) {
          console.log(`... and ${failedStateFilter.length - 20} more`)
        }
        console.groupEnd()
      }

      if (failedClientFilter.length > 0) {
        console.group('\n❌ TRANSACTIONS FAILED CLIENT FILTER')
        console.table(failedClientFilter.slice(0, 20).map(({ index, txn, clientFilter, txnClient }) => ({
          Index: index,
          ID: txn.id || 'N/A',
          Date: txn.date,
          ExpectedClient: clientFilter,
          ActualClient: txnClient || '❌ MISSING',
          State: txn.state || 'N/A'
        })))
        if (failedClientFilter.length > 20) {
          console.log(`... and ${failedClientFilter.length - 20} more`)
        }
        console.groupEnd()
      }
    }

    console.log('\n' + '='.repeat(80))
    console.groupEnd()

    // Return summary object
    return {
      total: allTxns.length,
      completeness: {
        withCompleteData: withCompleteData.length,
        missingState: missingState.length,
        missingClient: missingClient.length,
        missingSite: missingSite.length,
        missingMultiple: missingMultiple.length,
        completelyEmpty: completelyEmpty.length
      },
      filterResults: periodData ? {
        passedAllFilters: passedAllFilters.length,
        failedDateFilter: failedDateFilter.length,
        failedStateFilter: failedStateFilter.length,
        failedClientFilter: failedClientFilter.length
      } : null,
      transactions: {
        withCompleteData,
        missingState,
        missingClient,
        missingSite,
        missingMultiple,
        completelyEmpty,
        passedAllFilters,
        failedDateFilter,
        failedStateFilter,
        failedClientFilter
      }
    }
  } catch (e) {
    console.error('PLReportDataService: analyzeTransactionData error', e)
    return null
  }
}

/**
 * Debug helper: dump all transactions from localStorage to console.
 * Option: { limit: number } to limit output (helps when many transactions exist).
 */
export function dumpAllTransactionsToConsole(options = {}) {
  try {
    const txns = loadTransactions()
    const limit = typeof options.limit === 'number' && options.limit > 0 ? options.limit : txns.length
    console.log('[PLReportDataService] dumpAllTransactionsToConsole: total transactions =', txns.length)
    if (txns.length === 0) return txns
    for (let i = 0; i < Math.min(limit, txns.length); i++) {
      console.log(`[PLReportDataService] txn[${i}]`, txns[i])
    }
    if (limit < txns.length) console.log(`[PLReportDataService] ...and ${txns.length - limit} more transactions`)
    return txns
  } catch (e) {
    console.error('PLReportDataService: dumpAllTransactionsToConsole error', e)
    return []
  }
}
