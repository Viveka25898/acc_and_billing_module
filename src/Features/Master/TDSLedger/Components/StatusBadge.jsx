import React from 'react'

const StatusBadge = ({ status }) => {
  const isPaid = status === 'Paid'
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
