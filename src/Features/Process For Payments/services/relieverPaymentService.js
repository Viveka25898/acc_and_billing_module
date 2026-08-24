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

  const fetchBlob = async (path) => {
    return await axiosInstance.get(path, { responseType: 'blob' })
  }

  let response
  try {
    response = await fetchBlob(relativePath)
  } catch (primaryErr) {
    if (primaryErr.response?.status === 404 && relativePath.includes('/accounts/payments/reliever/download/')) {
      const altPath = relativePath.replace('/accounts/payments/reliever/download/', '/accounts/reliever/payments/download/')
      try {
        response = await fetchBlob(altPath)
      } catch {
        throw primaryErr
      }
    } else {
      throw primaryErr
    }
  }

  const contentType = response.headers['content-type'] || ''
  if (contentType.includes('application/json')) {
    const text = await response.data.text()
    try {
      const json = JSON.parse(text)
      throw new Error(json.message || json.detail || 'Download failed on backend server')
    } catch {
      throw new Error(text || 'Download failed on backend server')
    }
  }

  const blob = new Blob([response.data], {
    type: contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
