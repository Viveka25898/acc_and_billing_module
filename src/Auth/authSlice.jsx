import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginUser } from "./services/authService";

// ─── Backend Role to Frontend Role Mapping ──────────────────────────────────
// Backend sends roles in UPPER_SNAKE_CASE (e.g., AVP_OPERATIONS)
// This maps them to our kebab-case frontend ROLE_ROUTES keys
const BACKEND_ROLE_MAP = {
  // ─── Existing Roles ────────────────────────────────────────
  'EMPLOYEE':             'employee',
  'LINE_MANAGER':         'line-manager',
  'VP_OPS':               'vp-operations',
  'VP_OPERATIONS':        'vp-operations',
  'SUPERVISOR':           'supervisor',
  'MANAGER':              'manager',
  'PH':                   'ph',
  'VENDOR':               'vendor',
  'AE':                   'ae',
  'ACCOUNT_EXECUTIVE':    'ae',
  'COMPLIANCE_TEAM':      'compliance-team',
  'COMPLIANCE_MANAGER':   'compliance-manager',
  'PAYROLL_TEAM':         'payroll-team',
  'FINANCIAL_HEAD':       'financial-head',
  'BILLING_MANAGER':      'billing-manager',
  'OPERATION_EXECUTIVE':  'operation-executive',
  'ACCOUNT_MANAGER':      'account-manager',
  // ─── New Roles (Advance Request Hierarchy) ──────────────────
  'OPERATION_MANAGER':    'operation-manager',
  'REGIONAL_HEAD':        'regional-head',
  'AVP_OPERATIONS':       'avp-operations',
}

const mapBackendRoleToFrontend = (backendRole) => {
  if (!backendRole) return null

  // Normalize string format first: convert to uppercase, swap hyphen for underscore to match keys in mapping
  const normalizedKey = backendRole.toUpperCase().replace(/-/g, '_')

  if (BACKEND_ROLE_MAP[normalizedKey]) {
    return BACKEND_ROLE_MAP[normalizedKey]
  }

  // Fallback: return lowercase with hyphens
  return backendRole.toLowerCase().replace(/_/g, '-')
}

// ─── Safe localStorage Helpers ───────────────────────────────────────────────
// If data is corrupt/invalid JSON, clear it and return null instead of crashing

const safeGetItem = (key) => {
  try {
    return localStorage.getItem(key) || null
  } catch {
    return null
  }
}

const safeGetJSON = (key) => {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    // Data is corrupt — clear it silently so app doesn't crash on next load
    localStorage.removeItem(key)
    return null
  }
}

const safeSaveJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // localStorage might be full or disabled (private browsing)
    console.warn(`[Auth] Could not save ${key} to localStorage`)
  }
}

// ─── Rehydrate State from localStorage ───────────────────────────────────────
// On app startup/refresh, restore auth state so user doesn't get logged out
const storedToken        = safeGetItem('token')
const storedRefreshToken = safeGetItem('refreshToken')
const storedUser         = safeGetJSON('user')

// ─── Initial State ──────────────────────────────────────────────────────────
const initialState = {
  user:            storedUser,                        // { email, role, empName, empId, region }
  role:            storedUser?.role        ? mapBackendRoleToFrontend(storedUser.role) : null,   // active role string (kebab-case)
  token:           storedToken             || null,   // JWT access_token
  refreshToken:    storedRefreshToken      || null,   // JWT refresh_token
  empName:         storedUser?.empName     || null,   // e.g. "Meena Pillai" — for form pre-fill
  empId:           storedUser?.empId       || null,   // e.g. "EMP0000011" — for form pre-fill
  region:          storedUser?.region      || null,   // e.g. "WEST" — for region-based filtering
  isAuthenticated: !!storedToken,                     // true when token exists
  loading:         false,                             // disables button, shows spinner
  error:           null,                              // red error banner on LoginForm
}

// ─── Async Thunk: Login User ────────────────────────────────────────────────
export const loginUserThunk = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }, { rejectWithValue }) => {
    try {
      const data = await loginUser({ email, password })
      // data = { access_token, refresh_token, emp_name, emp_id, role, region, ... }
      // Role comes directly from API — no need to decode JWT

      // Role priority: user-selected dropdown > API response role
      const apiRole   = mapBackendRoleToFrontend(data.role)
      const finalRole = role || apiRole  // dropdown value overrides if selected

      return {
        access_token:  data.access_token,
        refresh_token: data.refresh_token,
        role:          finalRole,
        emp_name:      data.emp_name,
        emp_id:        data.emp_id,
        region:        data.region,
        email,
      }
    } catch (error) {
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
      state.user            = null
      state.role            = null
      state.token           = null
      state.refreshToken    = null
      state.empName         = null
      state.empId           = null
      state.region          = null
      state.isAuthenticated = false
      state.error           = null
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
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
        state.error   = null
      })

      // ──── Login Fulfilled ────────────────────────────────────────────────
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        const {
          access_token,
          refresh_token,
          role,
          email,
          emp_name,
          emp_id,
          region,
        } = action.payload

        state.loading         = false
        state.token           = access_token
        state.refreshToken    = refresh_token
        state.role            = role
        state.empName         = emp_name
        state.empId           = emp_id
        state.region          = region
        state.user            = { email, role, empName: emp_name, empId: emp_id, region }
        state.isAuthenticated = true
        state.error           = null

        // ─── Persist to localStorage (safely) ─────────────────────────────
        try { localStorage.setItem('token', access_token) } catch { console.warn('[Auth] Could not save token') }
        try { localStorage.setItem('refreshToken', refresh_token) } catch { console.warn('[Auth] Could not save refreshToken') }
        safeSaveJSON('user', { email, role, empName: emp_name, empId: emp_id, region })
      })

      // ──── Login Rejected ─────────────────────────────────────────────────
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading         = false
        state.error           = action.payload  // Error message from authService/axiosInstance
        state.user            = null
        state.role            = null
        state.token           = null
        state.refreshToken    = null
        state.empName         = null
        state.empId           = null
        state.region          = null
        state.isAuthenticated = false
      })
  }
})

export const { logout, clearError } = authSlice.actions

// ─── Selectors ───────────────────────────────────────────────────────────────
export const selectUser            = (state) => state.auth.user
export const selectRole            = (state) => state.auth.role
export const selectToken           = (state) => state.auth.token
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
export const selectAuthLoading     = (state) => state.auth.loading
export const selectAuthError       = (state) => state.auth.error
// ─── New selectors — used by advance request forms and other components ───────
export const selectEmpName         = (state) => state.auth.empName
export const selectEmpId           = (state) => state.auth.empId
export const selectRegion          = (state) => state.auth.region
export const selectRefreshToken    = (state) => state.auth.refreshToken
// ─── Composite — for components that need full auth context ───────────────────
export const selectAuthContext     = (state) => state.auth.user

export default authSlice.reducer
