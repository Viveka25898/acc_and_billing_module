import axiosInstance from '../../../api/axiosInstance'

/**
 * Fetch pending conveyance payment requests from backend API.
 * Endpoint: GET /accounts/conveyance/payment/pending
 * 
 * @param {Object} params Query parameters (page, pageSize, employeeName, department, etc.)
 * @returns {Promise<Object>} API response payload
 */
export const fetchPendingConveyancePayments = async (params = {}) => {
  const response = await axiosInstance.get('/accounts/conveyance/payment/pending', { params })
  return response.data
}

/**
 * Generate conveyance payment files (Bank & System Excel templates).
 * Endpoint: POST /accounts/payments/conveyance/generate-payment-files
 * 
 * @param {Array<string>} selections Array of selected voucher numbers or IDs
 * @returns {Promise<Object>} API response containing batchId and download URLs
 */
export const generateConveyancePaymentFiles = async (payload) => {
  const response = await axiosInstance.post('/accounts/payments/conveyance/generate-payment-files', payload)
  return response.data
}

/**
 * Helper to extract Batch ID from uploaded file name.
 * Example: 'System_Payment_BATCH-C-20260902-063534.xlsx' -> 'BATCH-C-20260902-063534'
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
 * Upload conveyance system payment Excel file to backend API.
 * Endpoint: POST /accounts/payments/conveyance/upload-payment-file
 * 
 * @param {File} file Binary file object selected by user
 * @param {string} [batchId] Optional batch ID parameter
 * @returns {Promise<Object>} API response payload containing parsedData and bankAccounts
 */
export const uploadConveyanceSystemPaymentFile = async (file, batchId = '') => {
  const formData = new FormData()
  formData.append('paymentFile', file)
  formData.append('file', file)

  const extractedBatchId = extractBatchIdFromFileName(file?.name)
  const effectiveBatchId = batchId || extractedBatchId

  if (!effectiveBatchId) {
    throw new Error(
      'Batch ID not found. Please ensure the uploaded file name contains the Batch ID (e.g. System_Payment_BATCH-C-20260902-063534.xlsx).'
    )
  }

  formData.append('batch_id', effectiveBatchId)

  const url = `/accounts/payments/conveyance/upload-payment-file?batch_id=${encodeURIComponent(effectiveBatchId)}`

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
export const downloadConveyanceFileBlob = async (fileUrl, filename) => {
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
    // Fallback: If route /accounts/payments/conveyance/download returns 404, try /accounts/conveyance/payment/download
    if (primaryErr.response?.status === 404 && relativePath.includes('/accounts/payments/conveyance/download/')) {
      const altPath = relativePath.replace('/accounts/payments/conveyance/download/', '/accounts/conveyance/payment/download/')
      try {
        response = await fetchBlob(altPath)
      } catch (fallbackErr) {
        throw primaryErr
      }
    } else {
      throw primaryErr
    }
  }

  // Parse Blob if Backend returned a JSON error (e.g. 404 or 400 detail)
  const contentType = response.headers['content-type'] || ''
  if (contentType.includes('application/json')) {
    const text = await response.data.text()
    try {
      const json = JSON.parse(text)
      throw new Error(json.message || json.detail || 'Download failed on backend server')
    } catch (pErr) {
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
 * Process conveyance payment GL posting.
 * Endpoint: POST /accounts/payments/conveyance/process-payment
 * 
 * @param {Object} payload Payload containing batchId, selectedBankCode, paymentData
 * @returns {Promise<Object>} API response payload
 */
export const processConveyancePaymentGLPosting = async (payload) => {
  const response = await axiosInstance.post('/accounts/payments/conveyance/process-payment', payload)
  return response.data
}

