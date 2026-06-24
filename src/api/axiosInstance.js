/**
 * axiosInstance.js
 * -----------------
 * Centralized Axios instance for the entire application.
 * - Sets base URL from environment variable
 * - Attaches JWT Bearer token to every request automatically
 * - Handles 401 (token expired) globally
 *
 * TO SWITCH FROM LOCALHOST TO PRODUCTION:
 *   Just update VITE_API_BASE_URL in your .env file. Zero code changes.
 */

import axios from 'axios'

// ─── Create Instance ─────────────────────────────────────────────────────────
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout
})

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach JWT token from localStorage on every outgoing request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Global error handling: 401 = token expired → redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // ─── 401: Token Expired or Invalid ───────────────────────────────────────
    // IMPORTANT: Only redirect for protected endpoints, NOT for login endpoint
    // If login request fails with 401, let the LoginForm handle the error display
    if (error.response?.status === 401) {
      // Check if this was a login request — if so, don't auto-redirect
      if (!error.config?.url?.includes('/login')) {
        // Protected endpoint with expired/invalid token — clear all auth data
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        // ─── Set session expired flag ──────────────────────────────────────
        // LoginForm reads this on mount and shows a toast to explain the redirect
        localStorage.setItem('sessionExpired', 'true')
        window.location.href = '/login'
        return Promise.reject(new Error('Session expired. Please login again.'))
      }
      // For login endpoint, extract specific error and bubble to thunk
      const loginError =
        error.response?.data?.errors?.[0]?.errorMessage ||
        error.response?.data?.message ||
        'Invalid email or password. Please try again.'
      return Promise.reject(new Error(loginError))
    }

    // ─── 404: Not Found ───────────────────────────────────────────────────────
    // Pass 404s through as raw Axios errors (with error.response.status === 404).
    // Individual service functions handle 404 semantics per-endpoint.
    // Example: OS Balance 404 = employee has no advance transactions → treat as ₹0
    if (error.response?.status === 404) {
      return Promise.reject(error)  // ← pass original Axios error (has .response.status)
    }

    // ─── 429: Rate Limiting ──────────────────────────────────────────────────
    if (error.response?.status === 429) {
      return Promise.reject(new Error('Too many requests. Please wait and try again.'))
    }

    // ─── 500+: Server Error ──────────────────────────────────────────────────
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'))
    }

    // ─── Network Error (no response from server) ────────────────────────────
    if (!error.response) {
      return Promise.reject(new Error('Network error. Please check your internet connection.'))
    }

    // ─── API Error Message Extraction ────────────────────────────────────────
    // Extract error message based on API response format
    // Priority: errors[0].errorMessage (this API) → message → error → fallback
    const message =
      error.response?.data?.errors?.[0]?.errorMessage ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
