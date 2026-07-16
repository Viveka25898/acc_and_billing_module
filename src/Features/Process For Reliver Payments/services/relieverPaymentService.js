import axiosInstance from '../../../api/axiosInstance';

/**
 * submitRelieverRequest
 * Posts reliever payment request details and files to the backend
 * @param {Object} payload The form fields and files
 * @returns {Promise<Object>} The success payload containingrequestId, status, etc.
 */
export const submitRelieverRequest = async (payload) => {
  // Validate basic parameters before submission
  if (!payload.name?.trim()) throw new Error('Reliever Name is required');
  if (!payload.site?.trim()) throw new Error('Site location is required');
  if (!payload.amount || parseFloat(payload.amount) <= 0) {
    throw new Error('Valid reliever payment amount is required');
  }
  if (!payload.idProof) throw new Error('ID Proof document is required');
  if (!payload.passbookFile) throw new Error('Bank Passbook document is required');

  // Build FormData for multipart upload
  const formData = new FormData();
  formData.append('reliever_name', payload.name.trim());
  formData.append('reliever_emp_code', payload.relieverEmpCode?.trim() || '');
  formData.append('reliever_for', payload.relieverFor?.trim() || '');
  formData.append('absent_emp_code', payload.absentEmpCode?.trim() || '');
  formData.append('reason', payload.reason?.trim() || '');
  formData.append('visit_date', payload.date || '');
  formData.append('shift', (payload.shift || '').toUpperCase());
  formData.append('reliever_type', (payload.type || 'EXTERNAL').toUpperCase());
  formData.append('site', payload.site);
  formData.append('amount', parseFloat(payload.amount).toString());
  formData.append('account_no', payload.accountNo?.trim() || '');
  formData.append('ifsc_code', payload.ifscCode?.trim() || '');
  formData.append('remarks', payload.remarks?.trim() || '');
  
  // Files
  formData.append('id_proof', payload.idProof);
  formData.append('passbook', payload.passbookFile);

  const response = await axiosInstance.post('/accounts/reliever/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to submit reliever request.');
  }

  return body.data;
};

/**
 * fetchMyRelieverRequests
 * Fetches the reliever requests submitted by the logged-in user with filters and pagination
 * @param {Object} params Request parameters (page, limit, name, status)
 * @returns {Promise<Object>} Map containing requests, pagination metadata and summary stats
 */
export const fetchMyRelieverRequests = async (params = {}) => {
  const queryParams = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.name?.trim()) {
    queryParams.name = params.name.trim();
    queryParams.reliever_name = params.name.trim();
    queryParams.search = params.name.trim();
    queryParams.query = params.name.trim();
  }
  if (params.date?.trim()) {
    queryParams.date = params.date.trim();
    queryParams.visit_date = params.date.trim();
  }

  const response = await axiosInstance.get('/accounts/reliever/my-requests', { params: queryParams });
  
  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to retrieve reliever requests.');
  }

  return {
    requests: body.data?.requests || [],
    pagination: {
      currentPage: body.data?.pagination?.currentPage || 1,
      totalPages: body.data?.pagination?.totalPages || 1,
      totalRecords: body.data?.pagination?.totalRecords || 0,
      recordsPerPage: body.data?.pagination?.recordsPerPage || 5,
    },
    summary: {
      totalRequests: body.data?.summary?.totalRequests || 0,
      pendingApproval: body.data?.summary?.pendingApproval || 0,
      approved: body.data?.summary?.approved || 0,
      rejected: body.data?.summary?.rejected || 0,
      totalAmountClaimed: body.data?.summary?.totalAmountClaimed || '0.00',
    }
  };
};

/**
 * fetchRelieverQueue
 * Fetches the pending requests queue for approval by the logged-in manager (Regional Head)
 * @returns {Promise<Object>} Object containing pendingRequests, approvedRequests, rejectedRequests and counts
 */
export const fetchRelieverQueue = async () => {
  const response = await axiosInstance.get('/accounts/reliever/queue');
  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to retrieve reliever approval queue.');
  }
  return {
    pendingRequests: body.data?.pendingRequests || [],
    approvedRequests: body.data?.approvedRequests || [],
    rejectedRequests: body.data?.rejectedRequests || [],
    counts: body.data?.counts || { pending: 0, approved: 0, rejected: 0 }
  };
};

/**
 * approveRelieverRequest
 * Approves a reliever request forwarding it to next stage
 * @param {Object} payload Payload containing id and comments
 * @returns {Promise<Object>} Updated workflow result details
 */
export const approveRelieverRequest = async ({ id, comments = 'Approved' }) => {
  const response = await axiosInstance.patch(`/accounts/reliever/${id}/workflow`, {
    action: 'APPROVE',
    comments: comments
  });
  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to approve request.');
  }
  return body.data;
};

/**
 * rejectRelieverRequest
 * Rejects a reliever request
 * @param {Object} payload Payload containing id, comments and rejectionReason
 * @returns {Promise<Object>} Updated workflow result details
 */
export const rejectRelieverRequest = async ({ id, comments = 'Rejected', rejectionReason = '' }) => {
  const response = await axiosInstance.patch(`/accounts/reliever/${id}/workflow`, {
    action: 'REJECT',
    comments: comments,
    rejection_reason: rejectionReason
  });
  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to reject request.');
  }
  return body.data;
};

/**
 * bulkApproveRelieverRequests
 * Approves multiple reliever requests in a single call
 * @param {Object} payload Payload containing array of ids
 * @returns {Promise<Object>} Bulk approval result stats
 */
export const bulkApproveRelieverRequests = async ({ ids }) => {
  const response = await axiosInstance.post('/accounts/reliever/bulk-approve', {
    request_ids: ids
  });
  const body = response.data;
  if (!body || !body.success) {
    throw new Error(body?.message || 'Failed to bulk approve requests.');
  }
  return body.data;
};


