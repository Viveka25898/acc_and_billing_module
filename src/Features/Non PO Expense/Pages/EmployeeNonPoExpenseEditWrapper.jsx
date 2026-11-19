import React from 'react'
import NonPoExpenseRequestForm from '../Components/NonPoExpenseRequestForm'

const EmployeeNonPoExpenseEditWrapper = () => {
  return (
    <NonPoExpenseRequestForm
      role="employee"
      myRequestsPath="/dashboard/employee/my-non-po-requests"
      mode="edit"
    />
  )
}

export default EmployeeNonPoExpenseEditWrapper
