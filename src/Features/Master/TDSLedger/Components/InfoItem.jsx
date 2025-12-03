export const InfoItem = ({ label, value }) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-600 uppercase tracking-wide mb-1">{label}</span>
      <span className="text-sm font-semibold text-blue-900">{value}</span>
    </div>
  )
}
