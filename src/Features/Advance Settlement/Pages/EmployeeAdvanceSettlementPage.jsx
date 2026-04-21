import SharedAdvanceSettlementForm from '../Components/SharedAdvanceSettlementForm'

const EmployeeAdvanceSettlementPage = () => {
  return (
    <SharedAdvanceSettlementForm
      role="employee"
      mySettlementsPath="/dashboard/employee/my-settelment-requests"
    />
  )
}

export default EmployeeAdvanceSettlementPage
