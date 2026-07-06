import axiosInstance from '../../../api/axiosInstance'

const BASE_URL = '/account-master/accounts'

/**
 * Fetches the paginated list of accounts for a specific parent code.
 * If parentCode is empty/null, it returns the root-level accounts.
 *
 * @param {Object} params - Query parameters
 * @param {string} params.parentCode - Parent account code
 * @param {number} params.page - Page number
 * @param {number} params.limit - Limit of items per request
 * @returns {Promise<Object>} API response payload
 */
export const fetchAccountsByParentCode = async ({ parentCode = '', page = 1, limit = 100 } = {}) => {
  const params = {
    page,
    limit,
    includeInactive: false,
    sortBy: 'code',
    sortOrder: 'desc',
  }

  // Pass parentCode only if it is explicitly provided
  if (parentCode) {
    params.parentCode = parentCode
  } else {
    // Top-root categories are requested by passing empty string or undefined
    params.parentCode = ''
  }

  const res = await axiosInstance.get(BASE_URL, { params })
  
  // The API returns response structure like: { success: true, results: { items: [], ... } }
  return res.data?.results || res.data || {}
}

/**
 * Fetches chart of accounts summary statistics.
 * Endpoint: GET /accounts/summary
 *
 * @returns {Promise<Object>} API response payload
 */
export const fetchAccountsSummary = async () => {
  const res = await axiosInstance.get(`${BASE_URL}/summary`)
  return res.data?.results || res.data || {}
}

/**
 * Fetches available account types from the backend.
 * Endpoint: GET /account-master/accounts/types
 */
export const fetchAccountTypes = async () => {
  const res = await axiosInstance.get(`${BASE_URL}/types`)
  return res.data?.results || res.data || []
}

/**
 * Previews the generated code for a new account.
 * Endpoint: GET /account-master/accounts/generate-code
 */
export const generateAccountCode = async (parentCode, type) => {
  const params = { type }
  if (parentCode) {
    params.parentCode = parentCode
  }
  const res = await axiosInstance.get(`${BASE_URL}/generate-code`, { params })
  return res.data?.results || res.data || {}
}

/**
 * Creates a new account category or ledger in the backend.
 * Endpoint: POST /account-master/accounts
 */
export const createAccount = async (accountData) => {
  const res = await axiosInstance.post(BASE_URL, accountData)
  return res.data?.results || res.data || {}
}

/**
 * Fetches all accounts (without parentCode filtering) with a large limit.
 * Endpoint: GET /account-master/accounts
 */
export const fetchAllAccounts = async ({ page = 1, limit = 200 } = {}) => {
  const params = {
    page,
    limit,
    includeInactive: false,
    sortBy: 'code',
    sortOrder: 'asc'
  }
  const res = await axiosInstance.get(BASE_URL, { params })
  return res.data?.results || res.data || {}
}

/**
 * Updates an existing account's editable details.
 * Endpoint: PUT /account-master/accounts/{id}
 */
export const updateAccount = async (id, updateData) => {
  const res = await axiosInstance.put(`${BASE_URL}/${id}`, updateData)
  return res.data?.results || res.data || {}
}

/**
 * Deletes an account category or ledger.
 * Endpoint: DELETE /account-master/accounts/{id}
 */
export const deleteAccount = async (id) => {
  const res = await axiosInstance.delete(`${BASE_URL}/${id}`)
  return res.data?.results || res.data || {}
}
