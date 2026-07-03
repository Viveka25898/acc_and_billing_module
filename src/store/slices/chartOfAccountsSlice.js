import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as service from '../../Features/Master/Services/chartOfAccountsService'

// ─── Thunk: Fetch Accounts by Parent Code ─────────────────────────────────────
export const fetchAccountsByParent = createAsyncThunk(
  'chartOfAccounts/fetchAccountsByParent',
  async ({ parentCode = '', page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const data = await service.fetchAccountsByParentCode({ parentCode, page, limit })
      // data: { items: [], currentPage: 1, totalPages: 1, totalItems: 5, ... }
      return {
        parentCode,
        items: data.items || [],
        pagination: {
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0,
        }
      }
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch chart of accounts.')
    }
  }
)

// ─── Thunk: Fetch Accounts Summary ───────────────────────────────────────────
export const fetchAccountsSummary = createAsyncThunk(
  'chartOfAccounts/fetchAccountsSummary',
  async (_, { rejectWithValue }) => {
    try {
      const data = await service.fetchAccountsSummary()
      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch accounts summary.')
    }
  }
)

// ─── Thunk: Create New Account ───────────────────────────────────────────────
export const createNewAccount = createAsyncThunk(
  'chartOfAccounts/createNewAccount',
  async (accountData, { rejectWithValue }) => {
    try {
      const data = await service.createAccount(accountData)
      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create new account.')
    }
  }
)

const initialState = {
  accounts: [],
  loadingStates: {},      // { [parentCode]: 'idle' | 'loading' | 'succeeded' | 'failed' }
  errors: {},             // { [parentCode]: string | null }
  expandedAccounts: [],   // Array of expanded account codes
  pagination: {},         // { [parentCode]: paginationInfo }
  summary: null,
  summaryLoading: false,
  summaryError: null,
  createLoading: false,
  createError: null,
}

const chartOfAccountsSlice = createSlice({
  name: 'chartOfAccounts',
  initialState,
  reducers: {
    toggleExpandAccount: (state, action) => {
      const code = action.payload
      const idx = state.expandedAccounts.indexOf(code)
      if (idx >= 0) {
        state.expandedAccounts.splice(idx, 1)
      } else {
        state.expandedAccounts.push(code)
      }
    },
    addAccount: (state, action) => {
      state.accounts.push(action.payload)
    },
    updateAccount: (state, action) => {
      const updated = action.payload
      state.accounts = state.accounts.map(acc => acc.id === updated.id ? updated : acc)
    },
    deleteAccount: (state, action) => {
      const idsToDelete = action.payload // Array of IDs to delete
      state.accounts = state.accounts.filter(acc => !idsToDelete.includes(acc.id))
    },
    resetCOA: (state) => {
      state.accounts = []
      state.loadingStates = {}
      state.errors = {}
      state.expandedAccounts = []
      state.pagination = {}
      state.summary = null
      state.summaryLoading = false
      state.summaryError = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountsByParent.pending, (state, action) => {
        const { parentCode = '' } = action.meta.arg || {}
        state.loadingStates[parentCode] = 'loading'
        state.errors[parentCode] = null
      })
      .addCase(fetchAccountsByParent.fulfilled, (state, action) => {
        const { parentCode, items, pagination } = action.payload
        state.loadingStates[parentCode] = 'succeeded'
        state.pagination[parentCode] = pagination

        // Merge and check for duplicates to prevent duplicate elements in accounts array
        const currentAccounts = [...state.accounts]
        const incomingItems = items || []
        
        const newIds = new Set(incomingItems.map(item => item.id))
        // Filter out any existing items that are being re-fetched
        const filteredCurrent = currentAccounts.filter(item => !newIds.has(item.id))
        
        state.accounts = [...filteredCurrent, ...incomingItems]
      })
      .addCase(fetchAccountsByParent.rejected, (state, action) => {
        const { parentCode = '' } = action.meta.arg || {}
        state.loadingStates[parentCode] = 'failed'
        state.errors[parentCode] = action.payload || 'An error occurred.'
      })
      // ─── fetchAccountsSummary ───
      .addCase(fetchAccountsSummary.pending, (state) => {
        state.summaryLoading = true
        state.summaryError = null
      })
      .addCase(fetchAccountsSummary.fulfilled, (state, action) => {
        state.summaryLoading = false
        state.summary = action.payload
      })
      .addCase(fetchAccountsSummary.rejected, (state, action) => {
        state.summaryLoading = false
        state.summaryError = action.payload || 'An error occurred.'
      })
      // ─── createNewAccount ───
      .addCase(createNewAccount.pending, (state) => {
        state.createLoading = true
        state.createError = null
      })
      .addCase(createNewAccount.fulfilled, (state, action) => {
        state.createLoading = false
        if (action.payload) {
          state.accounts.push(action.payload)
        }
      })
      .addCase(createNewAccount.rejected, (state, action) => {
        state.createLoading = false
        state.createError = action.payload || 'An error occurred.'
      })
  }
})

export const { toggleExpandAccount, resetCOA, addAccount, updateAccount, deleteAccount } = chartOfAccountsSlice.actions

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectAccounts = (state) => state.chartOfAccounts.accounts
export const selectLoadingStates = (state) => state.chartOfAccounts.loadingStates
export const selectErrors = (state) => state.chartOfAccounts.errors
export const selectExpandedAccounts = (state) => state.chartOfAccounts.expandedAccounts
export const selectCOAPagination = (state) => state.chartOfAccounts.pagination
export const selectAccountsSummary = (state) => state.chartOfAccounts.summary
export const selectSummaryLoading = (state) => state.chartOfAccounts.summaryLoading
export const selectSummaryError = (state) => state.chartOfAccounts.summaryError
export const selectCreateLoading = (state) => state.chartOfAccounts.createLoading
export const selectCreateError = (state) => state.chartOfAccounts.createError

export default chartOfAccountsSlice.reducer
