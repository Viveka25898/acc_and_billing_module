/**
 * advanceRequestSlice.js
 * ─────────────────────────
 * Redux slice for the entire Advance Request workflow.
 *
 * STATE SHAPE:
 *   myRequests       — logged-in user's own submitted requests
 *   managerRequests  — requests for Line Manager approval queue
 *   vpRequests       — requests for VP Operations approval queue
 *   aeRequests       — requests for Account Executive approval queue
 *   loading          — per-thunk loading flags
 *   error            — per-thunk error messages
 *   isBeforeDeadline — server-sourced flag (from VP/AE fetch)
 *   submitResult     — result after a form submission
 *
 * ASYNC THUNKS (all backed by advanceRequestService.js):
 *   fetchMyRequests          | fetchManagerApprovalRequests
 *   fetchVPApprovalRequests  | fetchAEApprovalRequests
 *   createAdvanceRequest     | submitClarificationThunk
 *   managerApprove           | managerReject
 *   vpApprove                | vpReject
 *   aeApprove                | aeApproveBatchThunk  | aeReject
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as service from '../../Features/Advance Request/services/advanceRequestService'

// ─── Error Handling Helper ───────────────────────────────────────────────────
/**
 * Safe error extraction from API response or Error object
 * Priority: error.message > error.errorMessage > generic fallback
 */
const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred'
  
  // If it's already a string (from rejectWithValue)
  if (typeof error === 'string') return error
  
  // If it's an Error object
  if (error instanceof Error) return error.message
  
  // If it's a validation error with custom format
  if (error.errorMessage) return error.errorMessage
  
  // Fallback
  return error.message || 'An unexpected error occurred'
}

/** Fetch the logged-in user's own requests */
export const fetchMyRequests = createAsyncThunk(
  'advanceRequest/fetchMyRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchMyRequests(params)
      // Validate API response shape
      if (!result?.requests || !Array.isArray(result.requests)) {
        return rejectWithValue('Invalid API response: missing requests array')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

/** Fetch requests for Line Manager approval queue */
export const fetchManagerApprovalRequests = createAsyncThunk(
  'advanceRequest/fetchManagerApprovalRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchManagerApprovalRequests(params)
      // Validate API response shape
      if (!result?.requests || !Array.isArray(result.requests)) {
        return rejectWithValue('Invalid API response: missing requests array')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

/** Fetch requests for VP Operations approval queue */
export const fetchVPApprovalRequests = createAsyncThunk(
  'advanceRequest/fetchVPApprovalRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await service.fetchVPApprovalRequests()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Fetch requests for Account Executive approval queue */
export const fetchAEApprovalRequests = createAsyncThunk(
  'advanceRequest/fetchAEApprovalRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await service.fetchAEApprovalRequests()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Fetch requests for AVP approval queue */
export const fetchAVPApprovalRequests = createAsyncThunk(
  'advanceRequest/fetchAVPApprovalRequests',
  async (_, { rejectWithValue }) => {
    try {
      return await service.fetchAVPApprovalRequests()
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Submit a new advance request */
export const createAdvanceRequest = createAsyncThunk(
  'advanceRequest/createAdvanceRequest',
  async (payload, { rejectWithValue }) => {
    try {
      console.log('🎬 Thunk: Starting createAdvanceRequest with payload:', payload)
      const result = await service.submitAdvanceRequest(payload)
      console.log('✅ Thunk: Service returned result:', result)
      // Validate required fields in response
      if (!result?.requestId || !result?.status) {
        console.error('❌ Thunk: Invalid API response - missing requestId or status')
        return rejectWithValue('Invalid API response: missing requestId or status')
      }
      console.log('✅ Thunk: Validation passed, returning result')
      return result
    } catch (err) {
      console.error('❌ Thunk: Error caught:', err)
      const errorMsg = extractErrorMessage(err)
      console.error('❌ Thunk: Extracted error message:', errorMsg)
      return rejectWithValue(errorMsg)
    }
  },
  {
    // ── Concurrent Request Guard ─────────────────────────────────────────
    // Prevent duplicate requests if user double-clicks submit button
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.submit) {
        console.warn('⚠️ Thunk: Already submitting, blocking duplicate request')
        return false  // ← Block if already submitting
      }
    }
  }
)

/** Submit clarification after rejection */
export const submitClarificationThunk = createAsyncThunk(
  'advanceRequest/submitClarification',
  async ({ requestId, clarification }, { rejectWithValue }) => {
    try {
      if (!requestId) {
        return rejectWithValue('Request ID is required')
      }
      if (!clarification || clarification.trim().length === 0) {
        return rejectWithValue('Clarification text is required')
      }
      const result = await service.submitClarification({ requestId, clarification })
      if (!result?.status || !result?.requestId) {
        return rejectWithValue('Invalid API response: missing status or requestId')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

/** Line Manager approves request */
export const managerApprove = createAsyncThunk(
  'advanceRequest/managerApprove',
  async ({ id, comments = 'Approved' }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Advance ID is required')
      const result = await service.managerApproveRequest({ id, comments })
      if (!result?.status) return rejectWithValue('Invalid API response: missing status')
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.managerApprove) return false
    }
  }
)

/** Line Manager rejects request */
export const managerReject = createAsyncThunk(
  'advanceRequest/managerReject',
  async ({ id, comments, rejectionReason }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Advance ID is required')
      if (!comments || !comments.trim()) return rejectWithValue('Rejection comments are required')
      if (!rejectionReason || !rejectionReason.trim()) return rejectWithValue('Rejection reason is required')
      const result = await service.managerRejectRequest({ id, comments, rejectionReason })
      if (!result?.status) return rejectWithValue('Invalid API response: missing status')
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.managerReject) return false
    }
  }
)

/** VP Operations approves request */
export const vpApprove = createAsyncThunk(
  'advanceRequest/vpApprove',
  async ({ id }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Advance ID is required')
      }
      const result = await service.vpApproveRequest({ id })
      if (!result?.status) {
        return rejectWithValue('Invalid API response: missing status')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.vpApprove) return false
    }
  }
)

/** VP Operations rejects request */
export const vpReject = createAsyncThunk(
  'advanceRequest/vpReject',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Advance ID is required')
      }
      if (!remarks || remarks.trim().length === 0) {
        return rejectWithValue('Rejection remarks are required')
      }
      const result = await service.vpRejectRequest({ id, comments: remarks, rejectionReason: remarks })
      if (!result?.status) {
        return rejectWithValue('Invalid API response: missing status')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.vpReject) return false
    }
  }
)

/** AVP Operations approves request */
export const avpApprove = createAsyncThunk(
  'advanceRequest/avpApprove',
  async ({ id }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Advance ID is required')
      }
      const result = await service.avpApproveRequest({ id })
      if (!result?.status) {
        return rejectWithValue('Invalid API response: missing status')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.avpApprove) return false
    }
  }
)

