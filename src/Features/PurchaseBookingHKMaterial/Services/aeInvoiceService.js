import axiosInstance from '../../../api/axiosInstance';

/**
 * Fetch all pending invoices for AE verification.
 * Supports filtering parameters: invoiceNumber, vendorName, date, page, limit.
 */
export const fetchAEPending = async (params = {}) => {
  const response = await axiosInstance.get('/accounts/invoices/ae/pending', { params });
  return response.data;
};

/**
 * Submit AE decision (Approve or Reject).
 */
export const submitAEDecision = async (invoiceId, payload) => {
  const response = await axiosInstance.post(`/accounts/invoices/${invoiceId}/ae-decision`, payload);
  return response.data;
};
