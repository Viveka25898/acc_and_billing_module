import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as service from '../../Features/Master/Services/chartOfAccountsService'
import { INITIAL_CHART_OF_ACCOUNTS } from '../../data/ChartOfAccounts'

// ─── Thunk: Fetch Accounts by Parent Code ─────────────────────────────────────
export const fetchAccountsByParent = createAsyncThunk(
  'chartOfAccounts/fetchAccountsByParent',
  async ({ parentCode = '', page = 1, limit = 100 } = {}, { rejectWithValue }) => {
    try {
      const data = await service.fetchAccountsByParentCode({ parentCode, page, limit })
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

// ─── Thunk: Update Account Details ───────────────────────────────────────────
export const updateAccountDetails = createAsyncThunk(
  'chartOfAccounts/updateAccountDetails',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const data = await service.updateAccount(id, { name })
      return data
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update account details.')
    }
  }
)

// ─── Thunk: Delete Account ───────────────────────────────────────────────────
export const deleteAccountById = createAsyncThunk(
  'chartOfAccounts/deleteAccountById',
  async (id, { rejectWithValue }) => {
    try {
      await service.deleteAccount(id)
      return id
    } catch (err) {
      console.warn(`⚠️ API error deleting account ${id}, proceeding with local deletion:`, err)
      return id
    }
  }
)

const getInitialAccounts = () => {
  try {
    const local = JSON.parse(localStorage.getItem('chartOfAccounts') || '[]')
    return local.length > 0 ? local : INITIAL_CHART_OF_ACCOUNTS
  } catch {
    return INITIAL_CHART_OF_ACCOUNTS
  }
}

const initialState = {
  accounts: getInitialAccounts(),
  loadingStates: {},      // { [parentCode]: 'idle' | 'loading' | 'succeeded' | 'failed' }
  errors: {},             // { [parentCode]: string | null }
  expandedAccounts: [],   // Array of expanded account codes
  pagination: {},         // { [parentCode]: paginationInfo }
  summary: null,
  summaryLoading: false,
  summaryError: null,
  createLoading: false,
  createError: null,
  editLoading: false,
  editError: null,
  deleteLoading: false,
  deleteError: null,
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

        // Merge and check for duplicates safely by code and id (ignoring undefined/null keys)
        const currentAccounts = [...state.accounts]
        const incomingItems = items || []
        
        const incomingKeys = new Set()
        incomingItems.forEach(item => {
          if (item.id !== undefined && item.id !== null) incomingKeys.add(`id:${item.id}`)
          if (item.code !== undefined && item.code !== null) incomingKeys.add(`code:${item.code}`)
        })
        
        // Filter out existing items only if their exact id or code matches an incoming item
        const filteredCurrent = currentAccounts.filter(item => {
          const matchesId = item.id !== undefined && item.id !== null && incomingKeys.has(`id:${item.id}`)
          const matchesCode = item.code !== undefined && item.code !== null && incomingKeys.has(`code:${item.code}`)
          return !matchesId && !matchesCode
        })
        
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
      // ─── updateAccountDetails ───
      .addCase(updateAccountDetails.pending, (state) => {
        state.editLoading = true
        state.editError = null
      })
      .addCase(updateAccountDetails.fulfilled, (state, action) => {
        state.editLoading = false
        if (action.payload) {
          const updated = action.payload
          state.accounts = state.accounts.map(acc => acc.id === updated.id ? updated : acc)
        }
      })
      .addCase(updateAccountDetails.rejected, (state, action) => {
        state.editLoading = false
        state.editError = action.payload || 'An error occurred.'
      })
      // ─── deleteAccountById ───
      .addCase(deleteAccountById.pending, (state) => {
        state.deleteLoading = true
        state.deleteError = null
      })
      .addCase(deleteAccountById.fulfilled, (state, action) => {
        state.deleteLoading = false
        const deletedId = action.payload
        const accountToDelete = state.accounts.find(
          acc => acc.id === deletedId || acc.code === deletedId || String(acc.id) === String(deletedId)
        )
        if (accountToDelete) {
          const codePrefix = accountToDelete.code
          state.accounts = state.accounts.filter(
            acc => acc.id !== deletedId && acc.code !== deletedId && String(acc.id) !== String(deletedId) && !String(acc.code || '').startsWith(codePrefix)
          )
        } else {
          state.accounts = state.accounts.filter(
            acc => acc.id !== deletedId && acc.code !== deletedId && String(acc.id) !== String(deletedId)
          )
        }
        try {
          localStorage.setItem('chartOfAccounts', JSON.stringify(state.accounts))
        } catch (e) {
          console.error('Error syncing localStorage on account delete:', e)
        }
      })
      .addCase(deleteAccountById.rejected, (state, action) => {
        state.deleteLoading = false
        state.deleteError = action.payload || 'An error occurred.'
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
export const selectEditLoading = (state) => state.chartOfAccounts.editLoading
export const selectEditError = (state) => state.chartOfAccounts.editError
export const selectDeleteLoading = (state) => state.chartOfAccounts.deleteLoading
export const selectDeleteError = (state) => state.chartOfAccounts.deleteError

export default chartOfAccountsSlice.reducer
