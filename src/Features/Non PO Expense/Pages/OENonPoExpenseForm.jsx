import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const OENonPoExpenseForm = () => {
  return (
    <NonPoExpenseRequestForm
      role="operation-executive"
      myRequestsPath="/dashboard/operation-executive/my-non-po-requests"
      mode="create"
    />
  )
}

export default OENonPoExpenseForm
