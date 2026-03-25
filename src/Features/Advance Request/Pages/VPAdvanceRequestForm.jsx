import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const VPAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="vp-operations"
      myRequestsPath="/dashboard/vp-operations/my-requests"
    />
  )
}

export default VPAdvanceRequestForm