import React from 'react'
import NonPoMyRequests from '../Components/NonPoMyRequests'

const EmployeeNonPoMyRequests = () => {
  return (
    <NonPoMyRequests
      role="employee"
      title="My Non-PO Expense Requests"
      createPath="/dashboard/employee/non-po-expense-request"
      editPathPrefix="/dashboard/employee/non-po-expense-request/edit"
    />
  )
}

export default EmployeeNonPoMyRequests
