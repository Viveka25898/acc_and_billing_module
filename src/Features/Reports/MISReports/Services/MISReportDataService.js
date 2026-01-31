/**
 * MIS Report Data Service
 * Handles data fetching and processing for MIS reports
 * Provides data for all 7 MIS report types
 */

/**
 * MIS Report Keys
 */
export const MIS_REPORT_KEYS = {
    MIS_SUMMARY_ACTUAL: 'mis_summary_actual',
    COMPARISON: 'comparison',
    BO_COST: 'bo_cost',
    TB_24_25: 'tb_24_25',
    REV_SUM: 'rev_sum',
    PPH: 'pph',
    BO_COST_DETAILS: 'bo_cost_details'
}

/**
 * Load transactions from localStorage
 * @returns {Array} Array of transactions
 */
const loadTransactions = () => {
    try {
        const data = localStorage.getItem('transactions')
        if (!data) {
            console.warn('MISReportDataService: No transactions found in localStorage')
            return []
        }
        return JSON.parse(data)
    } catch (err) {
        console.error('MISReportDataService: loadTransactions error', err)
        return []
    }
}

/**
 * Parse transaction date
 * @param {string|Date} dateInput 
 * @returns {Date|null}
 */
const parseTransactionDate = (dateInput) => {
    try {
        if (!dateInput) return null
        if (dateInput instanceof Date) return dateInput

        const str = String(dateInput).trim()

        // Try YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
            const [y, m, d] = str.split('-').map(Number)
            return new Date(y, m - 1, d)
        }

        // Try DD-MM-YYYY or DD-MM-YY format
        if (/^\d{2}-\d{2}-\d{2,4}$/.test(str)) {
            const [d, m, y] = str.split('-').map(Number)
            const year = y < 100 ? 2000 + y : y
            return new Date(year, m - 1, d)
        }

        return null
    } catch (err) {
        console.error('MISReportDataService: parseTransactionDate error', err)
        return null
    }
}

/**
 * Check if transaction is in specified month and year
 * @param {Date|null} txDate 
 * @param {number} year 
 * @param {number} month (1-12)
 * @returns {boolean}
 */
const isInMonth = (txDate, year, month) => {
    if (!txDate) return false
    return txDate.getFullYear() === year && txDate.getMonth() === month - 1
}

/**
 * Filter transactions by period data
 * @param {Array} transactions 
 * @param {Object} periodData - { month, year, clientName, stateName }
 * @returns {Array}
 */
const filterTransactionsByPeriod = (transactions, periodData) => {
    try {
        const { month, year, clientName, stateName } = periodData

        return transactions.filter(txn => {
            // Date filter
            const txDate = parseTransactionDate(txn.date)
            if (!isInMonth(txDate, year, month)) return false

            // Client filter
            if (clientName && clientName !== 'All') {
                const txClient = txn.client || txn.clientName || ''
                if (!txClient.toLowerCase().includes(clientName.toLowerCase())) {
                    return false
                }
            }

            // State filter
            if (stateName && stateName !== 'All') {
                const txState = txn.state || txn.stateName || ''
                if (!txState.toLowerCase().includes(stateName.toLowerCase())) {
                    return false
                }
            }

            return true
        })
    } catch (err) {
        console.error('MISReportDataService: filterTransactionsByPeriod error', err)
        return []
    }
}

