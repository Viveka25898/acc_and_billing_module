import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const AVPNonPoExpenseEditWrapper = () => {
  return (
    <NonPoExpenseRequestForm
      role="avp-operations"
      myRequestsPath="/dashboard/avp-operations/my-non-po-requests"
      mode="edit"
    />
  )
}

export default AVPNonPoExpenseEditWrapper
