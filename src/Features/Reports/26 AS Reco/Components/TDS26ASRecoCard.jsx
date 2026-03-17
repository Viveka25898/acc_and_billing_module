const TDS26ASRecoCard = ({ title, value, subValue, tone = 'green' }) => {
  const toneMap = {
    green: 'border-green-200 bg-green-50 text-green-800',
    yellow: 'border-yellow-200 bg-yellow-50 text-yellow-800',
    red: 'border-red-200 bg-red-50 text-red-800',
    gray: 'border-gray-200 bg-white text-gray-800',
  }

  const classes = toneMap[tone] || toneMap.gray

  return (
    <div className={`rounded-xl border p-4 shadow-sm ${classes}`}>
      <p className="text-xs font-semibold uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {subValue ? <p className="mt-1 text-sm opacity-90">{subValue}</p> : null}
    </div>
  )
}

export default TDS26ASRecoCard