/** AVP Operations rejects request */
export const avpReject = createAsyncThunk(
  'advanceRequest/avpReject',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Advance ID is required')
      }
      if (!remarks || remarks.trim().length === 0) {
        return rejectWithValue('Rejection remarks are required')
      }
      const result = await service.avpRejectRequest({ id, comments: remarks, rejectionReason: remarks })
      if (!result?.status) {
        return rejectWithValue('Invalid API response: missing status')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.avpReject) return false
    }
  }
)

/** Account Executive approves single request */
export const aeApprove = createAsyncThunk(
  'advanceRequest/aeApprove',
  async ({ id, bankId, bankCode, bankName, comments, costCenterId }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Advance ID is required')
      }
      if (!bankId || !bankCode || !bankName) {
        return rejectWithValue('Bank details (ID, code, name) are required')
      }
      const result = await service.aeApproveRequest({ id, bankId, bankCode, bankName, comments, costCenterId })
      if (!result?.status) {
        return rejectWithValue('Invalid API response: missing status')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.aeApprove) return false
    }
  }
)

/** Account Executive approves multiple requests (batch) */
export const aeApproveBatchThunk = createAsyncThunk(
  'advanceRequest/aeApproveBatch',
  async ({ requestIds, bankId, bankCode, bankName, comments, costCenterId }, { rejectWithValue }) => {
    try {
      if (!requestIds || requestIds.length === 0) {
        return rejectWithValue('At least one request ID is required')
      }
      if (!bankId || !bankCode || !bankName) {
        return rejectWithValue('Bank details (ID, code, name) are required')
      }
      const result = await service.aeApproveBatch({ requestIds, bankId, bankCode, bankName, comments, costCenterId })
      if (!result?.approvedRequests || !Array.isArray(result.approvedRequests)) {
        return rejectWithValue('Invalid API response: missing approvedRequests array')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.aeApproveBatch) return false
    }
  }
)

/** Account Executive rejects request */
export const aeReject = createAsyncThunk(
  'advanceRequest/aeReject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      if (!id) {
        return rejectWithValue('Advance ID is required')
      }
      if (!reason || reason.trim().length === 0) {
        return rejectWithValue('Rejection reason is required')
      }
      const result = await service.aeRejectRequest({ id, reason })
      if (!result?.status) {
        return rejectWithValue('Invalid API response: missing status')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.aeReject) return false
    }
  }
)

