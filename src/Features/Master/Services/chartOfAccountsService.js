import axiosInstance from '../../../api/axiosInstance'
import { INITIAL_CHART_OF_ACCOUNTS } from '../../../data/ChartOfAccounts'

const BASE_URL = '/account-master/accounts'

/**
 * Fetches the paginated list of accounts for a specific parent code.
 * If parentCode is empty/null, it returns the root-level accounts.
 * Merges backend API response with local chart of accounts to ensure no root accounts (e.g. X) are missing.
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
    sortOrder: 'asc',
  }

  // Pass parentCode only if it is explicitly provided
  if (parentCode) {
    params.parentCode = parentCode
  } else {
    // Top-root categories are requested by passing empty string or undefined
    params.parentCode = ''
  }

  let apiItems = []
  let apiData = {}

  try {
    const res = await axiosInstance.get(BASE_URL, { params })
    apiData = res.data?.results || res.data || {}
    const rawItems = apiData.items || (Array.isArray(apiData) ? apiData : [])
    apiItems = Array.isArray(rawItems) ? rawItems : []
  } catch (err) {
    console.warn(`⚠️ API call to ${BASE_URL} failed for parentCode "${parentCode}":`, err)
  }

  // Retrieve local chart of accounts (or fallback to INITIAL_CHART_OF_ACCOUNTS)
  const localAccounts = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
  const sourceAccounts = localAccounts.length > 0 ? localAccounts : INITIAL_CHART_OF_ACCOUNTS

  // Filter local source accounts for matching parentCode
  const matchingLocalItems = sourceAccounts.filter((acc) => {
    if (!parentCode || parentCode === '') {
      return !acc.parentCode || acc.parentCode === '' || acc.type === 'ROOT'
    }
    return acc.parentCode === parentCode
  })

  // Combine local and API items, prioritizing API data on code collision
  const itemMap = new Map()

  matchingLocalItems.forEach((item) => {
    if (item && item.code) {
      itemMap.set(item.code, item)
    }
  })

  apiItems.forEach((item) => {
    if (item && item.code) {
      const existing = itemMap.get(item.code) || {}
      itemMap.set(item.code, { ...existing, ...item })
    }
  })

  const mergedItems = Array.from(itemMap.values())

  return {
    items: mergedItems,
    currentPage: apiData.currentPage || page,
    totalPages: apiData.totalPages || 1,
    totalItems: Math.max(mergedItems.length, apiData.totalItems || 0),
  }
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
 * Endpoint: DELETE /account-master/accounts/{account_id}
 */
export const deleteAccount = async (id) => {
  const numericId = parseInt(id, 10)
  const isInteger = !isNaN(numericId) && String(numericId) === String(id).trim()

  if (isInteger) {
    const res = await axiosInstance.delete(`${BASE_URL}/${numericId}`)
    return res.data?.results || res.data || {}
  } else {
    console.warn(`⚠️ Account ID "${id}" is not a numeric backend integer ID. Deleting from local state.`)
    return { id }
  }
}
