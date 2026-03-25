import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const ManagerAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="manager"
      myRequestsPath="/dashboard/manager/my-requests"
    />
  )
}

export default ManagerAdvanceRequestForm
