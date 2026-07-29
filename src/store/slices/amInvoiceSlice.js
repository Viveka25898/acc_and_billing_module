import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as amInvoiceService from '../../Features/PurchaseBookingHKMaterial/Services/amInvoiceService';

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
 * Fetch AM Pending Invoices queue
 */
export const fetchAMPendingInvoices = createAsyncThunk(
  'amInvoice/fetchAMPendingInvoices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await amInvoiceService.fetchAMPending(params);
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
 * Approve Material Invoice
 */
export const approveAMInvoice = createAsyncThunk(
  'amInvoice/approveAMInvoice',
  async ({ invoiceId, payload }, { rejectWithValue }) => {
    try {
      if (!invoiceId) return rejectWithValue('Invoice ID is required');
      const data = await amInvoiceService.submitAMDecision(invoiceId, {
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
      if (getState().amInvoice.loading.approve) return false;
    }
  }
);

/**
 * Reject Material Invoice
 */
export const rejectAMInvoice = createAsyncThunk(
  'amInvoice/rejectAMInvoice',
  async ({ invoiceId, payload }, { rejectWithValue }) => {
    try {
      if (!invoiceId) return rejectWithValue('Invoice ID is required');
      const data = await amInvoiceService.submitAMDecision(invoiceId, {
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
      if (getState().amInvoice.loading.reject) return false;
    }
  }
);

/**
 * Fetch Purchase Voucher Details
 */
export const fetchPurchaseVoucherDetails = createAsyncThunk(
  'amInvoice/fetchPurchaseVoucherDetails',
  async (invoiceId, { rejectWithValue }) => {
    try {
      if (!invoiceId) return rejectWithValue('Invoice ID is required');
      const data = await amInvoiceService.fetchPurchaseVoucher(invoiceId);
      if (!data || data.success === false) {
        return rejectWithValue(data.message || 'Failed to fetch purchase voucher details');
      }
      return { invoiceId, data: data.voucherDetails || data.data };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
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
  vouchers: {}, // Map of invoiceId -> voucherDetails
  loading: {
    fetch: false,
    approve: false,
    reject: false,
    voucher: {} // Map of invoiceId -> boolean
  },
  errors: {
    fetch: null,
    approve: null,
    reject: null,
    voucher: {} // Map of invoiceId -> string
  }
};

const amInvoiceSlice = createSlice({
  name: 'amInvoice',
  initialState,
  reducers: {
    clearAMStoreErrors: (state) => {
      state.errors = {
        fetch: null,
        approve: null,
        reject: null,
        voucher: {}
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch queue
      .addCase(fetchAMPendingInvoices.pending, (state) => {
        state.loading.fetch = true;
        state.errors.fetch = null;
      })
      .addCase(fetchAMPendingInvoices.fulfilled, (state, action) => {
        state.loading.fetch = false;
        const responseData = action.payload?.data || action.payload;
        state.invoices = responseData?.invoices || [];
        state.pagination = responseData?.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize: 5
        };
      })
      .addCase(fetchAMPendingInvoices.rejected, (state, action) => {
        state.loading.fetch = false;
        state.errors.fetch = action.payload;
        state.invoices = [];
      })

      // Approve invoice
      .addCase(approveAMInvoice.pending, (state) => {
        state.loading.approve = true;
        state.errors.approve = null;
      })
      .addCase(approveAMInvoice.fulfilled, (state, action) => {
        state.loading.approve = false;
        // Update list status to show approved
        const { invoiceId, data } = action.payload;
        state.invoices = state.invoices.map((inv) => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              accountManagerStatus: 'Approved',
              finalStatus: 'GL Posted - Completed',
              accountingDetails: data.accountingDetails
            };
          }
          return inv;
        });
      })
      .addCase(approveAMInvoice.rejected, (state, action) => {
        state.loading.approve = false;
        state.errors.approve = action.payload;
      })

      // Reject invoice
      .addCase(rejectAMInvoice.pending, (state) => {
        state.loading.reject = true;
        state.errors.reject = null;
      })
      .addCase(rejectAMInvoice.fulfilled, (state, action) => {
        state.loading.reject = false;
        const { invoiceId } = action.payload;
        state.invoices = state.invoices.map((inv) => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              accountManagerStatus: 'Rejected',
              finalStatus: 'Rejected by Account Manager'
            };
          }
          return inv;
        });
      })
      .addCase(rejectAMInvoice.rejected, (state, action) => {
        state.loading.reject = false;
        state.errors.reject = action.payload;
      })

      // Fetch Purchase Voucher
      .addCase(fetchPurchaseVoucherDetails.pending, (state, action) => {
        const invoiceId = action.meta.arg;
        state.loading.voucher[invoiceId] = true;
        state.errors.voucher[invoiceId] = null;
      })
      .addCase(fetchPurchaseVoucherDetails.fulfilled, (state, action) => {
        const { invoiceId, data } = action.payload;
        state.loading.voucher[invoiceId] = false;
        state.vouchers[invoiceId] = data;
      })
      .addCase(fetchPurchaseVoucherDetails.rejected, (state, action) => {
        const invoiceId = action.meta.arg;
        state.loading.voucher[invoiceId] = false;
        state.errors.voucher[invoiceId] = action.payload;
      });
  }
});

export const { clearAMStoreErrors } = amInvoiceSlice.actions;
export default amInvoiceSlice.reducer;
