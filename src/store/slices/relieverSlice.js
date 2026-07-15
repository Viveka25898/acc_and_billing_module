import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as service from '../../Features/Process For Reliver Payments/services/relieverPaymentService';

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
  loading: {
    fetch: false,
    submit: false,
  },
  errors: {
    fetch: null,
    submit: null,
  },
  submitResult: null,
};

const relieverSlice = createSlice({
  name: 'reliever',
  initialState,
  reducers: {
    clearSubmitResult: (state) => {
      state.submitResult = null;
      state.errors.submit = null;
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
      });
  },
});

export const { clearSubmitResult } = relieverSlice.actions;

export const selectRelieverRequests = (state) => state.reliever.requests;
export const selectRelieverPagination = (state) => state.reliever.pagination;
export const selectRelieverSummary = (state) => state.reliever.summary;
export const selectRelieverFetchLoading = (state) => state.reliever.loading.fetch;
export const selectRelieverSubmitLoading = (state) => state.reliever.loading.submit;
export const selectRelieverSubmitError = (state) => state.reliever.errors.submit;
export const selectRelieverFetchError = (state) => state.reliever.errors.fetch;
export const selectRelieverSubmitResult = (state) => state.reliever.submitResult;

export default relieverSlice.reducer;
