import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const RHNonPoExpenseEditWrapper = () => {
  return (
    <NonPoExpenseRequestForm
      role="regional-head"
      myRequestsPath="/dashboard/regional-head/my-non-po-requests"
      mode="edit"
    />
  )
}

export default RHNonPoExpenseEditWrapper
