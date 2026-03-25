import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const ManagerAdvanceRequest = () => {
  return (
    <SharedAdvanceRequestForm
      role="line-manager"
      myRequestsPath="/dashboard/line-manager/my-requests"
    />
  )
}

export default ManagerAdvanceRequest
