import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const RHNonPoExpenseForm = () => {
  return (
    <NonPoExpenseRequestForm
      role="regional-head"
      myRequestsPath="/dashboard/regional-head/my-non-po-requests"
      mode="create"
    />
  )
}

export default RHNonPoExpenseForm
