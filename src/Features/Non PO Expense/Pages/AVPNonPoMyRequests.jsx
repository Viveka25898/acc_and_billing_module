import React from 'react'
import NonPoMyRequests from '../Components/NonPoMyRequests'

const AVPNonPoMyRequests = () => {
  return (
    <NonPoMyRequests
      role="avp-operations"
      title="My Non-PO Expense Requests"
      createPath="/dashboard/avp-operations/non-po-expense-request"
      editPathPrefix="/dashboard/avp-operations/non-po-expense-request/edit"
    />
  )
}

export default AVPNonPoMyRequests
