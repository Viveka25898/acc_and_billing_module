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
