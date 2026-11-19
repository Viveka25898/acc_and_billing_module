import React from 'react'
import { URGENCY_COLORS } from '../config/nonPoExpenseConfig'

const NonPoUrgencyBadge = ({ urgency }) => {
  if (!urgency) return <span className="text-gray-400">—</span>

  const key = urgency.toLowerCase()
  const colorClass = URGENCY_COLORS[key] || 'bg-gray-100 text-gray-700 border-gray-200'

  const label =
    key === 'critical'
      ? 'Critical'
      : key === 'high'
      ? 'High'
      : 'Normal'

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border uppercase tracking-wider ${colorClass}`}
    >
      {key === 'critical' && <span className="mr-1 text-red-500 font-bold">⚡</span>}
      {label}
    </span>
  )
}

export default NonPoUrgencyBadge
