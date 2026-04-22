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

// ─── Async Thunks ─────────────────────────────────────────────────────────────

/** Fetch the logged-in user's own requests */
export const fetchMyRequests = createAsyncThunk(
  'advanceRequest/fetchMyRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await service.fetchMyRequests(params)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Fetch requests for Line Manager approval queue */
export const fetchManagerApprovalRequests = createAsyncThunk(
  'advanceRequest/fetchManagerApprovalRequests',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await service.fetchManagerApprovalRequests(params)
    } catch (err) {
      return rejectWithValue(err.message)
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

/** Submit a new advance request */
export const createAdvanceRequest = createAsyncThunk(
  'advanceRequest/createAdvanceRequest',
  async (payload, { rejectWithValue }) => {
    try {
      return await service.submitAdvanceRequest(payload)
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    // ── Concurrent Request Guard ─────────────────────────────────────────
    // Prevent duplicate requests if user double-clicks submit button
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.submit) {
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
      return await service.submitClarification({ requestId, clarification })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Line Manager approves request */
export const managerApprove = createAsyncThunk(
  'advanceRequest/managerApprove',
  async ({ requestId }, { rejectWithValue }) => {
    try {
      return await service.managerApproveRequest({ requestId })
    } catch (err) {
      return rejectWithValue(err.message)
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
  async ({ requestId, remarks }, { rejectWithValue }) => {
    try {
      return await service.managerRejectRequest({ requestId, remarks })
    } catch (err) {
      return rejectWithValue(err.message)
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
  async ({ requestId }, { rejectWithValue }) => {
    try {
      return await service.vpApproveRequest({ requestId })
    } catch (err) {
      return rejectWithValue(err.message)
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
  async ({ requestId, remarks }, { rejectWithValue }) => {
    try {
      return await service.vpRejectRequest({ requestId, remarks })
    } catch (err) {
      return rejectWithValue(err.message)
    }
  },
  {
    condition: (_, { getState }) => {
      const { loading } = getState().advanceRequest
      if (loading.vpReject) return false
    }
  }
)

/** Account Executive approves single request */
export const aeApprove = createAsyncThunk(
  'advanceRequest/aeApprove',
  async ({ requestId, bankId, bankCode, bankName }, { rejectWithValue }) => {
    try {
      return await service.aeApproveRequest({ requestId, bankId, bankCode, bankName })
    } catch (err) {
      return rejectWithValue(err.message)
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
  async ({ requestIds, bankId, bankCode, bankName }, { rejectWithValue }) => {
    try {
      return await service.aeApproveBatch({ requestIds, bankId, bankCode, bankName })
    } catch (err) {
      return rejectWithValue(err.message)
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
  async ({ requestId, reason }, { rejectWithValue }) => {
    try {
      return await service.aeRejectRequest({ requestId, reason })
    } catch (err) {
      return rejectWithValue(err.message)
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
    fetchVPRequests: false,
    fetchAERequests: false,
    submit: false,
    clarification: false,
    managerApprove: false,
    managerReject: false,
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
        state.myRequests = action.payload.requests
        state.pagination = action.payload.pagination || state.pagination
      })
      .addCase(fetchMyRequests.rejected, (state, action) => {
        state.loading.fetchMyRequests = false
        state.errors.fetchMyRequests = action.payload
      })

    // ── fetchManagerApprovalRequests ────────────────────────────────────────
    builder
      .addCase(fetchManagerApprovalRequests.pending, (state) => {
        state.loading.fetchManagerRequests = true
        state.errors.fetchManagerRequests = null
      })
      .addCase(fetchManagerApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchManagerRequests = false
        state.managerRequests = action.payload.requests
      })
      .addCase(fetchManagerApprovalRequests.rejected, (state, action) => {
        state.loading.fetchManagerRequests = false
        state.errors.fetchManagerRequests = action.payload
      })

    // ── fetchVPApprovalRequests ─────────────────────────────────────────────
    builder
      .addCase(fetchVPApprovalRequests.pending, (state) => {
        state.loading.fetchVPRequests = true
        state.errors.fetchVPRequests = null
      })
      .addCase(fetchVPApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchVPRequests = false
        state.vpRequests = action.payload.requests
        state.isBeforeDeadline = action.payload.isBeforeDeadline ?? true
      })
      .addCase(fetchVPApprovalRequests.rejected, (state, action) => {
        state.loading.fetchVPRequests = false
        state.errors.fetchVPRequests = action.payload
      })

    // ── fetchAEApprovalRequests ─────────────────────────────────────────────
    builder
      .addCase(fetchAEApprovalRequests.pending, (state) => {
        state.loading.fetchAERequests = true
        state.errors.fetchAERequests = null
      })
      .addCase(fetchAEApprovalRequests.fulfilled, (state, action) => {
        state.loading.fetchAERequests = false
        state.aeRequests = action.payload.requests
        state.isBeforeDeadline = action.payload.isBeforeDeadline ?? true
      })
      .addCase(fetchAEApprovalRequests.rejected, (state, action) => {
        state.loading.fetchAERequests = false
        state.errors.fetchAERequests = action.payload
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
        state.submitResult = action.payload
      })
      .addCase(createAdvanceRequest.rejected, (state, action) => {
        state.loading.submit = false
        state.errors.submit = action.payload
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
          (r) => r.requestId === action.payload.requestId
        )
        if (idx !== -1) {
          state.myRequests[idx].status = 'Pending Manager Approval'
          state.myRequests[idx].clarification = action.meta.arg.clarification
        }
      })
      .addCase(submitClarificationThunk.rejected, (state, action) => {
        state.loading.clarification = false
        state.errors.clarification = action.payload
      })

    // ── managerApprove ──────────────────────────────────────────────────────
    builder
      .addCase(managerApprove.pending, (state) => {
        state.loading.managerApprove = true
        state.errors.approve = null
      })
      .addCase(managerApprove.fulfilled, (state, action) => {
        state.loading.managerApprove = false
        // Remove from manager queue (optimistic)
        state.managerRequests = state.managerRequests.filter(
          (r) => r.requestId !== action.meta.arg.requestId
        )
      })
      .addCase(managerApprove.rejected, (state, action) => {
        state.loading.managerApprove = false
        state.errors.approve = action.payload
      })

    // ── managerReject ───────────────────────────────────────────────────────
    builder
      .addCase(managerReject.pending, (state) => {
        state.loading.managerReject = true
        state.errors.reject = null
      })
      .addCase(managerReject.fulfilled, (state, action) => {
        state.loading.managerReject = false
        state.managerRequests = state.managerRequests.filter(
          (r) => r.requestId !== action.meta.arg.requestId
        )
      })
      .addCase(managerReject.rejected, (state, action) => {
        state.loading.managerReject = false
        state.errors.reject = action.payload
      })

    // ── vpApprove ───────────────────────────────────────────────────────────
    builder
      .addCase(vpApprove.pending, (state) => {
        state.loading.vpApprove = true
        state.errors.approve = null
      })
      .addCase(vpApprove.fulfilled, (state, action) => {
        state.loading.vpApprove = false
        state.vpRequests = state.vpRequests.filter(
          (r) => r.requestId !== action.meta.arg.requestId
        )
      })
      .addCase(vpApprove.rejected, (state, action) => {
        state.loading.vpApprove = false
        state.errors.approve = action.payload
      })

    // ── vpReject ────────────────────────────────────────────────────────────
    builder
      .addCase(vpReject.pending, (state) => {
        state.loading.vpReject = true
        state.errors.reject = null
      })
      .addCase(vpReject.fulfilled, (state, action) => {
        state.loading.vpReject = false
        state.vpRequests = state.vpRequests.filter(
          (r) => r.requestId !== action.meta.arg.requestId
        )
      })
      .addCase(vpReject.rejected, (state, action) => {
        state.loading.vpReject = false
        state.errors.reject = action.payload
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
          (r) => r.requestId !== action.meta.arg.requestId
        )
      })
      .addCase(aeApprove.rejected, (state, action) => {
        state.loading.aeApprove = false
        state.errors.approve = action.payload
      })

    // ── aeApproveBatchThunk ─────────────────────────────────────────────────
    builder
      .addCase(aeApproveBatchThunk.pending, (state) => {
        state.loading.aeApproveBatch = true
        state.errors.approve = null
      })
      .addCase(aeApproveBatchThunk.fulfilled, (state, action) => {
        state.loading.aeApproveBatch = false
        const approvedIds = action.payload.approvedRequests.map((r) => r.requestId)
        state.aeRequests = state.aeRequests.filter(
          (r) => !approvedIds.includes(r.requestId)
        )
      })
      .addCase(aeApproveBatchThunk.rejected, (state, action) => {
        state.loading.aeApproveBatch = false
        state.errors.approve = action.payload
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
          (r) => r.requestId !== action.meta.arg.requestId
        )
      })
      .addCase(aeReject.rejected, (state, action) => {
        state.loading.aeReject = false
        state.errors.reject = action.payload
      })
  },
})

// ─── Named Actions ─────────────────────────────────────────────────────────────
export const {
  clearSubmitResult,
  clearErrors,
  removeFromManagerQueue,
  removeFromVPQueue,
  removeFromAEQueue,
} = advanceRequestSlice.actions

// ─── Selectors ─────────────────────────────────────────────────────────────────
export const selectMyRequests     = (state) => state.advanceRequest.myRequests
export const selectManagerRequests = (state) => state.advanceRequest.managerRequests
export const selectVPRequests     = (state) => state.advanceRequest.vpRequests
export const selectAERequests     = (state) => state.advanceRequest.aeRequests
export const selectSubmitResult   = (state) => state.advanceRequest.submitResult
export const selectIsBeforeDeadline = (state) => state.advanceRequest.isBeforeDeadline
export const selectLoading        = (state) => state.advanceRequest.loading
export const selectErrors         = (state) => state.advanceRequest.errors

export default advanceRequestSlice.reducer
