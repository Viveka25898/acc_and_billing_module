import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const OperationExecutiveAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="operation-executive"
      myRequestsPath="/dashboard/operation-executive/my-advance-requests"
    />
  )
}

export default OperationExecutiveAdvanceRequestForm
