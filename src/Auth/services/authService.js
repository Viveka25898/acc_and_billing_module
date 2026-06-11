/**
 * authService.js
 * ──────────────
 * Handles all authentication API calls.
 * Keeps API logic separate from Redux state management.
 *
 * API Response Shape (from /auth/login):
 * {
 *   success: true,
 *   message: "Login successful",
 *   data: {
 *     access_token:  "eyJ...",
 *     refresh_token: "eyJ...",
 *     token_type:    "bearer",
 *     expires_in:    3600,
 *     emp_name:      "Meena Pillai",
 *     emp_id:        "EMP0000011",
 *     role:          "AVP_OPERATIONS",
 *     region:        "WEST"
 *   },
 *   errors: null
 * }
 */

import axiosInstance from '../../api/axiosInstance'


export const loginUser = async ({ email, password }) => {
  // ─── Frontend Email Format Validation ────────────────────────────────────
  // Saves a network round-trip before hitting the API
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email || !emailRegex.test(email.trim())) {
    throw new Error('Please enter a valid email address.')
  }

  // ─── Frontend Password Validation ───────────────────────────────────────
  if (!password || password.trim().length === 0) {
    throw new Error('Password cannot be empty.')
  }

  // ─── API Call ───────────────────────────────────────────────────────────
  const res = await axiosInstance.post('/accounts/auth/login', {
    username: email.trim().toLowerCase(),  // Backend expects 'username', not 'email'
    password,
  })

  // ─── Extract & Validate Response Shape ──────────────────────────────────
  // Response path is res.data.data (NOT res.data.results)
  // Validate shape before destructuring to avoid cryptic JS crashes
  const responseData = res.data?.data

  if (!responseData) {
    throw new Error('Unexpected response from server. Please try again.')
  }
  if (!responseData.access_token) {
    throw new Error('Authentication failed: no token received. Please try again.')
  }

  const {
    access_token,
    refresh_token,
    token_type,
    expires_in,
    emp_name,
    emp_id,
    role,
    region,
  } = responseData

  return { access_token, refresh_token, token_type, expires_in, emp_name, emp_id, role, region }
}

export default loginUser
