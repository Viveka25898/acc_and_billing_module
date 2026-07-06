import axiosInstance from '../../../api/axiosInstance'

export class BankLedgerService {
  /**
   * Get bank account details for header
   * Endpoint: GET /ledger/bank/{bankCode}/header
   *
   * @param {string} bankCode - Bank GL account code
   * @returns {Promise<Object>} Bank metadata details
   */
  static async getBankAccountDetails(bankCode) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/bank/${bankCode}/header`)
      return res.data?.results || res.data || null
    } catch (error) {
      console.error(`❌ Error in getBankAccountDetails for ${bankCode}:`, error)
      throw error
    }
  }

  /**
   * Get paginated and filtered transactions for a bank account
   * Endpoint: GET /ledger/bank/{bankCode}/entries
   *
   * @param {string} bankCode - Bank GL account code
   * @param {Object} params - Query filters (page, limit, fromDate, toDate, status)
   * @returns {Promise<Object>} List of entries and pagination metadata
   */
  static async getBankTransactions(bankCode, params = {}) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/bank/${bankCode}/entries`, { params })
      return res.data?.results || res.data || { entries: [], pagination: {} }
    } catch (error) {
      console.error(`❌ Error in getBankTransactions for ${bankCode}:`, error)
      throw error
    }
  }

  /**
   * Get total receipts, total payments and closing balance summary
   * Endpoint: GET /ledger/bank/{bankCode}/footer
   *
   * @param {string} bankCode - Bank GL account code
   * @param {Object} params - Date filters (fromDate, toDate)
   * @returns {Promise<Object>} Receipts, payments and balance totals
   */
  static async getBankSummary(bankCode, params = {}) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/bank/${bankCode}/footer`, { params })
      return res.data?.results || res.data || null
    } catch (error) {
      console.error(`❌ Error in getBankSummary for ${bankCode}:`, error)
      throw error
    }
  }
}