import axiosInstance from '../../../api/axiosInstance'


export const fetchPendingVendorPayments = async (params = {}) => {
  const response = await axiosInstance.get('/accounts/payments/vendor/pending-invoices', { params })
  return response.data
}
