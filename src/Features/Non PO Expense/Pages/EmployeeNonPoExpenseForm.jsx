import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const EmployeeNonPoExpenseForm = () => {
  return (
    <NonPoExpenseRequestForm
      role="employee"
      myRequestsPath="/dashboard/employee/my-non-po-requests"
      mode="create"
    />
  )
}

export default EmployeeNonPoExpenseForm
