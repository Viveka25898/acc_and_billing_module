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

const LoginForm = (props) => {
  // ─── Form States ────────────────────────────────────────────────────────────
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRoleValue] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [localError, setLocalError] = useState("")  // For frontend validation

  // ─── Redux & Router ─────────────────────────────────────────────────────────
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // ─── Redux Auth State ───────────────────────────────────────────────────────
  const { loading, error: authError } = useSelector((state) => state.auth)

  // ─── Session Expired Notification ──────────────────────────────────────────
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

    // ─── Dispatch Async Login Thunk ─────────────────────────────────────────
    const result = await dispatch(
      loginUserThunk({ email, password, role })
    )

    // ─── Handle Success ─────────────────────────────────────────────────────
    if (loginUserThunk.fulfilled.match(result)) {
      toast.success("Login successful! Welcome back.")
      navigateByRole(result.payload.role)
    }
  }

  // ─── Display Error (Priority: local validation > Redux error) ──────────────
  const displayError = localError || authError

  return (
    <div className="w-screen h-screen min-h-screen flex flex-col lg:flex-row overflow-hidden bg-slate-900 font-sans">
      
      {/* Left Part: FULL IMAGE Edge-to-Edge (NO TEXT, NO SMALL CARDS) */}
      <div className="w-full lg:w-1/2 h-64 sm:h-80 lg:h-full relative overflow-hidden bg-slate-900">
        <img
          src={iSmartImg}
          alt="iSmart ERP System"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Right Part: Deep Emerald Green Background with Managed Colors */}
      <div className="w-full lg:w-1/2 h-full flex items-center justify-center p-6 sm:p-10 lg:p-16 bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white overflow-y-auto relative">
        
        {/* Ambient Decorative Glow Effects */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="w-full max-w-md text-center relative z-10">
          
          {/* Header Title Centered in Middle */}
          <div className="mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-center">
              {props.heading || "Login"}
            </h2>
          </div>

          {/* Styled Error Alert Banner */}
          {displayError && (
            <div className="mb-6 p-3.5 bg-rose-950/80 border border-rose-400/40 text-rose-100 rounded-xl flex items-start gap-3 text-left animate-in fade-in duration-200 shadow-sm">
              <svg className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-rose-100 text-xs sm:text-sm font-medium leading-tight">{displayError}</p>
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-5 text-left" onSubmit={handleLoginFormSubmit}>
            
            {/* Email Input Field */}
            <div>
              <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-emerald-300/40 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-white bg-white hover:bg-slate-50 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed shadow-sm"
                />
              </div>
            </div>

            {/* Password Input Field with Interactive Eye Toggle */}
            <div>
              <label className="block text-xs font-bold text-emerald-100 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full pl-11 pr-11 py-3 border border-emerald-300/40 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-white bg-white hover:bg-slate-50 transition-all disabled:bg-slate-200 disabled:cursor-not-allowed shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858-5.908a10.03 10.03 0 013.122-.443c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m-4.685-2.029a3 3 0 11-4.243-4.243m4.243 4.243L3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Action Submit Button (High Contrast White Button with Emerald Text) */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-white hover:bg-emerald-50 text-emerald-900 font-extrabold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base cursor-pointer border border-white"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5 text-emerald-900" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <svg className="w-4 h-4 text-emerald-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>

          </form>

          {/* Footer Copyright Notice */}
          <div className="mt-8 text-center text-xs text-emerald-200/80">
            © {new Date().getFullYear()} iSmart Accounts & Billing Module. All rights reserved.
          </div>

        </div>
      </div>

    </div>
  )
}

export default LoginForm
