import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import ManagerReview from '../Components/ManagerReview'
import { selectRole, selectIsAuthenticated } from '../../../Auth/authSlice'

// ─── Roles allowed to access this approval page ───────────────────────────────
const ALLOWED_ROLES = ['regional-head', 'line-manager', 'manager', 'supervisor']

/**
 * ExpenseRequestsPage
 * Shell page for the Regional Head / Line Manager settlement approval view.
 * Auth is handled via Redux (no localStorage reads).
 * Role check is enforced here — unauthorized roles are redirected.
 */
const ExpenseRequestsPage = () => {
  const role            = useSelector(selectRole)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  // ── Not authenticated ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // ── Role not in allowed list ─────────────────────────────────────────────
  if (role && !ALLOWED_ROLES.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

  // ── Show loading state while role is being resolved ──────────────────────
  if (!role) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <ManagerReview />
    </div>
  )
}

export default ExpenseRequestsPage
