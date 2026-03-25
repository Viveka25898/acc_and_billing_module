import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const ComplianceTeamAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="compliance-team"
      myRequestsPath="/dashboard/compliance-team/my-requests"
    />
  )
}

export default ComplianceTeamAdvanceRequestForm
