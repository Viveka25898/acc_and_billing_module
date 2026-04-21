/**
 * authService.js
 * ──────────────
 * Handles all authentication API calls.
 * Keeps API logic separate from Redux state management.
 *
 * Usage in authSlice.js:
 *   const response = await loginUser({ email, password })
 *   // Returns: { access_token, token_type }
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
  // axiosInstance handles:
  //   ✅ Base URL from .env
  //   ✅ Authorization header with existing token (if any)
  //   ✅ Error handling (network, 401, 429, 500, etc.)
  const res = await axiosInstance.post('/accounts/auth/login', {
    email: email.trim().toLowerCase(),
    password,
  })

  // ─── Return Token Data ──────────────────────────────────────────────────
  // Response shape: { responseId, timestamp, results: { access_token, token_type } }
  return res.data.results  // Returns: { access_token, token_type }
}

export default loginUser
