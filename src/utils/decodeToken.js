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

export default decodeToken
