import React from 'react'
import { summaryData } from '../data/lwfLedgerData'

const SummaryCards = () => {
  const getColorClass = (type) => {
    switch (type) {
      case 'credit':
        return 'text-red-600'
      case 'debit':
        return 'text-green-600'
      case 'balance':
        return 'text-blue-600'
      case 'pending':
        return 'text-red-500'
      case 'aging':
        return 'text-orange-500'
      default:
        return 'text-gray-900'
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 p-6 md:p-8 bg-gray-50">
      {summaryData.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-lg relative overflow-hidden group hover:shadow-xl"
        >
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-radial from-blue-100 to-transparent" />
          <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-3">
            {card.title}
          </h4>
          <div className={`text-2xl md:text-3xl font-bold mb-2 ${getColorClass(card.type)}`}>
            {card.value}
          </div>
          <div className="text-xs text-gray-500 mt-2">{card.label}</div>
        </div>
      ))}
    </div>
  )
}

export default SummaryCards
