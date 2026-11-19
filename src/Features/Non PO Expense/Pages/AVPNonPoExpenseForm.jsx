import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const AVPNonPoExpenseForm = () => {
  return (
    <NonPoExpenseRequestForm
      role="avp-operations"
      myRequestsPath="/dashboard/avp-operations/my-non-po-requests"
      mode="create"
    />
  )
}

export default AVPNonPoExpenseForm
