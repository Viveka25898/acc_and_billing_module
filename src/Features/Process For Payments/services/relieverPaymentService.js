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
