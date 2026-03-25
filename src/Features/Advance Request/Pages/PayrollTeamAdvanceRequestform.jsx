import React from 'react'
import SharedAdvanceRequestForm from '../Components/SharedAdvanceRequestForm'

const PayrollTeamAdvanceRequestForm = () => {
  return (
    <SharedAdvanceRequestForm
      role="payroll-team"
      myRequestsPath="/dashboard/payroll-team/my-request"
    />
  )
}

export default PayrollTeamAdvanceRequestForm
