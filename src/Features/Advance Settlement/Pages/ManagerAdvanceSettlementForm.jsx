import SharedAdvanceSettlementForm from '../Components/SharedAdvanceSettlementForm'

const ManagerAdvanceSettlementForm = () => {
  return (
    <SharedAdvanceSettlementForm
      role="manager"
      mySettlementsPath="/dashboard/manager/my-settelment-requests"
    />
  )
}

export default ManagerAdvanceSettlementForm
