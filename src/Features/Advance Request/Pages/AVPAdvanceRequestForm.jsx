import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const AVPA = () => {
  return (
    <SharedAdvanceRequestForm
      role="avp-operations"
      myRequestsPath="/dashboard/avp-operations/my-requests"
    />
  )
}

export default AVPA
