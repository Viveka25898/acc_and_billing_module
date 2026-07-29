import axiosInstance from '../../../api/axiosInstance';

/**
 * Fetch Account Manager Pending Invoices queue.
 * Supports filtering parameters: invoiceNumber, vendorName, date, page, limit.
 */
export const fetchAMPending = async (params = {}) => {
  const response = await axiosInstance.get('/accounts/invoices/am/pending', { params });
  return response.data;
};

/**
 * Submit AM decision (Approve or Reject).
 */
export const submitAMDecision = async (invoiceId, payload) => {
  const response = await axiosInstance.post(`/accounts/invoices/${invoiceId}/am-decision`, payload);
  return response.data;
};

/**
 * Fetch purchase voucher details.
 */
export const fetchPurchaseVoucher = async (invoiceId) => {
  const response = await axiosInstance.get(`/accounts/invoices/${invoiceId}/purchase-voucher`);
  return response.data;
};
