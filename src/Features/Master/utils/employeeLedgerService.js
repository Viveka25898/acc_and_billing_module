import axiosInstance from '../../../api/axiosInstance'

export class EmployeeLedgerService {
  /**
   * Get employee details for header
   * Endpoint: GET /account-master/ledger/employee-advances/{employeeGl}/header
   *
   * @param {string} employeeGl - Employee GL account code
   * @returns {Promise<Object>} Employee metadata details
   */
  static async getEmployeeHeader(employeeGl) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/employee-advances/${employeeGl}/header`)
      return res.data?.results || res.data || null
    } catch (error) {
      console.error(`❌ Error in getEmployeeHeader for ${employeeGl}:`, error)
      throw error
    }
  }

  /**
   * Get paginated and filtered transactions for an employee advance account
   * Endpoint: GET /account-master/ledger/employee-advances/{employeeGl}/entries
   *
   * @param {string} employeeGl - Employee GL account code
   * @param {Object} params - Query filters (page, limit, fromDate, toDate, entryType, status, search)
   * @returns {Promise<Object>} List of entries and pagination metadata
   */
  static async getEmployeeEntries(employeeGl, params = {}) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/employee-advances/${employeeGl}/entries`, { params })
      return res.data?.results || res.data || { entries: [], pagination: {} }
    } catch (error) {
      console.error(`❌ Error in getEmployeeEntries for ${employeeGl}:`, error)
      throw error
    }
  }

  /**
   * Get total debit, total credit and closing balance summary
   * Endpoint: GET /account-master/ledger/employee-advances/{employeeGl}/footer
   *
   * @param {string} employeeGl - Employee GL account code
   * @param {Object} params - Date filters (fromDate, toDate)
   * @returns {Promise<Object>} Debit, credit and balance totals
   */
  static async getEmployeeSummary(employeeGl, params = {}) {
    try {
      const res = await axiosInstance.get(`/account-master/ledger/employee-advances/${employeeGl}/footer`, { params })
      return res.data?.results || res.data || null
    } catch (error) {
      console.error(`❌ Error in getEmployeeSummary for ${employeeGl}:`, error)
      throw error
    }
  }
}
