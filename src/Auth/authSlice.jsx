import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "./services/authService";
import { decodeToken, extractEmployeeIdFromToken } from "../utils/decodeToken";

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

// ─── Initial State ──────────────────────────────────────────────────────
const initialState = {
  user: storedUser,                    // { email, role, employeeId, employeeName } — restored from localStorage
  role: storedUser?.role || null,      // role from dropdown OR extracted from JWT token
  employeeId: storedUser?.employeeId || null,  // unique identifier extracted from JWT.sub
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

      // ─── Validate access token ──────────────────────────────────────────
      if (!data?.access_token || typeof data.access_token !== 'string') {
        return rejectWithValue('Invalid token received from server')
      }

      // ─── Extract employeeId from JWT.sub claim ──────────────────────────
      const employeeId = extractEmployeeIdFromToken(data.access_token)
      if (!employeeId) {
        // Log warning but don't fail login — backend may send sub in future
        console.warn('employeeId not found in JWT, will use email as fallback')
      }

      // ─── Extract role from token if not provided by user ───────────────
      // Priority: user-selected role > role from JWT token
      let finalRole = role
      if (!finalRole) {
        const decoded = decodeToken(data.access_token)
        // Map backend role format to frontend format (e.g., VP_OPS → vp-operations)
        finalRole = mapBackendRoleToFrontend(decoded?.role) || null
      }

      // ─── Determine employeeName (email fallback until backend adds name field) ─
      // Once backend adds name field, update to: employeeName: decoded?.name || email
      const employeeName = email || 'Unknown User'  // Fallback if email missing (unlikely)

      return {
        access_token: data.access_token,
        role: finalRole,  // Either from dropdown or decoded from token
        email,
        employeeId: employeeId || email,  // Use email as fallback if sub missing
        employeeName,  // Email used as name until backend provides name field
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
        const { access_token, role, email, employeeId, employeeName } = action.payload

        // ─── Validate required fields ────────────────────────────────────
        if (!access_token || !email) {
          state.loading = false
          state.error = 'Invalid login response: missing token or email'
          state.isAuthenticated = false
          return
        }

        state.loading = false
        state.token = access_token
        state.role = role                         // From dropdown (now)
        state.employeeId = employeeId || null     // Extracted from JWT.sub or email fallback
        state.user = {
          email,
          role,
          employeeId: employeeId || null,         // Unique identifier for later use
          employeeName: employeeName || email,    // Display name (email fallback)
        }
        state.isAuthenticated = true
        state.error = null

        // ─── Persist to localStorage ───────────────────────────────────────
        // Store complete user object with employeeId for form pre-fill
        localStorage.setItem('token', access_token)
        localStorage.setItem('user', JSON.stringify({
          email,
          role,
          employeeId: employeeId || null,
          employeeName: employeeName || email,
        }))
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

// ─── Defensive Selectors ────────────────────────────────────────────────────────
// All selectors have null-safety and sensible fallbacks
export const selectAuthUser = (state) => state.auth?.user || null
export const selectAuthToken = (state) => state.auth?.token || null
export const selectAuthRole = (state) => state.auth?.role || null
export const selectAuthEmployeeId = (state) => state.auth?.employeeId || state.auth?.user?.employeeId || null
export const selectAuthEmployeeName = (state) => state.auth?.user?.employeeName || state.auth?.user?.email || 'Unknown User'
export const selectAuthEmail = (state) => state.auth?.user?.email || null
export const selectIsAuthenticated = (state) => state.auth?.isAuthenticated ?? false
export const selectAuthLoading = (state) => state.auth?.loading ?? false
export const selectAuthError = (state) => state.auth?.error || null

// ─── Composite Selector: Get full user context with all fields ─────────────────
export const selectAuthContext = (state) => ({
  user: state.auth?.user || null,
  token: state.auth?.token || null,
  role: state.auth?.role || null,
  employeeId: state.auth?.employeeId || state.auth?.user?.employeeId || null,
  employeeName: state.auth?.user?.employeeName || state.auth?.user?.email || 'Unknown User',
  email: state.auth?.user?.email || null,
  isAuthenticated: state.auth?.isAuthenticated ?? false,
  loading: state.auth?.loading ?? false,
  error: state.auth?.error || null,
})

export default authSlice.reducer

