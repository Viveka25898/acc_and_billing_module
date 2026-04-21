import SharedAdvanceSettlementForm from '../Components/SharedAdvanceSettlementForm'

const ComplianceManagerAdvanceSettlementForm = () => {
  return (
    <SharedAdvanceSettlementForm
      role="compliance-manager"
      mySettlementsPath="/dashboard/compliance-manager/my-settelment-requests"
    />
  )
}

export default ComplianceManagerAdvanceSettlementForm
