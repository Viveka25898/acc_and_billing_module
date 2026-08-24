import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as service from '../../Features/Process For Conveyance Booking/services/conveyancePaymentService';
import * as conveyancePaymentService from '../../Features/Process For Payments/services/conveyancePaymentService';

const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

// Async Thunks
export const submitConveyanceClaim = createAsyncThunk(
  'conveyance/submitConveyanceClaim',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await service.submitConveyanceClaim(formData);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchMyConveyanceClaims = createAsyncThunk(
  'conveyance/fetchMyConveyanceClaims',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await service.fetchMyConveyanceClaims(params);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchRejectionReason = createAsyncThunk(
  'conveyance/fetchRejectionReason',
  async (requestId, { rejectWithValue }) => {
    try {
      const data = await service.fetchRejectionReason(requestId);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchConveyanceQueue = createAsyncThunk(
  'conveyance/fetchConveyanceQueue',
  async (_, { rejectWithValue }) => {
    try {
      const data = await service.fetchConveyanceQueue();
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const approveConveyanceRequest = createAsyncThunk(
  'conveyance/approveConveyanceRequest',
  async ({ id, comments }, { rejectWithValue }) => {
    try {
      const data = await service.approveConveyanceRequest({ id, comments });
      return { id, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const rejectConveyanceRequest = createAsyncThunk(
  'conveyance/rejectConveyanceRequest',
  async ({ id, comments, rejectionReason }, { rejectWithValue }) => {
    try {
      const data = await service.rejectConveyanceRequest({ id, comments, rejectionReason });
      return { id, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchConveyanceVoucher = createAsyncThunk(
  'conveyance/fetchConveyanceVoucher',
  async (claimId, { rejectWithValue }) => {
    try {
      const data = await service.fetchConveyanceVoucher(claimId);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchPendingConveyancePayments = createAsyncThunk(
  'conveyance/fetchPendingConveyancePayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await conveyancePaymentService.fetchPendingConveyancePayments(params);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  myClaims: [],
  queueRequests: [],
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
  pendingPaymentConveyances: [],
  pendingPaymentPagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    recordsPerPage: 20,
  },
  pendingPaymentSummary: {
    totalPendingPayment: 0,
    totalAmount: '0.00',
    byDepartment: {},
  },
  submitLoading: false,
  claimsLoading: false,
  queueLoading: false,
  voucherLoading: false,
  actionLoadingId: null,
  rejectionReasonLoading: false,
  pendingPaymentsLoading: false,
  error: null,
  pendingPaymentsError: null,
  activeRejectionDetails: null,
  activeVoucherData: null,
};

const conveyanceSlice = createSlice({
  name: 'conveyance',
  initialState,
  reducers: {
    clearConveyanceError: (state) => {
      state.error = null;
      state.pendingPaymentsError = null;
    },
    clearRejectionDetails: (state) => {
      state.activeRejectionDetails = null;
    },
    clearVoucherData: (state) => {
      state.activeVoucherData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Conveyance Claim
      .addCase(submitConveyanceClaim.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(submitConveyanceClaim.fulfilled, (state) => {
        state.submitLoading = false;
        state.error = null;
      })
      .addCase(submitConveyanceClaim.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })

      // Fetch My Conveyance Claims
      .addCase(fetchMyConveyanceClaims.pending, (state) => {
        state.claimsLoading = true;
        state.error = null;
      })
      .addCase(fetchMyConveyanceClaims.fulfilled, (state, action) => {
        state.claimsLoading = false;
        state.myClaims = action.payload?.claims || [];
        state.pagination = action.payload?.pagination || initialState.pagination;
        state.summary = action.payload?.summary || initialState.summary;
      })
      .addCase(fetchMyConveyanceClaims.rejected, (state, action) => {
        state.claimsLoading = false;
        state.error = action.payload;
      })

      // Fetch Conveyance Queue
      .addCase(fetchConveyanceQueue.pending, (state) => {
        state.queueLoading = true;
        state.error = null;
      })
      .addCase(fetchConveyanceQueue.fulfilled, (state, action) => {
        state.queueLoading = false;
        state.queueRequests = action.payload?.pendingRequests || [];
      })
      .addCase(fetchConveyanceQueue.rejected, (state, action) => {
        state.queueLoading = false;
        state.error = action.payload;
      })

      // Approve Request
      .addCase(approveConveyanceRequest.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(approveConveyanceRequest.fulfilled, (state, action) => {
        state.actionLoadingId = null;
        const { id } = action.payload;
        state.queueRequests = state.queueRequests.filter((item) => item.id !== id);
      })
      .addCase(approveConveyanceRequest.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      })

      // Reject Request
      .addCase(rejectConveyanceRequest.pending, (state, action) => {
        state.actionLoadingId = action.meta.arg.id;
        state.error = null;
      })
      .addCase(rejectConveyanceRequest.fulfilled, (state, action) => {
        state.actionLoadingId = null;
        const { id } = action.payload;
        state.queueRequests = state.queueRequests.filter((item) => item.id !== id);
      })
      .addCase(rejectConveyanceRequest.rejected, (state, action) => {
        state.actionLoadingId = null;
        state.error = action.payload;
      })

      // Fetch Voucher
      .addCase(fetchConveyanceVoucher.pending, (state) => {
        state.voucherLoading = true;
        state.error = null;
      })
      .addCase(fetchConveyanceVoucher.fulfilled, (state, action) => {
        state.voucherLoading = false;
        state.activeVoucherData = action.payload;
      })
      .addCase(fetchConveyanceVoucher.rejected, (state, action) => {
        state.voucherLoading = false;
        state.error = action.payload;
      })

      // Fetch Pending Conveyance Payments (Process for Payments)
      .addCase(fetchPendingConveyancePayments.pending, (state) => {
        state.pendingPaymentsLoading = true;
        state.pendingPaymentsError = null;
      })
      .addCase(fetchPendingConveyancePayments.fulfilled, (state, action) => {
        state.pendingPaymentsLoading = false;
        const resData = action.payload?.data || action.payload || {};
        state.pendingPaymentConveyances = resData.requests || [];
        state.pendingPaymentPagination = resData.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalRecords: 0,
          recordsPerPage: 20,
        };
        state.pendingPaymentSummary = resData.summary || {
          totalPendingPayment: 0,
          totalAmount: '0.00',
          byDepartment: {},
        };
      })
      .addCase(fetchPendingConveyancePayments.rejected, (state, action) => {
        state.pendingPaymentsLoading = false;
        state.pendingPaymentsError = action.payload;
      });
  },
});

export const { clearConveyanceError, clearRejectionDetails, clearVoucherData } = conveyanceSlice.actions;

// Selectors
export const selectMyConveyanceClaims = (state) => state.conveyance.myClaims;
export const selectConveyancePagination = (state) => state.conveyance.pagination;
export const selectConveyanceSummary = (state) => state.conveyance.summary;
export const selectConveyanceSubmitLoading = (state) => state.conveyance.submitLoading;
export const selectConveyanceClaimsLoading = (state) => state.conveyance.claimsLoading;
export const selectConveyanceError = (state) => state.conveyance.error;
export const selectActiveRejectionDetails = (state) => state.conveyance.activeRejectionDetails;

// Approver Queue Selectors
export const selectConveyanceQueueRequests = (state) => state.conveyance.queueRequests;
export const selectConveyanceQueueLoading = (state) => state.conveyance.queueLoading;
export const selectConveyanceActionLoadingId = (state) => state.conveyance.actionLoadingId;
export const selectConveyanceVoucher = (state) => state.conveyance.activeVoucherData;
export const selectConveyanceVoucherLoading = (state) => state.conveyance.voucherLoading;

// Pending Payment Selectors (Process for Payments)
export const selectPendingPaymentConveyances = (state) => state.conveyance.pendingPaymentConveyances;
export const selectPendingPaymentConveyancePagination = (state) => state.conveyance.pendingPaymentPagination;
export const selectPendingPaymentConveyanceSummary = (state) => state.conveyance.pendingPaymentSummary;
export const selectPendingPaymentConveyanceLoading = (state) => state.conveyance.pendingPaymentsLoading;
export const selectPendingPaymentConveyanceError = (state) => state.conveyance.pendingPaymentsError;

export default conveyanceSlice.reducer;
