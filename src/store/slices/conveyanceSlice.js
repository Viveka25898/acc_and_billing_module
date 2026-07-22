import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as service from '../../Features/Process For Conveyance Booking/services/conveyancePaymentService';

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

const initialState = {
  myClaims: [],
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
  submitLoading: false,
  claimsLoading: false,
  rejectionReasonLoading: false,
  error: null,
  activeRejectionDetails: null,
};

const conveyanceSlice = createSlice({
  name: 'conveyance',
  initialState,
  reducers: {
    clearConveyanceError: (state) => {
      state.error = null;
    },
    clearRejectionDetails: (state) => {
      state.activeRejectionDetails = null;
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
        state.error = null;
        if (action.payload) {
          state.myClaims = action.payload.requests || [];
          state.pagination = action.payload.pagination || initialState.pagination;
          state.summary = action.payload.summary || initialState.summary;
        }
      })
      .addCase(fetchMyConveyanceClaims.rejected, (state, action) => {
        state.claimsLoading = false;
        state.error = action.payload;
      })

      // Fetch Rejection Reason
      .addCase(fetchRejectionReason.pending, (state) => {
        state.rejectionReasonLoading = true;
      })
      .addCase(fetchRejectionReason.fulfilled, (state, action) => {
        state.rejectionReasonLoading = false;
        state.activeRejectionDetails = action.payload;
      })
      .addCase(fetchRejectionReason.rejected, (state) => {
        state.rejectionReasonLoading = false;
      });
  },
});

export const { clearConveyanceError, clearRejectionDetails } = conveyanceSlice.actions;

// Selectors
export const selectMyConveyanceClaims = (state) => state.conveyance.myClaims;
export const selectConveyancePagination = (state) => state.conveyance.pagination;
export const selectConveyanceSummary = (state) => state.conveyance.summary;
export const selectConveyanceSubmitLoading = (state) => state.conveyance.submitLoading;
export const selectConveyanceClaimsLoading = (state) => state.conveyance.claimsLoading;
export const selectConveyanceError = (state) => state.conveyance.error;
export const selectActiveRejectionDetails = (state) => state.conveyance.activeRejectionDetails;

export default conveyanceSlice.reducer;
