import axiosInstance from '../../../api/axiosInstance';

/**
 * Helper to post request with endpoint fallbacks (/accounts/conveyance vs /conveyance)
 */
const postWithFallback = async (endpoints, formData, config) => {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.post(endpoint, formData, config);
      return response;
    } catch (err) {
      lastError = err;
      if (err.response && err.response.status === 404) {
        continue; // Try next endpoint prefix
      }
      throw err;
    }
  }
  throw lastError;
};

/**
 * Helper to get request with endpoint fallbacks (/accounts/conveyance vs /conveyance)
 */
const getWithFallback = async (endpoints, config) => {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.get(endpoint, config);
      return response;
    } catch (err) {
      lastError = err;
      if (err.response && err.response.status === 404) {
        continue; // Try next endpoint prefix
      }
      throw err;
    }
  }
  throw lastError;
};

/**
 * submitConveyanceClaim
 * Submits a new conveyance claim request with Visit Reports and Receipts to the backend.
 * @param {FormData|Object} payload FormData or Object containing claim details and files
 * @returns {Promise<Object>} Backend API response data
 */
export const submitConveyanceClaim = async (payload) => {
  let formData = payload;

  if (!(payload instanceof FormData)) {
    formData = new FormData();
    if (payload.date || payload.visit_date) {
      formData.append('visit_date', payload.visit_date || payload.date);
    }
    if (payload.purpose) {
      formData.append('purpose', payload.purpose);
    }
    if (payload.client_name || payload.client) {
      formData.append('client_name', payload.client_name || payload.client);
    }
    if (payload.transport_mode || payload.transport) {
      formData.append('transport_mode', (payload.transport_mode || payload.transport).toUpperCase());
    }
    if (payload.distance_km || payload.distance) {
      formData.append('distance_km', (payload.distance_km || payload.distance).toString());
    }
    if (payload.amount) {
      formData.append('amount', payload.amount.toString());
    }
    if (payload.remarks) {
      formData.append('remarks', payload.remarks);
    }

    // Single or array of report files
    if (payload.report_files) {
      if (Array.isArray(payload.report_files)) {
        payload.report_files.forEach((file) => {
          if (file) formData.append('report_files', file);
        });
      } else {
        formData.append('report_files', payload.report_files);
      }
    }

    // Single or array of receipt files
    if (payload.receipt_files) {
      if (Array.isArray(payload.receipt_files)) {
        payload.receipt_files.forEach((file) => {
          if (file) formData.append('receipt_files', file);
        });
      } else {
        formData.append('receipt_files', payload.receipt_files);
      }
    }
  }

  // Support both /accounts/conveyance/submit (Reliever pattern) and /conveyance/submit
  const endpoints = ['/accounts/conveyance/submit', '/conveyance/submit'];

  const response = await postWithFallback(endpoints, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to submit conveyance claim request.');
  }

  return body;
};


export const fetchMyConveyanceClaims = async (params = {}) => {
  const queryParams = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.status && params.status !== 'All') queryParams.status = params.status;
  if (params.client && params.client.trim()) queryParams.client = params.client.trim();
  if (params.date && params.date.trim()) queryParams.date = params.date.trim();

  // Support both /accounts/conveyance/my-claims and /conveyance/my-claims
  const endpoints = ['/accounts/conveyance/my-claims', '/conveyance/my-claims'];

  const response = await getWithFallback(endpoints, { params: queryParams });

  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to fetch conveyance claims.');
  }

  return body.data;
};


export const fetchRejectionReason = async (requestId) => {
  if (!requestId) throw new Error('Request ID is required');

  const endpoints = [
    `/accounts/conveyance/rejection-reason/${requestId}`,
    `/conveyance/rejection-reason/${requestId}`,
  ];

  const response = await getWithFallback(endpoints);
  const body = response.data;

  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to fetch rejection details.');
  }

  return body.data;
};