// ─── Initial State ─────────────────────────────────────────────────────────────
const initialState = {
  // Data
  myRequests: [],
  managerRequests: [],
  avpRequests: [],
  vpRequests: [],
  aeRequests: [],

  // Pagination (my-requests)
  pagination: { currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 5 },

  // UI flags
  isBeforeDeadline: true,

  // Per-thunk loading flags
  loading: {
    fetchMyRequests: false,
    fetchManagerRequests: false,
    fetchAVPRequests: false,
    fetchVPRequests: false,
    fetchAERequests: false,
    submit: false,
    clarification: false,
    managerApprove: false,
    managerReject: false,
    avpApprove: false,
    avpReject: false,
    vpApprove: false,
    vpReject: false,
    aeApprove: false,
    aeApproveBatch: false,
    aeReject: false,
  },

  // Per-thunk error messages
  errors: {
    fetchMyRequests: null,
    fetchManagerRequests: null,
    fetchAVPRequests: null,
    fetchVPRequests: null,
    fetchAERequests: null,
    submit: null,
    clarification: null,
    approve: null,
    reject: null,
  },

  // After form submit — used to show success screen
  submitResult: null,
}

// ─── Slice ─────────────────────────────────────────────────────────────────────
const advanceRequestSlice = createSlice({
  name: 'advanceRequest',
  initialState,
  reducers: {
    /** Reset the submit result (e.g. to allow another submission) */
    clearSubmitResult: (state) => {
      state.submitResult = null
      state.errors.submit = null
    },
    /** Clear all errors */
    clearErrors: (state) => {
      state.errors = { ...initialState.errors }
    },
    /** Manually refresh a single request in the manager queue (optimistic update) */
    removeFromManagerQueue: (state, action) => {
      state.managerRequests = state.managerRequests.filter(
        (r) => r.requestId !== action.payload
      )
    },
    removeFromAVPQueue: (state, action) => {
      state.avpRequests = state.avpRequests.filter(
        (r) => r.requestId !== action.payload
      )
    },
    removeFromVPQueue: (state, action) => {
      state.vpRequests = state.vpRequests.filter(
        (r) => r.requestId !== action.payload
      )
    },
    removeFromAEQueue: (state, action) => {
      state.aeRequests = state.aeRequests.filter(
        (r) => r.requestId !== action.payload
      )
    },
  },

  extraReducers: (builder) => {
    // ── fetchMyRequests ─────────────────────────────────────────────────────
    builder
      .addCase(fetchMyRequests.pending, (state) => {
        state.loading.fetchMyRequests = true
        state.errors.fetchMyRequests = null
      })
      .addCase(fetchMyRequests.fulfilled, (state, action) => {
        state.loading.fetchMyRequests = false
        // Safe assignment with fallback to empty array
        state.myRequests = action.payload?.requests || []
        // Update pagination, default to first page if missing
        state.pagination = {
          currentPage: action.payload?.pagination?.currentPage || 1,
          totalPages: action.payload?.pagination?.totalPages || 1,
          totalItems: action.payload?.pagination?.totalItems || 0,
          pageSize: action.payload?.pagination?.pageSize || 5,
        }
      })
      .addCase(fetchMyRequests.rejected, (state, action) => {
        state.loading.fetchMyRequests = false
        state.errors.fetchMyRequests = extractErrorMessage(action.payload)
      })

    // ── fetchManagerApprovalRequests ────────────────────────────────────────
    builder
      .addCase(fetchManagerApprovalRequests.pending, (state) => {
        state.loading.fetchManagerRequests = true
        state.errors.fetchManagerRequests = null
      })
      .addCase(fetchManagerApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchManagerRequests = false
        // Safe assignment with fallback to empty array
        state.managerRequests = action.payload?.requests || []
      })
      .addCase(fetchManagerApprovalRequests.rejected, (state, action) => {
        state.loading.fetchManagerRequests = false
        state.errors.fetchManagerRequests = extractErrorMessage(action.payload)
      })

    // ── fetchVPApprovalRequests ─────────────────────────────────────────────
    builder
      .addCase(fetchVPApprovalRequests.pending, (state) => {
        state.loading.fetchVPRequests = true
        state.errors.fetchVPRequests = null
      })
      .addCase(fetchVPApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchVPRequests = false
        state.vpRequests = action.payload?.requests || []
        state.isBeforeDeadline = action.payload?.isBeforeDeadline ?? true
      })
      .addCase(fetchVPApprovalRequests.rejected, (state, action) => {
        state.loading.fetchVPRequests = false
        state.errors.fetchVPRequests = extractErrorMessage(action.payload)
      })

    // ── fetchAEApprovalRequests ─────────────────────────────────────────────
    builder
      .addCase(fetchAEApprovalRequests.pending, (state) => {
        state.loading.fetchAERequests = true
        state.errors.fetchAERequests = null
      })
      .addCase(fetchAEApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchAERequests = false
        state.aeRequests = action.payload?.requests || []
        state.isBeforeDeadline = action.payload?.isBeforeDeadline ?? true
      })
      .addCase(fetchAEApprovalRequests.rejected, (state, action) => {
        state.loading.fetchAERequests = false
        state.errors.fetchAERequests = extractErrorMessage(action.payload)
      })

    // ── createAdvanceRequest ────────────────────────────────────────────────
    builder
      .addCase(createAdvanceRequest.pending, (state) => {
        state.loading.submit = true
        state.errors.submit = null
        state.submitResult = null
      })
      .addCase(createAdvanceRequest.fulfilled, (state, action) => {
        state.loading.submit = false
        // Store the result object for display in success screen
        state.submitResult = action.payload || {}
      })
      .addCase(createAdvanceRequest.rejected, (state, action) => {
        state.loading.submit = false
        state.errors.submit = extractErrorMessage(action.payload)
        state.submitResult = null
      })

    // ── submitClarificationThunk ────────────────────────────────────────────
    builder
      .addCase(submitClarificationThunk.pending, (state) => {
        state.loading.clarification = true
        state.errors.clarification = null
      })
      .addCase(submitClarificationThunk.fulfilled, (state, action) => {
        state.loading.clarification = false
        // Update the status in myRequests optimistically
        const idx = state.myRequests.findIndex(
          (r) => r?.requestId === action.payload?.requestId
        )
        if (idx !== -1 && state.myRequests[idx]) {
          state.myRequests[idx].status = action.payload?.status || 'Pending Manager Approval'
          state.myRequests[idx].clarification = action.meta.arg.clarification
        }
      })
      .addCase(submitClarificationThunk.rejected, (state, action) => {
        state.loading.clarification = false
        state.errors.clarification = extractErrorMessage(action.payload)
      })

    // ── managerApprove ──────────────────────────────────────────────────────
    builder
      .addCase(managerApprove.pending, (state) => {
        state.loading.managerApprove = true
        state.errors.approve = null
      })
      .addCase(managerApprove.fulfilled, (state, action) => {
        state.loading.managerApprove = false
        // Update status in-place — row stays visible until AE approves
        const idx = state.managerRequests.findIndex((r) => r.id === action.meta.arg.id)
        if (idx !== -1) {
          state.managerRequests[idx].status = action.payload?.status || 'Pending AVP Approval'
        }
      })
      .addCase(managerApprove.rejected, (state, action) => {
        state.loading.managerApprove = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ── managerReject ───────────────────────────────────────────────────────
    builder
      .addCase(managerReject.pending, (state) => {
        state.loading.managerReject = true
        state.errors.reject = null
      })
      .addCase(managerReject.fulfilled, (state, action) => {
        state.loading.managerReject = false
        // Update status in-place — row stays visible until AE approves
        const idx = state.managerRequests.findIndex((r) => r.id === action.meta.arg.id)
        if (idx !== -1) {
          state.managerRequests[idx].status = action.payload?.status || 'Rejected'
        }
      })
      .addCase(managerReject.rejected, (state, action) => {
        state.loading.managerReject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ── fetchAVPApprovalRequests ────────────────────────────────────────────
    builder
      .addCase(fetchAVPApprovalRequests.pending, (state) => {
        state.loading.fetchAVPRequests = true
        state.errors.fetchAVPRequests = null
      })
      .addCase(fetchAVPApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchAVPRequests = false
        state.avpRequests = action.payload?.requests || []
      })
      .addCase(fetchAVPApprovalRequests.rejected, (state, action) => {
        state.loading.fetchAVPRequests = false
        state.errors.fetchAVPRequests = extractErrorMessage(action.payload)
      })

    // ── avpApprove ───────────────────────────────────────────────────────────
    builder
      .addCase(avpApprove.pending, (state) => {
        state.loading.avpApprove = true
        state.errors.approve = null
      })
      .addCase(avpApprove.fulfilled, (state, action) => {
        state.loading.avpApprove = false
        const idx = state.avpRequests.findIndex((r) => r.id === action.meta.arg.id)
        if (idx !== -1) {
          state.avpRequests[idx].status = action.payload?.status || 'Pending VP Approval'
        }
      })
      .addCase(avpApprove.rejected, (state, action) => {
        state.loading.avpApprove = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ── avpReject ────────────────────────────────────────────────────────────
    builder
      .addCase(avpReject.pending, (state) => {
        state.loading.avpReject = true
        state.errors.reject = null
      })
      .addCase(avpReject.fulfilled, (state, action) => {
        state.loading.avpReject = false
        const idx = state.avpRequests.findIndex((r) => r.id === action.meta.arg.id)
        if (idx !== -1) {
          state.avpRequests[idx].status = action.payload?.status || 'Rejected'
        }
      })
      .addCase(avpReject.rejected, (state, action) => {
        state.loading.avpReject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ── vpApprove ───────────────────────────────────────────────────────────
    builder
      .addCase(vpApprove.pending, (state) => {
        state.loading.vpApprove = true
        state.errors.approve = null
      })
      .addCase(vpApprove.fulfilled, (state, action) => {
        state.loading.vpApprove = false
        const idx = state.vpRequests.findIndex((r) => r.id === action.meta.arg.id)
        if (idx !== -1) {
          state.vpRequests[idx].status = action.payload?.status || 'Pending Account Executive Approval'
        }
      })
      .addCase(vpApprove.rejected, (state, action) => {
        state.loading.vpApprove = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ── vpReject ────────────────────────────────────────────────────────────
    builder
      .addCase(vpReject.pending, (state) => {
        state.loading.vpReject = true
        state.errors.reject = null
      })
      .addCase(vpReject.fulfilled, (state, action) => {
        state.loading.vpReject = false
        const idx = state.vpRequests.findIndex((r) => r.id === action.meta.arg.id)
        if (idx !== -1) {
          state.vpRequests[idx].status = action.payload?.status || 'Rejected by VP Operations'
        }
      })
      .addCase(vpReject.rejected, (state, action) => {
        state.loading.vpReject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ── aeApprove ───────────────────────────────────────────────────────────
    builder
      .addCase(aeApprove.pending, (state) => {
        state.loading.aeApprove = true
        state.errors.approve = null
      })
      .addCase(aeApprove.fulfilled, (state, action) => {
        state.loading.aeApprove = false
        state.aeRequests = state.aeRequests.filter(
          (r) => r.id !== action.meta.arg.id
        )
      })
      .addCase(aeApprove.rejected, (state, action) => {
        state.loading.aeApprove = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ── aeApproveBatchThunk ─────────────────────────────────────────────────
    builder
      .addCase(aeApproveBatchThunk.pending, (state) => {
        state.loading.aeApproveBatch = true
        state.errors.approve = null
      })
      .addCase(aeApproveBatchThunk.fulfilled, (state, action) => {
        state.loading.aeApproveBatch = false
        const approvedIds = (action.payload?.approvedRequests || []).map((r) => r?.id).filter(Boolean)
        state.aeRequests = state.aeRequests.filter(
          (r) => !approvedIds.includes(r.id)
        )
      })
      .addCase(aeApproveBatchThunk.rejected, (state, action) => {
        state.loading.aeApproveBatch = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ── aeReject ────────────────────────────────────────────────────────────
    builder
      .addCase(aeReject.pending, (state) => {
        state.loading.aeReject = true
        state.errors.reject = null
      })
      .addCase(aeReject.fulfilled, (state, action) => {
        state.loading.aeReject = false
        state.aeRequests = state.aeRequests.filter(
          (r) => r.id !== action.meta.arg.id
        )
      })
      .addCase(aeReject.rejected, (state, action) => {
        state.loading.aeReject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })
  },
})

// ─── Named Actions ─────────────────────────────────────────────────────────────
export const {
  clearSubmitResult,
  clearErrors,
  removeFromManagerQueue,
  removeFromAVPQueue,
  removeFromVPQueue,
  removeFromAEQueue,
} = advanceRequestSlice.actions

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectMyRequests     = (state) => state.advanceRequest?.myRequests || []
export const selectManagerRequests = (state) => state.advanceRequest?.managerRequests || []
export const selectAVPRequests    = (state) => state.advanceRequest?.avpRequests || []
export const selectVPRequests     = (state) => state.advanceRequest?.vpRequests || []
export const selectAERequests     = (state) => state.advanceRequest?.aeRequests || []
export const selectSubmitResult   = (state) => state.advanceRequest?.submitResult || null
export const selectIsBeforeDeadline = (state) => state.advanceRequest?.isBeforeDeadline ?? true
export const selectLoading        = (state) => state.advanceRequest?.loading || {}
export const selectErrors         = (state) => state.advanceRequest?.errors || {}
export const selectPagination     = (state) => state.advanceRequest?.pagination || {}

export default advanceRequestSlice.reducer
