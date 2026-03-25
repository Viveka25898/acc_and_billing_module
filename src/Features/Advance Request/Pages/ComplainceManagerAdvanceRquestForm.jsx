import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const ComplianceManagerAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="compliance-manager"
      myRequestsPath="/dashboard/compliance-manager/my-request"
    />
  )
}

export default ComplianceManagerAdvanceRequestForm
