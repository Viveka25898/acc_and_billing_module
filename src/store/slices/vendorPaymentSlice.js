import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as vendorService from '../../Features/Process For Payments/services/vendorPaymentService'

const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred'
  if (typeof error === 'string') return error
  if (error.response?.data?.message) return error.response.data.message
  if (error.message) return error.message
  return 'An unexpected error occurred'
}

export const fetchPendingVendorPayments = createAsyncThunk(
  'vendorPayment/fetchPendingVendorPayments',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await vendorService.fetchPendingVendorPayments(params)
      return data
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

export const generateVendorPaymentFiles = createAsyncThunk(
  'vendorPayment/generateVendorPaymentFiles',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await vendorService.generateVendorPaymentFiles(payload)
      return data
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

const initialState = {
  pendingVendors: [],
  summary: {
    totalVendors: 0,
    totalAmount: 0,
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20,
  },
  loading: false,
  error: null,
  fileGenerating: false,
  currentBatchId: null,
  downloads: null,
  fileGenError: null,
}

const vendorPaymentSlice = createSlice({
  name: 'vendorPayment',
  initialState,
  reducers: {
    clearVendorPaymentError: (state) => {
      state.error = null
      state.fileGenError = null
    },
    setPendingVendors: (state, action) => {
      state.pendingVendors = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPendingVendorPayments
      .addCase(fetchPendingVendorPayments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPendingVendorPayments.fulfilled, (state, action) => {
        state.loading = false
        const payload = action.payload || {}
        state.pendingVendors = payload.vendors || []
        state.summary = {
          totalVendors: payload.summary?.totalVendors || payload.vendors?.length || 0,
          totalAmount: parseFloat(payload.summary?.totalAmount || 0) || 0,
        }
        state.pagination = {
          currentPage: payload.pagination?.currentPage || 1,
          totalPages: payload.pagination?.totalPages || 1,
          totalItems: payload.pagination?.totalItems || payload.vendors?.length || 0,
          pageSize: payload.pagination?.pageSize || 20,
        }
      })
      .addCase(fetchPendingVendorPayments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload || 'Failed to fetch pending vendor payments'
      })

      // generateVendorPaymentFiles
      .addCase(generateVendorPaymentFiles.pending, (state) => {
        state.fileGenerating = true
        state.fileGenError = null
      })
      .addCase(generateVendorPaymentFiles.fulfilled, (state, action) => {
        state.fileGenerating = false
        state.currentBatchId = action.payload?.batchId || null
        state.downloads = action.payload?.downloads || null
      })
      .addCase(generateVendorPaymentFiles.rejected, (state, action) => {
        state.fileGenerating = false
        state.fileGenError = action.payload || 'Failed to generate vendor payment files'
      })
  },
})

export const { clearVendorPaymentError, setPendingVendors } = vendorPaymentSlice.actions
export default vendorPaymentSlice.reducer
