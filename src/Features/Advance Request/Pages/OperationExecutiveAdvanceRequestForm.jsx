import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const OperationExecutiveAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="operation-executive"
      myRequestsPath="/dashboard/employee/my-advance-requests"
    />
  )
}

export default OperationExecutiveAdvanceRequestForm
