import React from 'react'
import SharedAdvanceRequestForm from './Components/SharedAdvanceRequestForm'

const AdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="employee"
      myRequestsPath="/dashboard/employee/my-requests"
    />
  )
}

export default AdvanceRequestForm
