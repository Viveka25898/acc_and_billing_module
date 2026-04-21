import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "./services/authService";
import { decodeToken } from "../utils/decodeToken";

// ─── Backend Role to Frontend Role Mapping ──────────────────────────────────
// Backend sends roles in different formats (VP_OPS, AE, etc.)
// This maps them to our ROLE_ROUTES keys
const BACKEND_ROLE_MAP = {
  'EMPLOYEE': 'employee',
  'LINE_MANAGER': 'line-manager',
  'VP_OPS': 'vp-operations',
  'SUPERVISOR': 'supervisor',
  'MANAGER': 'manager',
  'PH': 'ph',
  'VENDOR': 'vendor',
  'AE': 'ae',
  'COMPLIANCE_TEAM': 'compliance-team',
  'COMPLIANCE_MANAGER': 'compliance-manager',
  'PAYROLL_TEAM': 'payroll-team',
  'FINANCIAL_HEAD': 'financial-head',
  'BILLING_MANAGER': 'billing-manager',
  'OPERATION_EXECUTIVE': 'operation-executive',
  'ACCOUNT_MANAGER': 'account-manager',
}

const mapBackendRoleToFrontend = (backendRole) => {
  if (!backendRole) return null
  
  // Try exact match first (case-sensitive)
  if (BACKEND_ROLE_MAP[backendRole]) {
    return BACKEND_ROLE_MAP[backendRole]
  }
  
  // Try uppercase match (in case backend sends lowercase)
  const upperRole = backendRole.toUpperCase()
  if (BACKEND_ROLE_MAP[upperRole]) {
    return BACKEND_ROLE_MAP[upperRole]
  }
  
  // Fallback: just return lowercase (for unmapped roles)
  return backendRole.toLowerCase()
}

// ─── Rehydrate State from localStorage ───────────────────────────────────────
// On app startup/refresh, restore auth state so user doesn't get logged out
const storedToken = localStorage.getItem('token')
const storedUser = JSON.parse(localStorage.getItem('user')) || null

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  user: storedUser,                    // { email, role } — restored from localStorage
  role: storedUser?.role || null,      // role from dropdown OR extracted from JWT token
  token: storedToken || null,          // JWT access_token string
  isAuthenticated: !!storedToken,      // true when token exists
  loading: false,                      // disables button, shows spinner
  error: null,                         // red error banner on LoginForm
}

// ─── Async Thunk: Login User ────────────────────────────────────────────────
export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const data = await loginUser({ email, password })
      // data = { access_token, token_type }

      // ─── Extract role from token if not provided by user ───────────────
      // Priority: user-selected role > role from JWT token
      let finalRole = role
      if (!finalRole) {
        const decoded = decodeToken(data.access_token)
        // Map backend role format to frontend format (e.g., VP_OPS → vp-operations)
        finalRole = mapBackendRoleToFrontend(decoded?.role) || null
      }

      return {
        access_token: data.access_token,
        role: finalRole,  // Either from dropdown or decoded from token
        email, // pass email forward for user object
      }
    } catch (error) {
      // Error message comes from authService or axiosInstance
      return rejectWithValue(error.message)
    }
  },
  {
    // ─── Concurrent Request Guard ─────────────────────────────────────────
    // Prevent duplicate requests if user double-clicks the button
    condition: (_, { getState }) => {
      const { loading } = getState().auth
      if (loading) {
        return false  // ← Block if already loading
      }
    }
  }
)

// ─── Auth Slice ──────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // ─── Logout Reducer ─────────────────────────────────────────────────────
    logout: (state) => {
      state.user = null
      state.role = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    // ─── Clear Error Reducer ───────────────────────────────────────────────
    clearError: (state) => {
      state.error = null
    }
  },

  // ─── Extra Reducers: Handle Async Thunk ────────────────────────────────────
  extraReducers: (builder) => {
    builder
      // ──── Login Pending ──────────────────────────────────────────────────
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true
        state.error = null
      })

      // ──── Login Fulfilled ────────────────────────────────────────────────
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        const { access_token, role, email } = action.payload

        state.loading = false
        state.token = access_token
        state.role = role                         // From dropdown (now)
        state.user = { email, role }              // Store for restoration
        state.isAuthenticated = true
        state.error = null

        // ─── Persist to localStorage ───────────────────────────────────────
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify({ email, role }))
      })

      // ──── Login Rejected ─────────────────────────────────────────────────
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload  // Error message from authService/axiosInstance
        state.user = null
        state.role = null
        state.token = null
        state.isAuthenticated = false
      })
  }
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

