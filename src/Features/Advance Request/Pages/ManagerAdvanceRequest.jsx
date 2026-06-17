import React from 'react'
import { useSelector } from 'react-redux'
import { selectRole } from '../../../Auth/authSlice'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

// Derive myRequestsPath from the logged-in role so Regional Head uses /dashboard/regional-head/*
const MY_REQUESTS_PATH = {
  'line-manager':  '/dashboard/line-manager/my-requests',
  'regional-head': '/dashboard/regional-head/my-requests',
}

const ManagerAdvanceRequest = () => {
  const role = useSelector(selectRole)
  const myRequestsPath = MY_REQUESTS_PATH[role] || '/dashboard/line-manager/my-requests'

  return <SharedAdvanceRequestForm role={role} myRequestsPath={myRequestsPath} />
}

export default ManagerAdvanceRequest
