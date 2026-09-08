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
 * Helper to extract Batch ID from uploaded file name.
 * Example: 'System_Payment_BATCH-V-20260902-063534.xlsx' -> 'BATCH-V-20260902-063534'
 */
export const extractBatchIdFromFileName = (fileName = '') => {
  if (!fileName) return ''
  const match =
    fileName.match(/(BATCH-[A-Z0-9]+-\d{8}-\d{6})/i) ||
    fileName.match(/(BATCH-[A-Z0-9-]+)/i)
  if (match && match[1]) {
    return match[1].replace(/[\._]+$/, '')
  }
  return ''
}

/**
 * Upload vendor system payment Excel file to backend API.
 * Endpoint: POST /accounts/payments/vendor/upload-payment-file
 * 
 * @param {File} file Binary file object selected by user
 * @param {string} [batchId] Optional batch ID parameter
 * @returns {Promise<Object>} API response payload containing parsedData and bankAccounts
 */
export const uploadVendorSystemPaymentFile = async (file, batchId = '') => {
  const formData = new FormData()
  formData.append('file', file)

  // 1. Check explicit batchId passed from state
  // 2. Extract batchId from file name if state is empty (e.g. System_Payment_BATCH-V-20260902-063534.xlsx)
  const extractedBatchId = extractBatchIdFromFileName(file?.name)
  const effectiveBatchId = batchId || extractedBatchId

  if (!effectiveBatchId) {
    throw new Error(
      'Batch ID not found. Please ensure the uploaded file name contains the Batch ID (e.g. System_Payment_BATCH-V-20260902-063534.xlsx).'
    )
  }

  formData.append('batch_id', effectiveBatchId)

  const url = `/accounts/payments/vendor/upload-payment-file?batch_id=${encodeURIComponent(effectiveBatchId)}`

  const response = await axiosInstance.post(url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
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

  const fetchBlob = async (path) => {
    return await axiosInstance.get(path, { responseType: 'blob' })
  }

  let response
  try {
    response = await fetchBlob(relativePath)
  } catch (primaryErr) {
    if (primaryErr.response?.status === 404 && relativePath.includes('/accounts/payments/vendor/download/')) {
      const altPath = relativePath.replace('/accounts/payments/vendor/download/', '/accounts/vendor/payments/download/')
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

/**
 * Process vendor payment GL posting.
 * Endpoint: POST /accounts/payments/vendor/process-payment
 * 
 * @param {Object} payload Payload containing batchId, selectedBankCode, paymentData
 * @returns {Promise<Object>} API response payload
 */
export const processVendorPaymentGLPosting = async (payload) => {
  const response = await axiosInstance.post('/accounts/payments/vendor/process-payment', payload)
  return response.data
}