/**
 * Get MIS Summary Actual data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getMISSummaryActual = (periodData) => {
    try {
        const transactions = loadTransactions()
        const filtered = filterTransactionsByPeriod(transactions, periodData)

        // TODO: Implement actual MIS Summary calculation logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.MIS_SUMMARY_ACTUAL,
            periodData,
            data: {
                totalRevenue: 0,
                totalExpense: 0,
                netProfit: 0,
                transactionCount: filtered.length
            },
            meta: {
                generatedAt: new Date().toISOString(),
                transactionCount: filtered.length
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getMISSummaryActual error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate MIS Summary Actual'
        }
    }
}

/**
 * Get Comparison data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getComparison = (periodData) => {
    try {
        const transactions = loadTransactions()
        const currentFiltered = filterTransactionsByPeriod(transactions, periodData)

        // Get previous month data
        const prevMonth = periodData.month === 1 ? 12 : periodData.month - 1
        const prevYear = periodData.month === 1 ? periodData.year - 1 : periodData.year
        const prevPeriodData = { ...periodData, month: prevMonth, year: prevYear }
        const prevFiltered = filterTransactionsByPeriod(transactions, prevPeriodData)

        // TODO: Implement actual comparison logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.COMPARISON,
            periodData,
            data: {
                current: {
                    transactionCount: currentFiltered.length
                },
                previous: {
                    transactionCount: prevFiltered.length
                }
            },
            meta: {
                generatedAt: new Date().toISOString()
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getComparison error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate Comparison report'
        }
    }
}

/**
 * Get BO Cost data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getBOCost = (periodData) => {
    try {
        const transactions = loadTransactions()
        const filtered = filterTransactionsByPeriod(transactions, periodData)

        // TODO: Implement actual BO Cost calculation logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.BO_COST,
            periodData,
            data: {
                totalBOCost: 0,
                transactionCount: filtered.length
            },
            meta: {
                generatedAt: new Date().toISOString()
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getBOCost error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate BO Cost report'
        }
    }
}

/**
 * Get TB 24-25 data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getTB2425 = (periodData) => {
    try {
        const transactions = loadTransactions()
        const filtered = filterTransactionsByPeriod(transactions, periodData)

        // TODO: Implement actual Trial Balance logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.TB_24_25,
            periodData,
            data: {
                debitTotal: 0,
                creditTotal: 0,
                transactionCount: filtered.length
            },
            meta: {
                generatedAt: new Date().toISOString()
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getTB2425 error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate TB 24-25 report'
        }
    }
}

/**
 * Get Revenue Summary data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getRevSum = (periodData) => {
    try {
        const transactions = loadTransactions()
        const filtered = filterTransactionsByPeriod(transactions, periodData)

        // TODO: Implement actual Revenue Summary logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.REV_SUM,
            periodData,
            data: {
                totalRevenue: 0,
                transactionCount: filtered.length
            },
            meta: {
                generatedAt: new Date().toISOString()
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getRevSum error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate Revenue Summary report'
        }
    }
}

/**
 * Get PPH (Per Person Hour) data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getPPH = (periodData) => {
    try {
        const transactions = loadTransactions()
        const filtered = filterTransactionsByPeriod(transactions, periodData)

        // TODO: Implement actual PPH calculation logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.PPH,
            periodData,
            data: {
                totalHours: 0,
                totalPersons: 0,
                pph: 0,
                transactionCount: filtered.length
            },
            meta: {
                generatedAt: new Date().toISOString()
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getPPH error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate PPH report'
        }
    }
}

/**
 * Get BO Cost Details data
 * @param {Object} periodData 
 * @returns {Object}
 */
const getBOCostDetails = (periodData) => {
    try {
        const transactions = loadTransactions()
        const filtered = filterTransactionsByPeriod(transactions, periodData)

        // TODO: Implement actual BO Cost Details logic
        return {
            success: true,
            reportType: MIS_REPORT_KEYS.BO_COST_DETAILS,
            periodData,
            data: {
                costBreakdown: {},
                totalBOCost: 0,
                transactionCount: filtered.length
            },
            meta: {
                generatedAt: new Date().toISOString()
            }
        }
    } catch (err) {
        console.error('MISReportDataService: getBOCostDetails error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate BO Cost Details report'
        }
    }
}

/**
 * Get MIS Report Data based on report key
 * @param {string} reportKey 
 * @param {Object} periodData 
 * @returns {Object}
 */
export const getMISReportData = (reportKey, periodData) => {
    try {
        switch (reportKey) {
            case MIS_REPORT_KEYS.MIS_SUMMARY_ACTUAL:
                return getMISSummaryActual(periodData)
            case MIS_REPORT_KEYS.COMPARISON:
                return getComparison(periodData)
            case MIS_REPORT_KEYS.BO_COST:
                return getBOCost(periodData)
            case MIS_REPORT_KEYS.TB_24_25:
                return getTB2425(periodData)
            case MIS_REPORT_KEYS.REV_SUM:
                return getRevSum(periodData)
            case MIS_REPORT_KEYS.PPH:
                return getPPH(periodData)
            case MIS_REPORT_KEYS.BO_COST_DETAILS:
                return getBOCostDetails(periodData)
            default:
                throw new Error(`Unknown report key: ${reportKey}`)
        }
    } catch (err) {
        console.error('MISReportDataService: getMISReportData error', err)
        return {
            success: false,
            error: err.message || 'Failed to generate MIS report'
        }
    }
}

export default {
    getMISReportData,
    MIS_REPORT_KEYS,
    loadTransactions,
    filterTransactionsByPeriod
}
