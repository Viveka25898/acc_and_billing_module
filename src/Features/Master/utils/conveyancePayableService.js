import axiosInstance from '../../../api/axiosInstance'

/**
 * Helper to make GET requests with route fallback (/account-master/ledger/conveyance-payable vs /ledger/conveyance-payable)
 */
const getWithFallback = async (endpoints, config = {}) => {
  let lastError = null
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(endpoint, config)
      return response
    } catch (err) {
      lastError = err
      if (err.response && err.response.status === 404) {
        continue // Try next endpoint prefix
      }
      throw err
    }
  }
  throw lastError
}

/**
 * ConveyancePayableService
 * Service layer for Conveyance Payable Ledger (GL L2001001)
 */
export class ConveyancePayableService {
  /**
   * Fetch Header metadata for Conveyance Payable
   * Endpoint: GET /account-master/ledger/conveyance-payable/{glCode}/header
   *
   * @param {string} glCode GL Code (e.g. 'L2001001')
   * @returns {Promise<Object>} Formatted header data
   */
  static async getHeader(glCode = 'L2001001') {
    try {
      const endpoints = [
        `/account-master/ledger/conveyance-payable/${glCode}/header`,
        `/ledger/conveyance-payable/${glCode}/header`,
      ]

      const res = await getWithFallback(endpoints)
      const data = res.data?.results || res.data?.data || res.data || {}

      return {
        glCode: data.glCode || glCode,
        name: data.ledgerName || 'Conveyance payable',
        parentAccount: data.parentAccount || 'L2001',
        accountType: data.accountType || 'Liability',
        financialYear: data.financialYear || 'FY2024-25',
        openingBalance: data.openingBalance !== undefined && data.openingBalance !== null
          ? String(data.openingBalance)
          : '0.00',
        department: data.department || 'Finance',
        designation: data.designation || 'Shared Liability Account',
        period: data.period || '-',
        code: data.glCode || glCode,
        glAccount: data.glCode || glCode,
      }
    } catch (error) {
      console.error(`❌ Error in ConveyancePayableService.getHeader for ${glCode}:`, error)
      throw error
    }
  }

  /**
   * Fetch Paginated & Filtered Ledger Entries for Conveyance Payable
   * Endpoint: GET /account-master/ledger/conveyance-payable/{glCode}/entries
   *
   * @param {string} glCode GL Code
   * @param {Object} params Filter & Pagination Query Params
   * @returns {Promise<Object>} { entries, pagination }
   */
  static async getEntries(glCode = 'L2001001', params = {}) {
    try {
      const cleanParams = {}
      if (params.page) cleanParams.page = params.page
      if (params.limit) cleanParams.limit = params.limit
      if (params.fromDate && params.fromDate.trim()) cleanParams.fromDate = params.fromDate.trim()
      if (params.toDate && params.toDate.trim()) cleanParams.toDate = params.toDate.trim()
      if (params.entryType && params.entryType !== 'All') cleanParams.entryType = params.entryType
      if (params.status && params.status !== 'All') cleanParams.status = params.status
      if (params.search && params.search.trim()) cleanParams.search = params.search.trim()

      const endpoints = [
        `/account-master/ledger/conveyance-payable/${glCode}/entries`,
        `/ledger/conveyance-payable/${glCode}/entries`,
      ]

      const res = await getWithFallback(endpoints, { params: cleanParams })
      const results = res.data?.results || res.data?.data || res.data || {}
      const rawEntries = results.entries || (Array.isArray(results) ? results : [])

      const entries = rawEntries.map((txn, index) => {
        const debitNum = txn.debit !== null && txn.debit !== undefined ? parseFloat(txn.debit) : null
        const creditNum = txn.credit !== null && txn.credit !== undefined ? parseFloat(txn.credit) : null
        const balanceNum = txn.balance !== null && txn.balance !== undefined ? parseFloat(txn.balance) : 0

        // Format Date
        let formattedDate = '-'
        if (txn.date) {
          const d = new Date(txn.date)
          if (!isNaN(d.getTime())) {
            formattedDate = d.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: '2-digit',
            })
          } else {
            formattedDate = txn.date
          }
        }

        const isExpense = (txn.entryType || '').toLowerCase() === 'expense' || (creditNum !== null && creditNum > 0)

        return {
          id: txn.id || `entry_${index}`,
          date: formattedDate,
          rawDate: txn.date || '',
          voucherNo: txn.voucherNo || '-',
          voucherLink: txn.voucherLink || null,
          entryType: txn.entryType || (isExpense ? 'Expense' : 'Payment'),
          debit: debitNum,
          credit: creditNum,
          balance: Math.abs(balanceNum),
          balanceType: balanceNum === 0 ? 'zero' : balanceNum > 0 ? 'credit' : 'debit',
          narration: txn.narration || '-',
          claimId: txn.claimId || '-',
          visits: txn.visits !== undefined && txn.visits !== null ? txn.visits : (isExpense ? 1 : '-'),
          period: txn.period || '-',
          counterparty: txn.counterparty || '-',
          approvedBy: txn.approvedBy || '-',
          attachmentBundleUrl: txn.attachmentBundleUrl || null,
          hasAttachment: !!txn.attachmentBundleUrl,
          costCenter: txn.costCenter || '-',
          customer: txn.customer || '-',
          site: txn.site || '-',
          state: txn.state || '-',
          city: txn.city || '-',
          branch: txn.branch || '-',
          status: txn.status || 'Posted',
          rowClass: isExpense ? 'expense-row' : 'payment-row',
        }
      })

      const pagination = results.pagination || {
        page: params.page || 1,
        limit: params.limit || 20,
        totalItems: entries.length,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      }

      return { entries, pagination }
    } catch (error) {
      console.error(`❌ Error in ConveyancePayableService.getEntries for ${glCode}:`, error)
      throw error
    }
  }

  /**
   * Fetch Summary / Footer for Conveyance Payable
   * Endpoint: GET /account-master/ledger/conveyance-payable/{glCode}/footer
   *
   * @param {string} glCode GL Code
   * @param {Object} params Filter Query Params (fromDate, toDate)
   * @returns {Promise<Object>} Formatted footer numbers
   */
  static async getFooter(glCode = 'L2001001', params = {}) {
    try {
      const cleanParams = {}
      if (params.fromDate && params.fromDate.trim()) cleanParams.fromDate = params.fromDate.trim()
      if (params.toDate && params.toDate.trim()) cleanParams.toDate = params.toDate.trim()

      const endpoints = [
        `/account-master/ledger/conveyance-payable/${glCode}/footer`,
        `/ledger/conveyance-payable/${glCode}/footer`,
      ]

      const res = await getWithFallback(endpoints, { params: cleanParams })
      const data = res.data?.results || res.data?.data || res.data || {}

      return {
        totalPayments: parseFloat(data.totalPayments || 0),
        totalClaims: parseFloat(data.totalClaims || 0),
        totalVisits: parseInt(data.totalVisits || 0, 10),
        outstanding: parseFloat(data.closingOutstandingLiability || data.outstanding || 0),
      }
    } catch (error) {
      console.error(`❌ Error in ConveyancePayableService.getFooter for ${glCode}:`, error)
      throw error
    }
  }
}
