// Shared Badge Component for all Billing Ledgers
import React from 'react'

const Badge = ({ type, children }) => {
  const getColorClasses = () => {
    switch (type?.toLowerCase()) {
      case 'invoice':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'payment':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'receipt':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'posted':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'vendor':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200'
      case 'client':
        return 'bg-cyan-100 text-cyan-700 border-cyan-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getColorClasses()}`}
    >
      {children}
    </span>
  )
}

export default Badge
