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
