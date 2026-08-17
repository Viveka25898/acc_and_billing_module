import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as service from '../../Features/Process For Rent Expense Booking/services/rentExpenseService';

const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.message) return error.message;
  return 'An unexpected error occurred';
};

// Async Thunks
export const createRentalSite = createAsyncThunk(
  'rentExpense/createRentalSite',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await service.createRentalSite(payload);
      return data;
    } catch (err) {
      const errorPayload = err.responseData || err.response?.data || {
        message: err.message || 'An unexpected error occurred',
        details: [err.message]
      };
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchRentalSites = createAsyncThunk(
  'rentExpense/fetchRentalSites',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await service.fetchRentalSites(params);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const createRentAgreement = createAsyncThunk(
  'rentExpense/createRentAgreement',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await service.createRentAgreement(payload);
      return data;
    } catch (err) {
      const errorPayload = err.responseData || err.response?.data || {
        message: err.message || 'Failed to upload rent agreement',
        details: [err.message]
      };
      return rejectWithValue(errorPayload);
    }
  }
);

const initialState = {
  sites: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    limit: 10,
  },
  summary: {
    totalSites: 0,
    activeSites: 0,
    inactiveSites: 0,
    sitesWithAgreements: 0,
    totalMonthlyRent: 0,
  },
  loading: false,
  createLoading: false,
  agreementLoading: false,
  error: null,
  createError: null,
  createSuccess: false,
  agreementError: null,
  agreementSuccess: false,
};

const rentExpenseSlice = createSlice({
  name: 'rentExpense',
  initialState,
  reducers: {
    resetCreateStatus: (state) => {
      state.createLoading = false;
      state.createError = null;
      state.createSuccess = false;
    },
    resetAgreementStatus: (state) => {
      state.agreementLoading = false;
      state.agreementError = null;
      state.agreementSuccess = false;
    },
    clearRentErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.agreementError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchRentalSites
      .addCase(fetchRentalSites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRentalSites.fulfilled, (state, action) => {
        state.loading = false;
        state.sites = action.payload.sites || [];
        state.pagination = action.payload.pagination || initialState.pagination;
        state.summary = action.payload.summary || initialState.summary;
      })
      .addCase(fetchRentalSites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createRentalSite
      .addCase(createRentalSite.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createSuccess = false;
      })
      .addCase(createRentalSite.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createSuccess = true;
        if (action.payload && action.payload.siteId) {
          state.sites.unshift(action.payload);
          state.summary.totalSites += 1;
          state.summary.activeSites += 1;
        }
      })
      .addCase(createRentalSite.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
        state.createSuccess = false;
      })

      // createRentAgreement
      .addCase(createRentAgreement.pending, (state) => {
        state.agreementLoading = true;
        state.agreementError = null;
        state.agreementSuccess = false;
      })
      .addCase(createRentAgreement.fulfilled, (state, action) => {
        state.agreementLoading = false;
        state.agreementSuccess = true;
        const agreementData = action.payload;
        const targetSiteId = agreementData?.siteId;
        if (targetSiteId) {
          state.sites = state.sites.map(site => {
            if (site.siteId === targetSiteId) {
              return {
                ...site,
                hasActiveAgreement: true,
                agreementId: agreementData.agreementId || site.agreementId,
                monthlyRent: agreementData.calculations?.monthlyTotal || agreementData.amount || site.monthlyRent,
                agreement: agreementData,
              };
            }
            return site;
          });
          state.summary.sitesWithAgreements = state.sites.filter(s => s.hasActiveAgreement).length;
        }
      })
      .addCase(createRentAgreement.rejected, (state, action) => {
        state.agreementLoading = false;
        state.agreementError = action.payload;
        state.agreementSuccess = false;
      });
  },
});

export const { resetCreateStatus, resetAgreementStatus, clearRentErrors } = rentExpenseSlice.actions;

// Selectors
export const selectRentalSites = (state) => state.rentExpense?.sites || [];
export const selectRentPagination = (state) => state.rentExpense?.pagination || initialState.pagination;
export const selectRentSummary = (state) => state.rentExpense?.summary || initialState.summary;
export const selectRentLoading = (state) => state.rentExpense?.loading || false;
export const selectRentCreateLoading = (state) => state.rentExpense?.createLoading || false;
export const selectRentError = (state) => state.rentExpense?.error || null;
export const selectRentCreateError = (state) => state.rentExpense?.createError || null;
export const selectRentCreateSuccess = (state) => state.rentExpense?.createSuccess || false;
export const selectAgreementLoading = (state) => state.rentExpense?.agreementLoading || false;
export const selectAgreementError = (state) => state.rentExpense?.agreementError || null;
export const selectAgreementSuccess = (state) => state.rentExpense?.agreementSuccess || false;

export default rentExpenseSlice.reducer;
