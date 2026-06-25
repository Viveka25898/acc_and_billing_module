/**
 * advanceSettlementSlice.js
 * ─────────────────────────
 * Redux slice for the entire Advance Settlement workflow.
 *
 * STATE SHAPE:
 *   osBalance          — logged-in employee's outstanding balance from API
 *   mySettlements      — logged-in user's submitted settlements (paginated)
 *   settlementDetail   — single settlement detail view
 *   approvalQueue      — queue for the currently logged-in approver (any role)
 *   submitResult       — result after a successful form submission
 *   loading            — per-thunk loading flags (prevents double-submit)
 *   errors             — per-thunk error messages
 *   pagination         — pagination for mySettlements
 *   queuePagination    — pagination for approval queues
 *   filters            — active filter state (status, date, page)
 *
 * ASYNC THUNKS (all backed by advanceSettlementService.js):
 *   fetchOsBalance           | downloadTemplate
 *   submitSettlement         | fetchMySettlements
 *   fetchSettlementById      | submitClarification
 *   fetchRhQueue             | approveRh   | rejectRh
 *   fetchAvpQueue            | approveAvp  | rejectAvp
 *   fetchVpQueue             | approveVp   | rejectVp
 *   fetchAeQueue             | approveAe   | rejectAe
 *   fetchAmQueue             | approveAm   | rejectAm
 *
 * PATTERN: Matches advanceRequestSlice.js exactly for consistency.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as service from '../../Features/Advance Settlement/services/advanceSettlementService'

// ─── Error Handling Helper ────────────────────────────────────────────────────
/**
 * Safe error extraction. Matches the same helper in advanceRequestSlice.js.
 * Priority: string → Error.message → errorMessage → generic fallback
 */
const extractErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred.'
  if (typeof error === 'string') return error
  if (error instanceof Error) return error.message
  if (error.errorMessage) return error.errorMessage
  return error.message || 'An unexpected error occurred.'
}


// ═══════════════════════════════════════════════════════════════════════════════
// ASYNC THUNKS
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Employee: OS Balance ─────────────────────────────────────────────────────
/**
 * Fetch the outstanding balance for the logged-in employee.
 * Dispatched on settlement form mount and after refreshing.
 */
