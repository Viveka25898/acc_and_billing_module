import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as aeInvoiceService from '../../Features/PurchaseBookingHKMaterial/Services/aeInvoiceService';

// Error extractor helper
const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.';
  if (typeof error === 'string') return error;
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.error) return error.response.data.error;
  if (error.message) return error.message;
  return 'An unexpected error occurred.';
};

// ─── Thunks ───────────────────────────────────────────────────────────

/**
 * Fetch AE Pending Invoices queue
 */
export const fetchAEPendingInvoices = createAsyncThunk(
  'aeInvoice/fetchAEPendingInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await aeInvoiceService.fetchAEPending(params);
      if (!data || data.success === false) {
        return rejectWithValue(data.message || 'Failed to fetch pending invoices');
      }
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

/**
 * Approve HK Material Invoice
 */
export const approveAEInvoice = createAsyncThunk(
  'aeInvoice/approveAEInvoice',
  async ({ invoiceId, payload }, { rejectWithValue }) => {
    try {
      if (!invoiceId) return rejectWithValue('Invoice ID is required');
      const data = await aeInvoiceService.submitAEDecision(invoiceId, {
        decision: 'Approved',
        ...payload
      });
      if (!data || data.success === false) {
        return rejectWithValue(data.message || 'Approval request failed');
      }
      return { invoiceId, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().aeInvoice.loading.approve) return false;
    }
  }
);

/**
 * Reject HK Material Invoice
 */
export const rejectAEInvoice = createAsyncThunk(
  'aeInvoice/rejectAEInvoice',
  async ({ invoiceId, payload }, { rejectWithValue }) => {
    try {
      if (!invoiceId) return rejectWithValue('Invoice ID is required');
      const data = await aeInvoiceService.submitAEDecision(invoiceId, {
        decision: 'Rejected',
        ...payload
      });
      if (!data || data.success === false) {
        return rejectWithValue(data.message || 'Rejection request failed');
      }
      return { invoiceId, data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().aeInvoice.loading.reject) return false;
    }
  }
);

// ─── Slice Configuration ──────────────────────────────────────────────

const initialState = {
  invoices: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5
  },
  loading: {
    fetch: false,
    approve: false,
    reject: false
  },
  errors: {
    fetch: null,
    approve: null,
    reject: null
  }
};

const aeInvoiceSlice = createSlice({
  name: 'aeInvoice',
  initialState,
  reducers: {
    clearAEStoreErrors: (state) => {
      state.errors = {
        fetch: null,
        approve: null,
        reject: null
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch queue
      .addCase(fetchAEPendingInvoices.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchAEPendingInvoices.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.invoices = action.payload.invoices || [];
        state.pagination = action.payload.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize: 5
        };
      })
      .addCase(fetchAEPendingInvoices.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
        state.invoices = [];
      })

      // Approve invoice
      .addCase(approveAEInvoice.pending, (state) => {
        state.loading.approve = true;
        state.errors.approve = null;
      })
      .addCase(approveAEInvoice.fulfilled, (state, action) => {
        state.loading.approve = false;
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload.invoiceId);
      })
      .addCase(approveAEInvoice.rejected, (state, action) => {
        state.loading.approve = false;
        state.errors.approve = action.payload;
      })

      // Reject invoice
      .addCase(rejectAEInvoice.pending, (state) => {
        state.loading.reject = true;
        state.errors.reject = null;
      })
      .addCase(rejectAEInvoice.fulfilled, (state, action) => {
        state.loading.reject = false;
        state.invoices = state.invoices.filter(inv => inv.id !== action.payload.invoiceId);
      })
      .addCase(rejectAEInvoice.rejected, (state, action) => {
        state.loading.reject = false;
        state.errors.reject = action.payload;
      });
  }
});

export const { clearAEStoreErrors } = aeInvoiceSlice.actions;
export default aeInvoiceSlice.reducer;
