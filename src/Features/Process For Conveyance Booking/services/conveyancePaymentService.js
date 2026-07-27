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
 * Helper to patch request with endpoint fallbacks (/accounts/conveyance vs /conveyance)
 */
const patchWithFallback = async (endpoints, bodyData, config) => {
  let lastError = null;
  for (const endpoint of endpoints) {
    try {
      const response = await axiosInstance.patch(endpoint, bodyData, config);
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

  // Support both /accounts/conveyance/submit (primary) and /conveyance/submit
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

/**
 * fetchMyConveyanceClaims
 * Retrieves all conveyance claims submitted by the logged-in user with filters and pagination.
 * @param {Object} params Filter & pagination query parameters (status, client, date, page, limit)
 * @returns {Promise<Object>} Backend API response data containing requests, pagination, and summary
 */
export const fetchMyConveyanceClaims = async (params = {}) => {
  const queryParams = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.status && params.status !== 'All') queryParams.status = params.status;
  if (params.client && params.client.trim()) queryParams.client = params.client.trim();
  if (params.date && params.date.trim()) queryParams.date = params.date.trim();

  const endpoints = ['/accounts/conveyance/my-claims', '/conveyance/my-claims'];

  const response = await getWithFallback(endpoints, { params: queryParams });

  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to fetch conveyance claims.');
  }

  return body.data;
};

/**
 * fetchRejectionReason
 * Retrieves detailed rejection reason for a rejected conveyance claim
 * @param {string} requestId Request ID
 * @returns {Promise<Object>} Rejection details
 */
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

/**
 * fetchConveyanceQueue
 * Retrieves all conveyance claims pending approval for the current logged-in approver (e.g. Regional Head)
 * @returns {Promise<Array>} Array of pending conveyance requests
 */
export const fetchConveyanceQueue = async () => {
  const endpoints = ['/accounts/conveyance/queue', '/conveyance/queue'];

  const response = await getWithFallback(endpoints);
  const body = response.data;

  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to fetch conveyance queue.');
  }

  return body.data || [];
};

/**
 * approveConveyanceRequest
 * Approves a conveyance claim request and forwards to the next approver (e.g., AVP)
 * @param {Object} params { id, comments }
 * @returns {Promise<Object>} Updated workflow item data
 */
export const approveConveyanceRequest = async ({ id, comments = 'Approved' }) => {
  if (!id) throw new Error('Claim ID is required');

  const endpoints = [
    `/accounts/conveyance/${id}/workflow`,
    `/conveyance/${id}/workflow`,
  ];

  const payload = {
    action: 'APPROVE',
    comments: comments || 'Approved',
  };

  const response = await patchWithFallback(endpoints, payload);
  const body = response.data;

  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to approve conveyance claim.');
  }

  return body.data;
};

/**
 * rejectConveyanceRequest
 * Rejects a conveyance claim request with mandatory comments and rejection reason
 * @param {Object} params { id, comments, rejectionReason }
 * @returns {Promise<Object>} Updated workflow item data
 */
export const rejectConveyanceRequest = async ({ id, comments = 'Rejected', rejectionReason = '' }) => {
  if (!id) throw new Error('Claim ID is required');

  const endpoints = [
    `/accounts/conveyance/${id}/workflow`,
    `/conveyance/${id}/workflow`,
  ];

  const payload = {
    action: 'REJECT',
    comments: comments || rejectionReason || 'Rejected',
    rejection_reason: rejectionReason || comments || 'Rejected',
  };

  const response = await patchWithFallback(endpoints, payload);
  const body = response.data;

  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to reject conveyance claim.');
  }

  return body.data;
};

/**
 * fetchConveyanceVoucher
 * Retrieves expense voucher details and transaction information for an approved conveyance claim
 * @param {string} claimId Claim ID or request UUID
 * @returns {Promise<Object>} Voucher details
 */
export const fetchConveyanceVoucher = async (claimId) => {
  if (!claimId) throw new Error('Claim ID is required');

  const encodedId = encodeURIComponent(claimId);
  const endpoints = [
    `/accounts/conveyance/${claimId}/voucher`,
    `/accounts/conveyance/${encodedId}/voucher`,
    `/conveyance/${claimId}/voucher`,
    `/conveyance/${encodedId}/voucher`,
  ];

  const response = await getWithFallback(endpoints);
  const body = response.data;

  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to fetch expense voucher details.');
  }

  return body.data;
};

