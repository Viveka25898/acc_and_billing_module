import { useEffect, useState } from 'react'
import ManagerReview from '../Components/ManagerReview'
import { useNavigate } from 'react-router-dom'

const ExpenseRequestsPage = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user'))
    const allUsers = JSON.parse(localStorage.getItem('users')) || []
    let fullUser = allUsers.find((u) => u.username === user?.username)

    // Fallback: If user not found in users array, create a basic user object
    if (!fullUser && user) {
      fullUser = {
        username: user.username,
        role: user.role,
        fullName: user.username,
        empId: `emp-${Date.now()}`,
        reportsTo: null,
        site: 'Unknown',
        department: 'Operations',
        designation: 'Manager',
        glCode: null,
        osBalance: 0,
        email: '',
        mobile: '',
      }
      console.warn('⚠️ User not found in users array, using fallback user object')
    }

    if (!fullUser) {
      // Redirect if user not found
      navigate('/login')
      return
    }

    // Check if user has manager role
    if (!['line-manager', 'vp-operations', 'account-executive'].includes(fullUser.role)) {
      navigate('/unauthorized')
      return
    }

    setCurrentUser(fullUser)
  }, [navigate])

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-white py-10 px-4 flex items-center justify-center">
        Loading manager data...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-10 px-4">
      <ManagerReview currentUser={currentUser} />
    </div>
  )
}

export default ExpenseRequestsPage
