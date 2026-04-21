import SharedAdvanceSettlementForm from '../Components/SharedAdvanceSettlementForm'

const LineManagerAdvanceSettlementForm = () => {
  return (
    <SharedAdvanceSettlementForm
      role="line-manager"
      mySettlementsPath="/dashboard/line-manager/my-settelment-requests"
    />
  )
}

export default LineManagerAdvanceSettlementForm
