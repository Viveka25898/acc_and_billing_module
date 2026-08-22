import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as service from '../../Features/Process For Reliver Payments/services/relieverPaymentService';
import * as relieverPaymentService from '../../Features/Process For Payments/services/relieverPaymentService';

const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

// Async Thunks
export const submitRelieverRequest = createAsyncThunk(
  'reliever/submitRelieverRequest',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await service.submitRelieverRequest(formData);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchMyRelieverRequests = createAsyncThunk(
  'reliever/fetchMyRelieverRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await service.fetchMyRelieverRequests(params);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchRelieverQueue = createAsyncThunk(
  'reliever/fetchRelieverQueue',
  async (_, { rejectWithValue }) => {
    try {
      const data = await service.fetchRelieverQueue();
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const approveRelieverRequest = createAsyncThunk(
  'reliever/approveRelieverRequest',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await service.approveRelieverRequest({ id, comments });
      return { id, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const rejectRelieverRequest = createAsyncThunk(
  'reliever/rejectRelieverRequest',
  async ({ id, comments, rejectionReason }, { rejectWithValue }) => {
    try {
      const data = await service.rejectRelieverRequest({ id, comments, rejectionReason });
      return { id, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const bulkApproveRelieverRequests = createAsyncThunk(
  'reliever/bulkApproveRelieverRequests',
  async ({ ids }, { rejectWithValue }) => {
    try {
      const data = await service.bulkApproveRelieverRequests({ ids });
      return { ids, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchRelieverVoucher = createAsyncThunk(
  'reliever/fetchRelieverVoucher',
  async (voucherNo, { rejectWithValue }) => {
    try {
      const data = await service.fetchRelieverVoucher(voucherNo);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchPendingRelieverRequests = createAsyncThunk(
  'reliever/fetchPendingRelieverRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await relieverPaymentService.fetchPendingRelieverRequests(params);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const generateRelieverPaymentFiles = createAsyncThunk(
  'reliever/generateRelieverPaymentFiles',
  async ({ selections }, { rejectWithValue }) => {
    try {
      const data = await relieverPaymentService.generateRelieverPaymentFiles(selections);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  requests: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 5,
  },
  summary: {
    totalRequests: 0,
    pendingApproval: 0,
    approved: 0,
    rejected: 0,
    totalAmountClaimed: '0.00',
  },
  queueRequests: [],
  queueCounts: {
    pending: 0,
    approved: 0,
    rejected: 0,
  },
  pendingPaymentRelievers: [],
  pendingPaymentPagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
  },
  loading: {
    fetch: false,
    submit: false,
    queue: false,
    action: false,
    voucher: false,
    pendingPayments: false,
  },
  errors: {
    fetch: null,
    submit: null,
    queue: null,
    action: null,
    voucher: null,
    pendingPayments: null,
  },
  submitResult: null,
  voucherDetails: null,
  relieverFileGenerating: false,
  relieverBatchId: null,
  relieverDownloads: null,
  relieverFileGenError: null,
};

const relieverSlice = createSlice({
  name: 'reliever',
  initialState,
  reducers: {
    clearSubmitResult: (state) => {
      state.submitResult = null;
      state.errors.submit = null;
    },
    clearRelieverFileGenError: (state) => {
      state.relieverFileGenError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Reliever Request
      .addCase(submitRelieverRequest.pending, (state) => {
        state.loading.submit = true;
        state.errors.submit = null;
        state.submitResult = null;
      })
      .addCase(submitRelieverRequest.fulfilled, (state, action) => {
        state.loading.submit = false;
        state.submitResult = action.payload || {};
      })
      .addCase(submitRelieverRequest.rejected, (state, action) => {
        state.loading.submit = false;
        state.errors.submit = action.payload;
      })
      // Fetch My Reliever Requests
      .addCase(fetchMyRelieverRequests.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchMyRelieverRequests.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.requests = action.payload?.requests || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
        state.summary = action.payload?.summary || initialState.summary;
      })
      .addCase(fetchMyRelieverRequests.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
      })
      // Fetch Reliever Queue
      .addCase(fetchRelieverQueue.pending, (state) => {
        state.loading.queue = true;
        state.errors.queue = null;
      })
      .addCase(fetchRelieverQueue.fulfilled, (state, action) => {
        state.loading.queue = false;
        state.queueRequests = action.payload?.pendingRequests || [];
        state.queueCounts = action.payload?.counts || { pending: 0, approved: 0, rejected: 0 };
      })
      .addCase(fetchRelieverQueue.rejected, (state, action) => {
        state.loading.queue = false;
        state.errors.queue = action.payload;
      })
      // Approve Reliever Request
      .addCase(approveRelieverRequest.pending, (state) => {
        state.loading.action = true;
        state.errors.action = null;
      })
      .addCase(approveRelieverRequest.fulfilled, (state, action) => {
        state.loading.action = false;
        state.queueRequests = state.queueRequests.filter(req => req.id !== action.payload.id);
        if (state.queueCounts.pending > 0) state.queueCounts.pending -= 1;
        state.queueCounts.approved += 1;
      })
      .addCase(approveRelieverRequest.rejected, (state, action) => {
        state.loading.action = false;
        state.errors.action = action.payload;
      })
      // Reject Reliever Request
      .addCase(rejectRelieverRequest.pending, (state) => {
        state.loading.action = true;
        state.errors.action = null;
      })
      .addCase(rejectRelieverRequest.fulfilled, (state, action) => {
        state.loading.action = false;
        state.queueRequests = state.queueRequests.filter(req => req.id !== action.payload.id);
        if (state.queueCounts.pending > 0) state.queueCounts.pending -= 1;
        state.queueCounts.rejected += 1;
      })
      .addCase(rejectRelieverRequest.rejected, (state, action) => {
        state.loading.action = false;
        state.errors.action = action.payload;
      })
      // Bulk Approve Reliever Requests
      .addCase(bulkApproveRelieverRequests.pending, (state) => {
        state.loading.action = true;
        state.errors.action = null;
      })
      .addCase(bulkApproveRelieverRequests.fulfilled, (state, action) => {
        state.loading.action = false;
        const approvedIds = action.payload.ids || [];
        state.queueRequests = state.queueRequests.filter(req => !approvedIds.includes(req.id));
        state.queueCounts.pending = Math.max(0, state.queueCounts.pending - approvedIds.length);
        state.queueCounts.approved += approvedIds.length;
      })
      .addCase(bulkApproveRelieverRequests.rejected, (state, action) => {
        state.loading.action = false;
        state.errors.action = action.payload;
      })
      // Fetch Reliever Voucher
      .addCase(fetchRelieverVoucher.pending, (state) => {
        state.loading.voucher = true;
        state.errors.voucher = null;
        state.voucherDetails = null;
      })
      .addCase(fetchRelieverVoucher.fulfilled, (state, action) => {
        state.loading.voucher = false;
        state.voucherDetails = action.payload || null;
      })
      .addCase(fetchRelieverVoucher.rejected, (state, action) => {
        state.loading.voucher = false;
        state.errors.voucher = action.payload;
      })
      // Fetch Pending Reliever Requests (Process for Payments)
      .addCase(fetchPendingRelieverRequests.pending, (state) => {
        state.loading.pendingPayments = true;
        state.errors.pendingPayments = null;
      })
      .addCase(fetchPendingRelieverRequests.fulfilled, (state, action) => {
        state.loading.pendingPayments = false;
        state.pendingPaymentRelievers = action.payload?.relieverRequests || [];
        state.pendingPaymentPagination = action.payload?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize: 20,
        };
      })
      .addCase(fetchPendingRelieverRequests.rejected, (state, action) => {
        state.loading.pendingPayments = false;
        state.errors.pendingPayments = action.payload;
      })
      // Generate Reliever Payment Files
      .addCase(generateRelieverPaymentFiles.pending, (state) => {
        state.relieverFileGenerating = true;
        state.relieverFileGenError = null;
      })
      .addCase(generateRelieverPaymentFiles.fulfilled, (state, action) => {
        state.relieverFileGenerating = false;
        state.relieverBatchId = action.payload?.batchId || null;
        state.relieverDownloads = action.payload?.downloads || null;
      })
      .addCase(generateRelieverPaymentFiles.rejected, (state, action) => {
        state.relieverFileGenerating = false;
        state.relieverFileGenError = action.payload;
      });
  },
});

export const { clearSubmitResult, clearRelieverFileGenError } = relieverSlice.actions;

export const selectRelieverRequests = (state) => state.reliever.requests;
export const selectRelieverPagination = (state) => state.reliever.pagination;
export const selectRelieverSummary = (state) => state.reliever.summary;
export const selectRelieverFetchLoading = (state) => state.reliever.loading.fetch;
export const selectRelieverSubmitLoading = (state) => state.reliever.loading.submit;
export const selectRelieverSubmitError = (state) => state.reliever.errors.submit;
export const selectRelieverFetchError = (state) => state.reliever.errors.fetch;
export const selectRelieverSubmitResult = (state) => state.reliever.submitResult;

export const selectRelieverQueueRequests = (state) => state.reliever.queueRequests;
export const selectRelieverQueueCounts = (state) => state.reliever.queueCounts;
export const selectRelieverQueueLoading = (state) => state.reliever.loading.queue;
export const selectRelieverActionLoading = (state) => state.reliever.loading.action;
export const selectRelieverActionError = (state) => state.reliever.errors.action;
export const selectRelieverQueueError = (state) => state.reliever.errors.queue;

export const selectRelieverVoucherDetails = (state) => state.reliever.voucherDetails;
export const selectRelieverVoucherLoading = (state) => state.reliever.loading.voucher;
export const selectRelieverVoucherError = (state) => state.reliever.errors.voucher;

export const selectPendingPaymentRelievers = (state) => state.reliever.pendingPaymentRelievers;
export const selectPendingPaymentPagination = (state) => state.reliever.pendingPaymentPagination;
export const selectPendingPaymentLoading = (state) => state.reliever.loading.pendingPayments;
export const selectPendingPaymentError = (state) => state.reliever.errors.pendingPayments;

export const selectRelieverFileGenerating = (state) => state.reliever.relieverFileGenerating;
export const selectRelieverBatchId = (state) => state.reliever.relieverBatchId;
export const selectRelieverDownloads = (state) => state.reliever.relieverDownloads;
export const selectRelieverFileGenError = (state) => state.reliever.relieverFileGenError;

export default relieverSlice.reducer;
