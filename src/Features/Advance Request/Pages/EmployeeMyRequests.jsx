import React from 'react'
import SharedMyRequests from '../Components/SharedMyRequests'

// ─── Employee Role Wrapper ──────────────────────────────────────────────────
// Shows employee's own submitted advance requests with clarification capability
// Uses SharedMyRequests component for consistent UI/UX across all roles
const EmployeeMyRequests = () => (
  <SharedMyRequests title="My Advance Requests" />
)

export default EmployeeMyRequests
