import React from 'react'
import NonPoMyRequests from '../Components/NonPoMyRequests'

const RHNonPoMyRequests = () => {
  return (
    <NonPoMyRequests
      role="regional-head"
      title="My Non-PO Expense Requests"
      createPath="/dashboard/regional-head/non-po-expense-request"
      editPathPrefix="/dashboard/regional-head/non-po-expense-request/edit"
    />
  )
}

export default RHNonPoMyRequests