export const fetchOsBalance = createAsyncThunk(
  'advanceSettlement/fetchOsBalance',
  async (employeeId, { rejectWithValue }) => {
    try {
      if (!employeeId || !String(employeeId).trim()) {
        return rejectWithValue('Employee ID is required to fetch OS balance.')
      }
      const result = await service.getOsBalance(employeeId)
      // result.osBalance can legitimately be 0 (no advance transactions) — don't reject on zero
      if (!result || typeof result !== 'object') {
        return rejectWithValue('Invalid OS balance response from server.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)


// ─── Employee: Download Template ──────────────────────────────────────────────
/**
 * Downloads the Excel template from the backend.
 * Component is responsible for triggering the browser download using the blob.
 */
export const downloadTemplate = createAsyncThunk(
  'advanceSettlement/downloadTemplate',
  async (_, { rejectWithValue }) => {
    try {
      const result = await service.downloadSettlementTemplate()
      if (!result?.blob) {
        return rejectWithValue('Template download failed: no file received from server.')
      }
      // Return blob URL info — component handles the actual download trigger
      return {
        blob: result.blob,
        fileName: result.fileName,
        contentType: result.contentType,
      }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    // Block if already downloading
    condition: (_, { getState }) => {
      const { loading } = getState().advanceSettlement
      if (loading.downloadTemplate) return false
    },
  }
)


// ─── Employee: Submit Settlement ──────────────────────────────────────────────
/**
 * Submits a new advance settlement with Excel file and attachments.
 * Concurrent request guard prevents double-submission.
 */
export const submitSettlement = createAsyncThunk(
  'advanceSettlement/submitSettlement',
  async ({ excelFile, attachments = [] }, { rejectWithValue }) => {
    try {
      if (!excelFile) {
        return rejectWithValue('Excel file is required to submit a settlement.')
      }
      const result = await service.createSettlement({ excelFile, attachments })
      if (!result?.settlementId || !result?.status) {
        return rejectWithValue('Invalid response: server did not return settlement ID or status.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    // Prevent duplicate submissions if user clicks submit twice
    condition: (_, { getState }) => {
      const { loading } = getState().advanceSettlement
      if (loading.submit) return false
    },
  }
)


// ─── Employee: Fetch My Settlements ───────────────────────────────────────────
/**
 * Fetches paginated list of settlements submitted by the logged-in user.
 */
export const fetchMySettlements = createAsyncThunk(
  'advanceSettlement/fetchMySettlements',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchMySettlements(params)
      if (!result || !Array.isArray(result.settlements)) {
        return rejectWithValue('Invalid API response: expected settlements array.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)


// ─── Shared: Fetch Settlement By ID ──────────────────────────────────────────
/**
 * Fetches full detail of a single settlement by its ID.
 * Used in detail modals / detail pages.
 */
export const fetchSettlementById = createAsyncThunk(
  'advanceSettlement/fetchSettlementById',
  async (settlementId, { rejectWithValue }) => {
    try {
      if (!settlementId) return rejectWithValue('Settlement ID is required.')
      const result = await service.fetchSettlementById(settlementId)
      if (!result?.settlementId) {
        return rejectWithValue('Invalid settlement data received from server.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)


// ─── Regional Head: Fetch Queue ───────────────────────────────────────────────
export const fetchRhQueue = createAsyncThunk(
  'advanceSettlement/fetchRhQueue',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchRegionalHeadQueue(params)
      if (!Array.isArray(result?.settlements)) {
        return rejectWithValue('Invalid API response: expected settlements array.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

// ─── Regional Head: Approve ───────────────────────────────────────────────────
export const approveRh = createAsyncThunk(
  'advanceSettlement/approveRh',
  async ({ id, remarks = 'Approved by Regional Head' }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      const result = await service.approveByRegionalHead({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.approve) return false
    },
  }
)

// ─── Regional Head: Reject ────────────────────────────────────────────────────
export const rejectRh = createAsyncThunk(
  'advanceSettlement/rejectRh',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      if (!remarks?.trim()) return rejectWithValue('Rejection remarks are required.')
      const result = await service.rejectByRegionalHead({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.reject) return false
    },
  }
)


// ─── AVP Operations: Fetch Queue ──────────────────────────────────────────────
export const fetchAvpQueue = createAsyncThunk(
  'advanceSettlement/fetchAvpQueue',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchAvpQueue(params)
      if (!Array.isArray(result?.settlements)) {
        return rejectWithValue('Invalid API response: expected settlements array.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

// ─── AVP: Approve ─────────────────────────────────────────────────────────────
export const approveAvp = createAsyncThunk(
  'advanceSettlement/approveAvp',
  async ({ id, remarks = 'Approved by AVP Operations' }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      const result = await service.approveByAvp({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.approve) return false
    },
  }
)

// ─── AVP: Reject ──────────────────────────────────────────────────────────────
export const rejectAvp = createAsyncThunk(
  'advanceSettlement/rejectAvp',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      if (!remarks?.trim()) return rejectWithValue('Rejection remarks are required.')
      const result = await service.rejectByAvp({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.reject) return false
    },
  }
)


// ─── VP Operations: Fetch Queue ───────────────────────────────────────────────
export const fetchVpQueue = createAsyncThunk(
  'advanceSettlement/fetchVpQueue',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchVpQueue(params)
      if (!Array.isArray(result?.settlements)) {
        return rejectWithValue('Invalid API response: expected settlements array.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

// ─── VP: Approve ──────────────────────────────────────────────────────────────
export const approveVp = createAsyncThunk(
  'advanceSettlement/approveVp',
  async ({ id, remarks = 'Approved by VP Operations' }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      const result = await service.approveByVp({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.approve) return false
    },
  }
)

// ─── VP: Reject ───────────────────────────────────────────────────────────────
export const rejectVp = createAsyncThunk(
  'advanceSettlement/rejectVp',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      if (!remarks?.trim()) return rejectWithValue('Rejection remarks are required.')
      const result = await service.rejectByVp({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.reject) return false
    },
  }
)


// ─── Account Executive: Fetch Queue ──────────────────────────────────────────
export const fetchAeQueue = createAsyncThunk(
  'advanceSettlement/fetchAeQueue',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchAeQueue(params)
      if (!Array.isArray(result?.settlements)) {
        return rejectWithValue('Invalid API response: expected settlements array.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

// ─── AE: Approve (Final) ──────────────────────────────────────────────────────
export const approveAe = createAsyncThunk(
  'advanceSettlement/approveAe',
  async ({ id, remarks, paymentMode, transactionRef, paymentDate, glEntries }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      const result = await service.approveByAe({ id, remarks, paymentMode, transactionRef, paymentDate, glEntries })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.approve) return false
    },
  }
)

// ─── AE: Reject ───────────────────────────────────────────────────────────────
export const rejectAe = createAsyncThunk(
  'advanceSettlement/rejectAe',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      if (!remarks?.trim()) return rejectWithValue('Rejection remarks are required.')
      const result = await service.rejectByAe({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.reject) return false
    },
  }
)


// ─── Employee: Submit Clarification ─────────────────────────────────────────
/**
 * Allows a rejected employee to provide clarification on their settlement.
 * On success the settlement status reverts to the previous approval level.
 * Double-submit guard prevents multiple in-flight requests.
 */
export const submitClarification = createAsyncThunk(
  'advanceSettlement/submitClarification',
  async ({ settlementId, clarification }, { rejectWithValue }) => {
    try {
      if (!settlementId) return rejectWithValue('Settlement ID is required.')
      if (!clarification?.trim()) return rejectWithValue('Clarification text is required.')
      const trimmed = clarification.trim()
      if (trimmed.length < 20) {
        return rejectWithValue(`Clarification must be at least 20 characters (currently ${trimmed.length}).`)
      }
      const result = await service.submitClarification(settlementId, clarification)
      if (!result?.success) {
        return rejectWithValue(result?.message || 'Failed to submit clarification.')
      }
      return { ...result, settlementId }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    // Prevent double-submission if employee clicks submit twice
    condition: (_, { getState }) => {
      const { loading } = getState().advanceSettlement
      if (loading.submitClarification) return false
    },
  }
)


// ─── Account Manager: Fetch Queue ────────────────────────────────────────────
export const fetchAmQueue = createAsyncThunk(
  'advanceSettlement/fetchAmQueue',
  async (params = {}, { rejectWithValue }) => {
    try {
      const result = await service.fetchAmQueue(params)
      if (!Array.isArray(result?.settlements)) {
        return rejectWithValue('Invalid API response: expected settlements array.')
      }
      return result
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  }
)

// ─── AM: Approve ──────────────────────────────────────────────────────────────
export const approveAm = createAsyncThunk(
  'advanceSettlement/approveAm',
  async ({ id, remarks = 'Approved by Account Manager' }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      const result = await service.approveByAm({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.approve) return false
    },
  }
)

// ─── AM: Reject ───────────────────────────────────────────────────────────────
export const rejectAm = createAsyncThunk(
  'advanceSettlement/rejectAm',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      if (!id) return rejectWithValue('Settlement ID is required.')
      if (!remarks?.trim()) return rejectWithValue('Rejection remarks are required.')
      const result = await service.rejectByAm({ id, remarks })
      return { ...result, id }
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err))
    }
  },
  {
    condition: (_, { getState }) => {
      if (getState().advanceSettlement.loading.reject) return false
    },
  }
)


// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════
const initialState = {
  // ── Employee Data ──────────────────────────────────────────────────────────
  osBalance: null,             // Normalized OS balance object from API
  mySettlements: [],           // Logged-in user's submitted settlements

  // ── Pagination for My Settlements ─────────────────────────────────────────
  pagination: {
    currentPage: 1,
    totalPages:  1,
    totalItems:  0,
    pageSize:    10,
  },

  // ── Settlement Detail (for modals / detail view) ───────────────────────────
  settlementDetail: null,

  // ── Approval Queue (shared across all approver roles) ─────────────────────
  approvalQueue: [],
  queuePagination: {
    currentPage: 1,
    totalPages:  1,
    totalItems:  0,
    pageSize:    10,
  },

  // ── Submit Result (success state after form submission) ────────────────────
  submitResult: null,    // { settlementId, status, osBalanceBefore, expenseItemsCount, submittedAt }

  // ── Per-Thunk Loading Flags ────────────────────────────────────────────────
  loading: {
    fetchOsBalance:       false,
    downloadTemplate:     false,
    submit:               false,
    fetchMySettlements:   false,
    fetchSettlementById:  false,
    fetchQueue:           false,
    approve:              false,
    reject:               false,
    submitClarification:  false,
  },

  // ── Per-Category Error Messages ────────────────────────────────────────────
  errors: {
    fetchOsBalance:       null,
    downloadTemplate:     null,
    submit:               null,
    fetchMySettlements:   null,
    fetchSettlementById:  null,
    fetchQueue:           null,
    approve:              null,
    reject:               null,
    submitClarification:  null,
  },

  // ── Active Filters ─────────────────────────────────────────────────────────
  filters: {
    status: '',     // Backend ENUM string filter
    date:   '',     // ISO date string filter
    page:   1,
    limit:  10,
  },
}


// ═══════════════════════════════════════════════════════════════════════════════
// SLICE
// ═══════════════════════════════════════════════════════════════════════════════
const advanceSettlementSlice = createSlice({
  name: 'advanceSettlement',
  initialState,

  reducers: {
    // ── Reset submit result (allow re-submission) ──────────────────────────
    clearSubmitResult: (state) => {
      state.submitResult = null
      state.errors.submit = null
    },

    // ── Clear all errors ───────────────────────────────────────────────────
    clearErrors: (state) => {
      state.errors = { ...initialState.errors }
    },

    // ── Clear approval/rejection error only ────────────────────────────────
    clearApprovalError: (state) => {
      state.errors.approve = null
      state.errors.reject = null
    },

    // ── Clear settlement detail ────────────────────────────────────────────
    clearSettlementDetail: (state) => {
      state.settlementDetail = null
      state.errors.fetchSettlementById = null
    },

    // ── Optimistic removal from approval queue ────────────────────────────
    // Removes an item immediately from the queue after approve/reject
    removeFromQueue: (state, action) => {
      const idToRemove = action.payload
      state.approvalQueue = state.approvalQueue.filter(
        (s) => s.id !== idToRemove && s.settlementId !== idToRemove
      )
    },

    // ── Update filters ─────────────────────────────────────────────────────
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: action.payload.page ?? 1, // Reset to page 1 if any filter changes
      }
    },

    // ── Reset filters to default ───────────────────────────────────────────
    resetFilters: (state) => {
      state.filters = { ...initialState.filters }
    },
  },

  extraReducers: (builder) => {
    // ═══════ submitClarification ══════════════════════════════════════════════
    builder
      .addCase(submitClarification.pending, (state) => {
        state.loading.submitClarification = true
        state.errors.submitClarification = null
      })
      .addCase(submitClarification.fulfilled, (state, action) => {
        state.loading.submitClarification = false
        state.errors.submitClarification = null
        // Update the matching settlement in-place so the table reflects the new status
        // without requiring a full re-fetch (optimistic UI update from server response)
        const { settlementId, updated } = action.payload || {}
        if (settlementId && updated) {
          state.mySettlements = state.mySettlements.map((s) =>
            s.settlementId === settlementId || s.id === settlementId
              ? { ...s, ...updated }
              : s
          )
        }
      })
      .addCase(submitClarification.rejected, (state, action) => {
        state.loading.submitClarification = false
        state.errors.submitClarification = extractErrorMessage(action.payload)
      })

    // ═══════ fetchOsBalance ═══════════════════════════════════════════════════
    builder
      .addCase(fetchOsBalance.pending, (state) => {
        state.loading.fetchOsBalance = true
        state.errors.fetchOsBalance = null
      })
      .addCase(fetchOsBalance.fulfilled, (state, action) => {
        state.loading.fetchOsBalance = false
        state.osBalance = action.payload || null
      })
      .addCase(fetchOsBalance.rejected, (state, action) => {
        state.loading.fetchOsBalance = false
        state.errors.fetchOsBalance = extractErrorMessage(action.payload)
      })

    // ═══════ downloadTemplate ═════════════════════════════════════════════════
    builder
      .addCase(downloadTemplate.pending, (state) => {
        state.loading.downloadTemplate = true
        state.errors.downloadTemplate = null
      })
      .addCase(downloadTemplate.fulfilled, (state) => {
        state.loading.downloadTemplate = false
        // Blob is handled in component via action.payload.blob — nothing to store
      })
      .addCase(downloadTemplate.rejected, (state, action) => {
        state.loading.downloadTemplate = false
        state.errors.downloadTemplate = extractErrorMessage(action.payload)
      })

    // ═══════ submitSettlement ═════════════════════════════════════════════════
    builder
      .addCase(submitSettlement.pending, (state) => {
        state.loading.submit = true
        state.errors.submit = null
        state.submitResult = null
      })
      .addCase(submitSettlement.fulfilled, (state, action) => {
        state.loading.submit = false
        state.submitResult = action.payload
      })
      .addCase(submitSettlement.rejected, (state, action) => {
        state.loading.submit = false
        state.errors.submit = extractErrorMessage(action.payload)
        state.submitResult = null
      })

    // ═══════ fetchMySettlements ═══════════════════════════════════════════════
    builder
      .addCase(fetchMySettlements.pending, (state) => {
        state.loading.fetchMySettlements = true
        state.errors.fetchMySettlements = null
      })
      .addCase(fetchMySettlements.fulfilled, (state, action) => {
        state.loading.fetchMySettlements = false
        state.mySettlements = action.payload?.settlements || []
        state.pagination = {
          currentPage: action.payload?.pagination?.currentPage || 1,
          totalPages:  action.payload?.pagination?.totalPages  || 1,
          totalItems:  action.payload?.pagination?.totalItems  || 0,
          pageSize:    action.payload?.pagination?.pageSize    || 10,
        }
      })
      .addCase(fetchMySettlements.rejected, (state, action) => {
        state.loading.fetchMySettlements = false
        state.errors.fetchMySettlements = extractErrorMessage(action.payload)
      })

    // ═══════ fetchSettlementById ══════════════════════════════════════════════
    builder
      .addCase(fetchSettlementById.pending, (state) => {
        state.loading.fetchSettlementById = true
        state.errors.fetchSettlementById = null
        state.settlementDetail = null
      })
      .addCase(fetchSettlementById.fulfilled, (state, action) => {
        state.loading.fetchSettlementById = false
        state.settlementDetail = action.payload || null
      })
      .addCase(fetchSettlementById.rejected, (state, action) => {
        state.loading.fetchSettlementById = false
        state.errors.fetchSettlementById = extractErrorMessage(action.payload)
      })

    // ═══════ fetchRhQueue ═════════════════════════════════════════════════════
    builder
      .addCase(fetchRhQueue.pending, (state) => {
        state.loading.fetchQueue = true
        state.errors.fetchQueue = null
      })
      .addCase(fetchRhQueue.fulfilled, (state, action) => {
        state.loading.fetchQueue = false
        state.approvalQueue = action.payload?.settlements || []
        state.queuePagination = action.payload?.pagination || initialState.queuePagination
      })
      .addCase(fetchRhQueue.rejected, (state, action) => {
        state.loading.fetchQueue = false
        state.errors.fetchQueue = extractErrorMessage(action.payload)
      })

    // ═══════ approveRh ════════════════════════════════════════════════════════
    builder
      .addCase(approveRh.pending, (state) => {
        state.loading.approve = true
        state.errors.approve = null
      })
      .addCase(approveRh.fulfilled, (state, action) => {
        state.loading.approve = false
        // Remove item from queue — it's moved to next level
        const approvedId = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter(
          (s) => s.id !== approvedId && s.settlementId !== approvedId
        )
      })
      .addCase(approveRh.rejected, (state, action) => {
        state.loading.approve = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ═══════ rejectRh ═════════════════════════════════════════════════════════
    builder
      .addCase(rejectRh.pending, (state) => {
        state.loading.reject = true
        state.errors.reject = null
      })
      .addCase(rejectRh.fulfilled, (state, action) => {
        state.loading.reject = false
        const rejectedId = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter(
          (s) => s.id !== rejectedId && s.settlementId !== rejectedId
        )
      })
      .addCase(rejectRh.rejected, (state, action) => {
        state.loading.reject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ═══════ fetchAvpQueue ════════════════════════════════════════════════════
    builder
      .addCase(fetchAvpQueue.pending, (state) => {
        state.loading.fetchQueue = true
        state.errors.fetchQueue = null
      })
      .addCase(fetchAvpQueue.fulfilled, (state, action) => {
        state.loading.fetchQueue = false
        state.approvalQueue = action.payload?.settlements || []
        state.queuePagination = action.payload?.pagination || initialState.queuePagination
      })
      .addCase(fetchAvpQueue.rejected, (state, action) => {
        state.loading.fetchQueue = false
        state.errors.fetchQueue = extractErrorMessage(action.payload)
      })

    // ═══════ approveAvp ═══════════════════════════════════════════════════════
    builder
      .addCase(approveAvp.pending, (state) => { state.loading.approve = true; state.errors.approve = null })
      .addCase(approveAvp.fulfilled, (state, action) => {
        state.loading.approve = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(approveAvp.rejected, (state, action) => {
        state.loading.approve = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ═══════ rejectAvp ════════════════════════════════════════════════════════
    builder
      .addCase(rejectAvp.pending, (state) => { state.loading.reject = true; state.errors.reject = null })
      .addCase(rejectAvp.fulfilled, (state, action) => {
        state.loading.reject = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(rejectAvp.rejected, (state, action) => {
        state.loading.reject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ═══════ fetchVpQueue ═════════════════════════════════════════════════════
    builder
      .addCase(fetchVpQueue.pending, (state) => {
        state.loading.fetchQueue = true
        state.errors.fetchQueue = null
      })
      .addCase(fetchVpQueue.fulfilled, (state, action) => {
        state.loading.fetchQueue = false
        state.approvalQueue = action.payload?.settlements || []
        state.queuePagination = action.payload?.pagination || initialState.queuePagination
      })
      .addCase(fetchVpQueue.rejected, (state, action) => {
        state.loading.fetchQueue = false
        state.errors.fetchQueue = extractErrorMessage(action.payload)
      })

    // ═══════ approveVp ════════════════════════════════════════════════════════
    builder
      .addCase(approveVp.pending, (state) => { state.loading.approve = true; state.errors.approve = null })
      .addCase(approveVp.fulfilled, (state, action) => {
        state.loading.approve = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(approveVp.rejected, (state, action) => {
        state.loading.approve = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ═══════ rejectVp ═════════════════════════════════════════════════════════
    builder
      .addCase(rejectVp.pending, (state) => { state.loading.reject = true; state.errors.reject = null })
      .addCase(rejectVp.fulfilled, (state, action) => {
        state.loading.reject = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(rejectVp.rejected, (state, action) => {
        state.loading.reject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ═══════ fetchAeQueue ═════════════════════════════════════════════════════
    builder
      .addCase(fetchAeQueue.pending, (state) => {
        state.loading.fetchQueue = true
        state.errors.fetchQueue = null
      })
      .addCase(fetchAeQueue.fulfilled, (state, action) => {
        state.loading.fetchQueue = false
        state.approvalQueue = action.payload?.settlements || []
        state.queuePagination = action.payload?.pagination || initialState.queuePagination
      })
      .addCase(fetchAeQueue.rejected, (state, action) => {
        state.loading.fetchQueue = false
        state.errors.fetchQueue = extractErrorMessage(action.payload)
      })

    // ═══════ approveAe ════════════════════════════════════════════════════════
    builder
      .addCase(approveAe.pending, (state) => { state.loading.approve = true; state.errors.approve = null })
      .addCase(approveAe.fulfilled, (state, action) => {
        state.loading.approve = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(approveAe.rejected, (state, action) => {
        state.loading.approve = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ═══════ rejectAe ═════════════════════════════════════════════════════════
    builder
      .addCase(rejectAe.pending, (state) => { state.loading.reject = true; state.errors.reject = null })
      .addCase(rejectAe.fulfilled, (state, action) => {
        state.loading.reject = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(rejectAe.rejected, (state, action) => {
        state.loading.reject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })

    // ═══════ fetchAmQueue ═════════════════════════════════════════════════════
    builder
      .addCase(fetchAmQueue.pending, (state) => {
        state.loading.fetchQueue = true
        state.errors.fetchQueue = null
      })
      .addCase(fetchAmQueue.fulfilled, (state, action) => {
        state.loading.fetchQueue = false
        state.approvalQueue = action.payload?.settlements || []
        state.queuePagination = action.payload?.pagination || initialState.queuePagination
      })
      .addCase(fetchAmQueue.rejected, (state, action) => {
        state.loading.fetchQueue = false
        state.errors.fetchQueue = extractErrorMessage(action.payload)
      })

    // ═══════ approveAm ════════════════════════════════════════════════════════
    builder
      .addCase(approveAm.pending, (state) => { state.loading.approve = true; state.errors.approve = null })
      .addCase(approveAm.fulfilled, (state, action) => {
        state.loading.approve = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(approveAm.rejected, (state, action) => {
        state.loading.approve = false
        state.errors.approve = extractErrorMessage(action.payload)
      })

    // ═══════ rejectAm ═════════════════════════════════════════════════════════
    builder
      .addCase(rejectAm.pending, (state) => { state.loading.reject = true; state.errors.reject = null })
      .addCase(rejectAm.fulfilled, (state, action) => {
        state.loading.reject = false
        const id = action.meta.arg.id
        state.approvalQueue = state.approvalQueue.filter((s) => s.id !== id && s.settlementId !== id)
      })
      .addCase(rejectAm.rejected, (state, action) => {
        state.loading.reject = false
        state.errors.reject = extractErrorMessage(action.payload)
      })
  },
})


// ─── Named Actions ─────────────────────────────────────────────────────────────
export const {
  clearSubmitResult,
  clearErrors,
  clearApprovalError,
  clearSettlementDetail,
  removeFromQueue,
  setFilters,
  resetFilters,
} = advanceSettlementSlice.actions


// ─── Selectors ──────────────────────────────────────────────────────────────────
// Consistent selector naming — use these in all components
export const selectOsBalance             = (state) => state.advanceSettlement?.osBalance         || null
export const selectMySettlements         = (state) => state.advanceSettlement?.mySettlements     || []
export const selectSettlementDetail      = (state) => state.advanceSettlement?.settlementDetail  || null
export const selectApprovalQueue         = (state) => state.advanceSettlement?.approvalQueue     || []
export const selectSubmitResult          = (state) => state.advanceSettlement?.submitResult      || null
export const selectSettlementLoading     = (state) => state.advanceSettlement?.loading           || {}
export const selectSettlementErrors      = (state) => state.advanceSettlement?.errors            || {}
export const selectMySettlementsPagination = (state) => state.advanceSettlement?.pagination    || {}
export const selectQueuePagination       = (state) => state.advanceSettlement?.queuePagination  || {}
export const selectSettlementFilters     = (state) => state.advanceSettlement?.filters          || {}

// ── Granular loading selectors (for clean component code) ───────────────────
export const selectOsBalanceLoading      = (state) => state.advanceSettlement?.loading?.fetchOsBalance     || false
export const selectSubmitLoading         = (state) => state.advanceSettlement?.loading?.submit             || false
export const selectMySettlementsLoading  = (state) => state.advanceSettlement?.loading?.fetchMySettlements || false
export const selectQueueLoading          = (state) => state.advanceSettlement?.loading?.fetchQueue         || false
export const selectApproveLoading        = (state) => state.advanceSettlement?.loading?.approve            || false
export const selectRejectLoading         = (state) => state.advanceSettlement?.loading?.reject             || false
export const selectTemplateLoading       = (state) => state.advanceSettlement?.loading?.downloadTemplate   || false

// ── Granular error selectors ────────────────────────────────────────────────
export const selectOsBalanceError         = (state) => state.advanceSettlement?.errors?.fetchOsBalance      || null
export const selectSubmitError            = (state) => state.advanceSettlement?.errors?.submit              || null
export const selectMySettlementsError     = (state) => state.advanceSettlement?.errors?.fetchMySettlements  || null
export const selectQueueError             = (state) => state.advanceSettlement?.errors?.fetchQueue          || null
export const selectApproveError           = (state) => state.advanceSettlement?.errors?.approve             || null
export const selectRejectError            = (state) => state.advanceSettlement?.errors?.reject              || null
export const selectClarificationError     = (state) => state.advanceSettlement?.errors?.submitClarification || null

// ── Clarification loading selector ─────────────────────────────────────────
export const selectClarificationLoading   = (state) => state.advanceSettlement?.loading?.submitClarification || false


export default advanceSettlementSlice.reducer
