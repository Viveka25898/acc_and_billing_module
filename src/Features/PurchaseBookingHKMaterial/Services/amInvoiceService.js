import axiosInstance from '../../../api/axiosInstance';

/**
 * Fetch Account Manager Pending Invoices queue.
 * Supports filtering parameters: invoiceNumber, vendorName, date, page, limit.
 */
export const fetchAMPending = async (params = {}) => {
  // Frontend handles filtering; only pass pagination params if present
  const safeParams = {};
  if (params.page) safeParams.page = params.page;
  if (params.limit) {
    safeParams.limit = params.limit;
    safeParams.pageSize = params.limit;
  }
  const response = await axiosInstance.get('/accounts/invoices/am/pending', {
    params: Object.keys(safeParams).length > 0 ? safeParams : undefined
  });
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
