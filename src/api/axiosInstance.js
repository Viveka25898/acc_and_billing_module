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
    if (error.response?.status === 401) {
      // Token expired or invalid — clear auth and redirect
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }

    // Normalize error message for consistent usage in thunks
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred'

    return Promise.reject(new Error(message))
  }
)

export default axiosInstance
