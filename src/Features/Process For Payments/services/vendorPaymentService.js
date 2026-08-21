import axiosInstance from '../../../api/axiosInstance'

/**
 * Fetch pending vendor invoices from backend API.
 * Endpoint: GET /accounts/payments/vendor/pending-invoices
 * 
 * @param {Object} params Query parameters (page, limit, search, etc.)
 * @returns {Promise<Object>} API response payload
 */
export const fetchPendingVendorPayments = async (params = {}) => {
  const response = await axiosInstance.get('/accounts/payments/vendor/pending-invoices', { params })
  return response.data
}

/**
 * Generate vendor payment files (Bank & System Excel templates).
 * Endpoint: POST /accounts/payments/vendor/generate-payment-files
 * 
 * @param {Object} payload Selections payload matching API contract
 * @returns {Promise<Object>} API response containing batchId and download URLs
 */
export const generateVendorPaymentFiles = async (payload) => {
  const response = await axiosInstance.post('/accounts/payments/vendor/generate-payment-files', payload)
  return response.data
}

/**
 * Helper to download an authenticated file blob from pre-signed backend URL.
 * 
 * @param {string} fileUrl Download URL returned by backend API
 * @param {string} filename Output filename for browser download
 */
export const downloadPaymentFileBlob = async (fileUrl, filename) => {
  let relativePath = fileUrl
  if (fileUrl.includes('/api/v1/')) {
    relativePath = fileUrl.substring(fileUrl.indexOf('/api/v1/') + 7)
  }

  const response = await axiosInstance.get(relativePath, { responseType: 'blob' })
  const contentType =
    response.headers['content-type'] ||
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  const blob = new Blob([response.data], { type: contentType })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
