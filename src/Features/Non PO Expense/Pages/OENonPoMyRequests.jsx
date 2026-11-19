import React from 'react'
import NonPoMyRequests from '../Components/NonPoMyRequests'

const OENonPoMyRequests = () => {
  return (
    <NonPoMyRequests
      role="operation-executive"
      title="My Non-PO Expense Requests"
      createPath="/dashboard/operation-executive/non-po-expense-request"
      editPathPrefix="/dashboard/operation-executive/non-po-expense-request/edit"
    />
  )
}

export default OENonPoMyRequests
