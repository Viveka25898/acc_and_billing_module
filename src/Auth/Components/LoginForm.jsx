/* eslint-disable no-unused-vars */
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import iSmartImg from "../assets/Web_Photo_Editor.jpg"
import { loginUserThunk } from "../authSlice"

// ─── Role-based Route Mapping ───────────────────────────────────────────────
// Maps each frontend role to its dashboard path after login
const ROLE_ROUTES = {
  // ─── Level 1 — All route to Employee Dashboard ────────────────────────
  'employee': '/dashboard/employee',   // backward compat
  'operation-executive': '/dashboard/employee',
  'operation-manager': '/dashboard/employee',
  'supervisor': '/dashboard/employee',   // region-based supervisor
  // ─── Level 2 ──────────────────────────────────────────────────────────
  'regional-head': '/dashboard/regional-head',
  // ─── Level 3 ──────────────────────────────────────────────────────────
  'avp-operations': '/dashboard/avp-operations',
  'avp_operations': '/dashboard/avp-operations',
  'AVP_OPERATIONS': '/dashboard/avp-operations',
  // ─── Unchanged Roles ──────────────────────────────────────────────────
  'line-manager': '/dashboard/line-manager',
  'vp-operations': '/dashboard/vp-operations',
  'vp_operations': '/dashboard/vp-operations',
  'VP_OPERATIONS': '/dashboard/vp-operations',
  'manager': '/dashboard/manager',
  'ph': '/dashboard/ph',
  'vendor': '/dashboard/vendor',
  'ae': '/dashboard/ae',
  'account-executive': '/dashboard/ae',
  'ACCOUNT_EXECUTIVE': '/dashboard/ae',
  'compliance-team': '/dashboard/compliance-team',
  'compliance-manager': '/dashboard/compliance-manager',
  'payroll-team': '/dashboard/payroll-team',
  'financial-head': '/dashboard/financial-head',
  'billing-manager': '/dashboard/billing-manager',
  'account-manager': '/dashboard/account-manager',
}

/**
 * LoginForm Component
 * ──────────────────
 * DUAL-MODE LOGIN:
 *   1. With role selection (testing mode) — User selects role from dropdown
 *   2. Without role selection (production mode) — Role extracted from JWT token
 *
 * This allows testing with partial credentials while supporting full prod flow.
 * Once all credentials are available, remove the role dropdown entirely.
 */

const LoginForm = (props) => {
  // ─── Form States ────────────────────────────────────────────────────────────
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRoleValue] = useState("")
  const [localError, setLocalError] = useState("")  // For frontend validation

  // ─── Redux & Router ─────────────────────────────────────────────────────────
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ─── Redux Auth State ───────────────────────────────────────────────────────
  const { loading, error: authError } = useSelector((state) => state.auth)

  // ─── Session Expired Notification ──────────────────────────────────────────
  // axiosInstance sets this flag when a 401 occurs on a protected endpoint.
  // We show a toast here so the user understands why they were redirected.
  useEffect(() => {
    if (localStorage.getItem('sessionExpired') === 'true') {
      localStorage.removeItem('sessionExpired')
      toast.warning('Your session has expired. Please login again.', {
        position: 'top-right',
        autoClose: 5000,
      })
    }
  }, [])

  // ─── Navigate by Role ───────────────────────────────────────────────────────
  const navigateByRole = (userRole) => {
    const route = ROLE_ROUTES[userRole]
    if (!route) {
      toast.error("Unknown role. Please contact admin.")
      return
    }
    navigate(route)
  }

  // ─── Handle Login Form Submit ────────────────────────────────────────────────
  const handleLoginFormSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")  // Clear previous local errors

    // ─── Frontend Validation ────────────────────────────────────────────────
    if (!email.trim()) {
      setLocalError("Email cannot be empty.")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setLocalError("Please enter a valid email address.")
      return
    }

    if (!password.trim()) {
      setLocalError("Password cannot be empty.")
      return
    }

    // Note: Role is now optional — extracted from JWT token if not selected


    // ─── Dispatch Async Login Thunk ─────────────────────────────────────────
    const result = await dispatch(
      loginUserThunk({ email, password, role })
    )

    // ─── Handle Success ─────────────────────────────────────────────────────
    if (loginUserThunk.fulfilled.match(result)) {
      toast.success("Login successful! Welcome back.")
      // Use role from thunk result (which is either user-selected OR extracted from token)
      navigateByRole(result.payload.role)
    }
    // ─── Handle Failure (error is shown in inline banner below) ────────────
  }

  // ─── Display Error (Priority: local validation > Redux error) ──────────────
  const displayError = localError || authError

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* Left Part: Image Section */}
        <div className="w-full lg:w-1/2 h-64 lg:h-screen">
          <img
            src={iSmartImg}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Part: Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
          <div className="w-full max-w-md text-center">
            <h2 className="text-4xl lg:text-5xl font-bold text-green-700 mb-8 font-mulish">
              {props.heading}
            </h2>

            {/* Error Banner */}
            {displayError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-600 text-sm font-mulish">{displayError}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLoginFormSubmit}>
              {/* Email Field */}
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              {/* Password Field */}
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish disabled:bg-gray-100 disabled:cursor-not-allowed"
              />

              {/* Role Dropdown (Testing Mode) */}
              {/* Role comes from API — this dropdown is for testing only */}
              {/* TODO: Remove this dropdown entirely when all users have proper login credentials */}
              <select
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mulish disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={role}
                onChange={(e) => setRoleValue(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Role (Optional)</option>
                {/* ── Level 1 — Employee Dashboard ────────────────── */}
                <option value="operation-executive">Operation Executive</option>
                <option value="operation-manager">Operation Manager</option>
                <option value="supervisor">Supervisor</option>
                {/* ── Level 2 ─────────────────────────────────────── */}
                <option value="regional-head">Regional Head</option>
                {/* ── Level 3 ─────────────────────────────────────── */}
                <option value="avp-operations">AVP Operations</option>
                {/* ── Level 4 & 5 ─────────────────────────────────── */}
                <option value="vp-operations">VP Operations</option>
                <option value="ae">Account Executive</option>
                {/* ── Other Roles ──────────────────────────────────── */}
                <option value="compliance-team">Compliance Team</option>
                <option value="compliance-manager">Compliance Manager</option>
                <option value="payroll-team">Payroll Team</option>
                <option value="financial-head">Financial Head</option>
                <option value="billing-manager">Billing Manager</option>
                <option value="account-manager">Account Manager</option>
                <option value="manager">Manager</option>
                <option value="ph">PH</option>
                <option value="vendor">Vendor</option>
              </select>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-800 transition font-mulish disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginForm
