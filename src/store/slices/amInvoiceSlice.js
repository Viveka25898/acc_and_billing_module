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

// ─── Voucher Normalizer Helper ───────────────────────────────────────

/**
 * Normalizes purchase voucher data from either:
 * 1) GET /accounts/invoices/:id/purchase-voucher (contains voucherDetails)
 * 2) POST /accounts/invoices/:id/am-decision approval response (contains accountingDetails)
 * Supports both Fixed Asset and Material invoices with defensive parsing and type detection.
 */
export const normalizeVoucherData = (raw, invoiceContext = {}) => {
  if (!raw) return null;

  try {
    const details = raw.voucherDetails || raw.accountingDetails || raw;
    const rawBreakdown = details.breakdown || raw.breakdown || {};
    const rawEntries = details.entries || details.glEntries || raw.entries || raw.glEntries || [];
    const rawTotals = details.totals || raw.totals || {};

    const totalAmount =
      details.totalAmount !== undefined ? details.totalAmount :
      rawBreakdown.total !== undefined ? rawBreakdown.total :
      raw.totalAmount !== undefined ? raw.totalAmount :
      invoiceContext.totalAmount || '0.00';

    // Normalize journal entries
    const entries = (Array.isArray(rawEntries) ? rawEntries : []).map((entry, index) => ({
      lineNo: entry.lineNo ?? index + 1,
      glCode: entry.glCode || '-',
      glName: entry.glName || '-',
      debit: entry.debit !== undefined ? String(entry.debit) : '0.00',
      credit: entry.credit !== undefined ? String(entry.credit) : '0.00',
      narration: entry.narration || ''
    }));

    // Calculate totals from entries if raw totals are not provided
    const calcDebit = entries.reduce((sum, e) => sum + parseFloat(e.debit || 0), 0);
    const calcCredit = entries.reduce((sum, e) => sum + parseFloat(e.credit || 0), 0);
    const fallbackTotal = String(rawBreakdown.total || totalAmount || '0.00');
    const totalDebit = rawTotals.totalDebit !== undefined ? String(rawTotals.totalDebit) : (calcDebit > 0 ? calcDebit.toFixed(2) : fallbackTotal);
    const totalCredit = rawTotals.totalCredit !== undefined ? String(rawTotals.totalCredit) : (calcCredit > 0 ? calcCredit.toFixed(2) : fallbackTotal);
    const difference = rawTotals.difference !== undefined ? String(rawTotals.difference) : Math.abs(parseFloat(totalDebit) - parseFloat(totalCredit)).toFixed(2);

    // Auto-detect Fixed Asset vs Material
    const isFixedAsset =
      invoiceContext.type === 'Fixed Asset' ||
      invoiceContext.type === 'FIXED_ASSET' ||
      Boolean(invoiceContext.assetDetails) ||
      (typeof raw.message === 'string' && raw.message.toLowerCase().includes('fixed asset')) ||
      (typeof details.narration === 'string' && details.narration.toLowerCase().includes('fixed asset')) ||
      (typeof details.message === 'string' && details.message.toLowerCase().includes('fixed asset')) ||
      entries.some(
        (e) =>
          (typeof e.glCode === 'string' && (e.glCode.includes('_FA') || e.glCode.startsWith('A1'))) ||
          (typeof e.narration === 'string' &&
            (e.narration.toLowerCase().includes('fixed asset') || e.narration.toLowerCase().includes('capitalised')))
      );

    // Extract vendor name if not explicitly provided
    const creditorEntry = entries.find(e => parseFloat(e.credit || 0) > 0 || (e.glCode && e.glCode.startsWith('L2')));
    const inferredVendorName = creditorEntry?.glName
      ? creditorEntry.glName.replace(/\s*-\s*Sundry Creditor/i, '').trim()
      : null;
    const vendorName = details.vendorName || invoiceContext.vendorName || inferredVendorName || '-';

    return {
      invoiceId: raw.invoiceId || invoiceContext.id || details.invoiceId || '',
      invoiceNumber: raw.invoiceNumber || details.invoiceRef || invoiceContext.invoiceNumber || '-',
      voucherNo: details.voucherNo || raw.voucherNo || '-',
      transactionId: details.transactionId || raw.transactionId || '-',
      voucherType: details.voucherType || (isFixedAsset ? 'FIXED ASSET PURCHASE' : 'PURCHASE'),
      voucherDate: details.voucherDate || raw.voucherDate || new Date().toISOString().split('T')[0],
      financialYear: details.financialYear || raw.financialYear || '',
      vendorName,
      vendorGLCode: details.vendorGLCode || raw.vendorGLCode || creditorEntry?.glCode || '-',
      invoiceRef: details.invoiceRef || raw.invoiceNumber || invoiceContext.invoiceNumber || '-',
      totalAmount: String(totalAmount),
      breakdown: {
        total: String(rawBreakdown.total || totalAmount),
        taxable: String(rawBreakdown.taxable || '0.00'),
        cgst: String(rawBreakdown.cgst || '0.00'),
        sgst: String(rawBreakdown.sgst || '0.00'),
        igst: String(rawBreakdown.igst || '0.00'),
        gstRate: rawBreakdown.gstRate !== undefined ? Number(rawBreakdown.gstRate) : 0
      },
      entries,
      totals: {
        totalDebit,
        totalCredit,
        difference
      },
      tds: details.tds || raw.tds || null,
      narration: details.narration || raw.message || 'Invoice GL entries posted',
      status: details.status || raw.status || 'POSTED',
      approvedBy: raw.approvedBy || details.approvedBy || null,
      postedAt: raw.approvedAt || details.postedAt || details.voucherDate || new Date().toISOString(),
      isFixedAsset
    };
  } catch (err) {
    console.error('Error normalizing voucher data:', err);
    return raw;
  }
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
        return rejectWithValue(data?.message || 'Failed to fetch pending invoices');
      }
      return data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

