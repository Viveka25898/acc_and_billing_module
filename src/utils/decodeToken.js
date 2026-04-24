/**
 * decodeToken.js
 * ──────────────
 * Decodes the payload of a JWT without any external library.
 * Safe to use — does NOT verify signature (that's backend's job).
 *
 * Usage:
 *   const payload = decodeToken(access_token)
 *   console.log(payload.role)  // Future: extract role from token
 */

export const decodeToken = (token) => {
  try {
    const base64Payload = token.split('.')[1]
    const decoded = atob(base64Payload)
    return JSON.parse(decoded)
    // Returns: { sub, email, role, exp, iat, ... }
  } catch (error) {
    console.error('Failed to decode token:', error)
    return null  // malformed token
  }
}

/**
 * extractEmployeeIdFromToken
 * ──────────────────────────
 * Extracts the employeeId from JWT.sub claim (unique identifier)
 * Falls back to null with logging if sub claim is missing or invalid
 *
 * JWT payload format: { sub: "emp123" or "user@domain.com", email: "...", role: "...", ... }
 * We extract sub as employeeId (JWT standard subject claim)
 *
 * Usage:
 *   const employeeId = extractEmployeeIdFromToken(access_token)
 *   // Returns: "emp123" or "user@domain.com" or null
 */
export const extractEmployeeIdFromToken = (token) => {
  try {
    // ─── Validate token ─────────────────────────────────────────────────
    if (!token || typeof token !== 'string') {
      return null  // No logging for null token (expected in some cases)
    }

    // ─── Decode JWT ─────────────────────────────────────────────────────
    const decoded = decodeToken(token)
    if (!decoded || typeof decoded !== 'object') {
      return null  // decodeToken logs the error, we just return null
    }

    // ─── Extract JWT.sub claim ──────────────────────────────────────────
    const employeeId = decoded.sub

    // ─── Validate sub claim ─────────────────────────────────────────────
    // JWT spec: sub should be a non-empty string (unique identifier)
    if (!employeeId || typeof employeeId !== 'string' || employeeId.trim().length === 0) {
      console.warn('Invalid or missing sub claim in JWT')
      return null
    }

    return employeeId
  } catch (error) {
    console.error('Failed to extract employeeId from token:', error)
    return null
  }
}

export default decodeToken
