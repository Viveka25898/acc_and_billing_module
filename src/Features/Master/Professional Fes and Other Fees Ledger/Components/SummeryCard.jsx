export const SummaryCard = ({ label, value }) => {
  return (
    <div className="bg-white rounded-lg p-3 text-center shadow-sm">
      <p className="text-xs uppercase tracking-wide text-gray-600 mb-2">{label}</p>
      <p className="text-base font-bold text-gray-900">{value}</p>
    </div>
  )
}
