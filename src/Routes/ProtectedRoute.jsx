import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const normalizeRole = (r) => {
  if (!r) return ''
  return r.toLowerCase().replace(/_/g, '-')
}

const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = useSelector((state) => state.auth.role)
  const normalizedRole = normalizeRole(role)
  const isAllowed = allowedRoles.some(allowed => normalizeRole(allowed) === normalizedRole)

  return isAllowed ? children : <Navigate to="/login" />
}

export default ProtectedRoute
