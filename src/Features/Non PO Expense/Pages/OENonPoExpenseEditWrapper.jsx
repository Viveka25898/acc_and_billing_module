import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const OENonPoExpenseEditWrapper = () => {
  return (
    <NonPoExpenseRequestForm
      role="operation-executive"
      myRequestsPath="/dashboard/operation-executive/my-non-po-requests"
      mode="edit"
    />
  )
}

export default OENonPoExpenseEditWrapper
