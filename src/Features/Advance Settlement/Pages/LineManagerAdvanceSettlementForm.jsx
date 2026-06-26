import SharedAdvanceSettlementForm from '../Components/SharedAdvanceSettlementForm'
import { useSelector } from 'react-redux'
import { selectRole } from '../../../Auth/authSlice'

const LineManagerAdvanceSettlementForm = () => {
  const role = useSelector(selectRole)
  const mySettlementsPath = role === 'regional-head'
    ? '/dashboard/regional-head/my-settelment-requests'
    : '/dashboard/line-manager/my-settelment-requests'

  return (
    <SharedAdvanceSettlementForm
      role={role || 'line-manager'}
      mySettlementsPath={mySettlementsPath}
    />
  )
}

export default LineManagerAdvanceSettlementForm

