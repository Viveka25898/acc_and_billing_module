import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import AVPReview from '../Components/AVPReview'
import { selectRole, selectIsAuthenticated } from '../../../Auth/authSlice'

const ALLOWED_ROLES = ['avp-operations']

const AVPExpenseRequestsPage = () => {
  const role            = useSelector(selectRole)
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (role && !ALLOWED_ROLES.includes(role)) {
    return <Navigate to="/unauthorized" replace />
  }

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
      <AVPReview />
    </div>
  )
}

export default AVPExpenseRequestsPage
