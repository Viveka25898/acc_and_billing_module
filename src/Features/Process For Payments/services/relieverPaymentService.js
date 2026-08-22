import axiosInstance from '../../../api/axiosInstance'

/**
 * Fetch pending reliever payment requests from backend API.
 * Endpoint: GET /accounts/payments/reliever/pending-requests
 * 
 * @param {Object} params Query parameters (page, pageSize, employeeName, site, etc.)
 * @returns {Promise<Object>} API response payload
 */
export const fetchPendingRelieverRequests = async (params = {}) => {
  const response = await axiosInstance.get('/accounts/payments/reliever/pending-requests', { params })
  return response.data
}

/**
 * Generate reliever payment files (Bank & System Excel templates).
 * Endpoint: POST /accounts/payments/reliever/generate-payment-files
 * 
 * @param {Array<string>} selections Array of selected request IDs
 * @returns {Promise<Object>} API response containing batchId and download URLs
 */
export const generateRelieverPaymentFiles = async (selections = []) => {
  const response = await axiosInstance.post('/accounts/payments/reliever/generate-payment-files', {
    selections,
  })
  return response.data
}

/**
 * Helper to download an authenticated file blob from pre-signed backend URL.
 * 
 * @param {string} fileUrl Download URL returned by backend API
 * @param {string} filename Output filename for browser download
 */
export const downloadRelieverFileBlob = async (fileUrl, filename) => {
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
