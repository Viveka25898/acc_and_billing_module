import React from 'react'
import { STATUS_COLORS } from '../config/nonPoExpenseConfig'

const NonPoStatusBadge = ({ status }) => {
  if (!status) return <span className="text-gray-400">—</span>

  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-700 border-gray-200'

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide whitespace-nowrap shadow-xs ${colorClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {status}
    </span>
  )
}

export default NonPoStatusBadge