/**
 * Approve Invoice (Handles both Material and Fixed Asset invoices)
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
        return rejectWithValue(data?.message || 'Approval request failed');
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
 * Reject Invoice
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
        return rejectWithValue(data?.message || 'Rejection request failed');
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
 * Fetch Purchase Voucher Details (Supports both Material & Fixed Asset)
 */
export const fetchPurchaseVoucherDetails = createAsyncThunk(
  'amInvoice/fetchPurchaseVoucherDetails',
  async (invoiceId, { rejectWithValue }) => {
    try {
      if (!invoiceId) return rejectWithValue('Invoice ID is required');
      const data = await amInvoiceService.fetchPurchaseVoucher(invoiceId);
      if (!data || data.success === false) {
        return rejectWithValue(data?.message || 'Failed to fetch purchase voucher details');
      }
      return { invoiceId, data };
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
  vouchers: {}, // Map of invoiceId -> normalized voucherDetails
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
        const rawPag = responseData?.pagination || {};
        state.pagination = {
          currentPage: rawPag.currentPage || rawPag.page || 1,
          totalPages: rawPag.totalPages || rawPag.pages || 1,
          totalItems: rawPag.totalItems || rawPag.total || 0,
          pageSize: rawPag.pageSize || rawPag.limit || 5
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
        const { invoiceId, data } = action.payload;
        
        // Find existing invoice context
        const existingInv = state.invoices.find((inv) => inv.id === invoiceId) || {};

        // Update list status to show approved
        state.invoices = state.invoices.map((inv) => {
          if (inv.id === invoiceId) {
            return {
              ...inv,
              accountManagerStatus: 'Approved',
              finalStatus: data?.status || 'GL Posted - Completed',
              status: data?.status || 'GL Posted - Completed',
              accountingDetails: data?.accountingDetails
            };
          }
          return inv;
        });

        // Instant caching: if approval response returned accountingDetails, normalize and store in vouchers map
        if (data?.accountingDetails) {
          state.vouchers[invoiceId] = normalizeVoucherData(data, existingInv);
        }
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
              finalStatus: 'Rejected by Account Manager',
              status: 'Rejected by Account Manager'
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
        const existingInv = state.invoices.find((inv) => inv.id === invoiceId) || {};
        state.vouchers[invoiceId] = normalizeVoucherData(data, existingInv);
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
