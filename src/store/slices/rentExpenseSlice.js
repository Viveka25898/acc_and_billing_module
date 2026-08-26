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

export const fetchRentAgreementById = createAsyncThunk(
  'rentExpense/fetchRentAgreementById',
  async (agreementId, { rejectWithValue }) => {
    try {
      const data = await service.fetchRentAgreementById(agreementId);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const generateMonthlyVoucher = createAsyncThunk(
  'rentExpense/generateMonthlyVoucher',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await service.generateMonthlyVoucher(payload);
      return data;
    } catch (err) {
      const errorPayload = err.responseData || err.response?.data || {
        message: err.message || 'Failed to generate monthly voucher',
        details: [err.message]
      };
      return rejectWithValue(errorPayload);
    }
  }
);

export const fetchSiteVouchers = createAsyncThunk(
  'rentExpense/fetchSiteVouchers',
  async ({ siteId, params }, { rejectWithValue }) => {
    try {
      const data = await service.fetchSiteVouchers(siteId, params);
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const terminateRentAgreement = createAsyncThunk(
  'rentExpense/terminateRentAgreement',
  async ({ agreementId, payload }, { rejectWithValue }) => {
    try {
      const data = await service.terminateRentAgreement(agreementId, payload);
      return data;
    } catch (err) {
      const errorPayload = err.responseData || err.response?.data || {
        message: err.message || 'Failed to terminate rent agreement',
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
  activeAgreementDetails: null,
  agreementDetailsLoading: false,
  siteVouchers: [],
  vouchersSummary: null,
  vouchersLoading: false,
  vouchersError: null,
  voucherGenLoading: false,
  voucherGenError: null,
  voucherGenSuccess: false,
  lastGeneratedVoucher: null,
  terminateLoading: false,
  terminateError: null,
  terminateSuccess: false,
  lastTerminatedData: null,
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
    resetVoucherGenStatus: (state) => {
      state.voucherGenLoading = false;
      state.voucherGenError = null;
      state.voucherGenSuccess = false;
      state.lastGeneratedVoucher = null;
    },
    resetTerminateStatus: (state) => {
      state.terminateLoading = false;
      state.terminateError = null;
      state.terminateSuccess = false;
      state.lastTerminatedData = null;
    },
    clearActiveAgreementDetails: (state) => {
      state.activeAgreementDetails = null;
    },
    clearSiteVouchers: (state) => {
      state.siteVouchers = [];
      state.vouchersSummary = null;
    },
    clearRentErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.agreementError = null;
      state.voucherGenError = null;
      state.terminateError = null;
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
      .addCase(createRentalSite.fulfilled, (state) => {
        state.createLoading = false;
        state.createSuccess = true;
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
      .addCase(createRentAgreement.fulfilled, (state) => {
        state.agreementLoading = false;
        state.agreementSuccess = true;
      })
      .addCase(createRentAgreement.rejected, (state, action) => {
        state.agreementLoading = false;
        state.agreementError = action.payload;
        state.agreementSuccess = false;
      })

      // fetchRentAgreementById
      .addCase(fetchRentAgreementById.pending, (state) => {
        state.agreementDetailsLoading = true;
      })
      .addCase(fetchRentAgreementById.fulfilled, (state, action) => {
        state.agreementDetailsLoading = false;
        state.activeAgreementDetails = action.payload;
        if (action.payload?.siteId) {
          const matchingSite = state.sites.find(s => s.siteId === action.payload.siteId);
          if (matchingSite) {
            matchingSite.agreement = action.payload;
          }
        }
      })
      .addCase(fetchRentAgreementById.rejected, (state) => {
        state.agreementDetailsLoading = false;
      })

      // generateMonthlyVoucher
      .addCase(generateMonthlyVoucher.pending, (state) => {
        state.voucherGenLoading = true;
        state.voucherGenError = null;
        state.voucherGenSuccess = false;
      })
      .addCase(generateMonthlyVoucher.fulfilled, (state, action) => {
        state.voucherGenLoading = false;
        state.voucherGenSuccess = true;
        state.lastGeneratedVoucher = action.payload;
      })
      .addCase(generateMonthlyVoucher.rejected, (state, action) => {
        state.voucherGenLoading = false;
        state.voucherGenError = action.payload;
        state.voucherGenSuccess = false;
      })

      // fetchSiteVouchers
      .addCase(fetchSiteVouchers.pending, (state) => {
        state.vouchersLoading = true;
        state.vouchersError = null;
      })
      .addCase(fetchSiteVouchers.fulfilled, (state, action) => {
        state.vouchersLoading = false;
        state.siteVouchers = action.payload.vouchers || (Array.isArray(action.payload) ? action.payload : []);
        state.vouchersSummary = action.payload.summary || null;
      })
      .addCase(fetchSiteVouchers.rejected, (state, action) => {
        state.vouchersLoading = false;
        state.vouchersError = action.payload;
      })

      // terminateRentAgreement
      .addCase(terminateRentAgreement.pending, (state) => {
        state.terminateLoading = true;
        state.terminateError = null;
        state.terminateSuccess = false;
      })
      .addCase(terminateRentAgreement.fulfilled, (state, action) => {
        state.terminateLoading = false;
        state.terminateSuccess = true;
        state.lastTerminatedData = action.payload;

        const termSiteId = action.payload?.siteId;
        if (termSiteId) {
          const site = state.sites.find(s => s.siteId === termSiteId || s.id === termSiteId);
          if (site) {
            site.status = 'inactive';
            site.hasActiveAgreement = false;
            site.agreementStatus = 'terminated';
            if (site.agreement) {
              site.agreement.status = 'terminated';
              site.agreement.effectiveMonth = action.payload.effectiveMonth;
            }
          }
        }
      })
      .addCase(terminateRentAgreement.rejected, (state, action) => {
        state.terminateLoading = false;
        state.terminateError = action.payload;
        state.terminateSuccess = false;
      });
  },
});

export const {
  resetCreateStatus,
  resetAgreementStatus,
  resetVoucherGenStatus,
  resetTerminateStatus,
  clearActiveAgreementDetails,
  clearSiteVouchers,
  clearRentErrors
} = rentExpenseSlice.actions;

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
export const selectActiveAgreementDetails = (state) => state.rentExpense?.activeAgreementDetails || null;
export const selectAgreementDetailsLoading = (state) => state.rentExpense?.agreementDetailsLoading || false;
export const selectVoucherGenLoading = (state) => state.rentExpense?.voucherGenLoading || false;
export const selectVoucherGenError = (state) => state.rentExpense?.voucherGenError || null;
export const selectVoucherGenSuccess = (state) => state.rentExpense?.voucherGenSuccess || false;
export const selectLastGeneratedVoucher = (state) => state.rentExpense?.lastGeneratedVoucher || null;
export const selectSiteVouchers = (state) => state.rentExpense?.siteVouchers || [];
export const selectVouchersSummary = (state) => state.rentExpense?.vouchersSummary || null;
export const selectVouchersLoading = (state) => state.rentExpense?.vouchersLoading || false;
export const selectVouchersError = (state) => state.rentExpense?.error || null;
export const selectTerminateLoading = (state) => state.rentExpense?.terminateLoading || false;
export const selectTerminateError = (state) => state.rentExpense?.terminateError || null;
export const selectTerminateSuccess = (state) => state.rentExpense?.terminateSuccess || false;
export const selectLastTerminatedData = (state) => state.rentExpense?.lastTerminatedData || null;

export default rentExpenseSlice.reducer;
