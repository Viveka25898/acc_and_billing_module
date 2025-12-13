import React from 'react'
import {
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiUsers,
  FiCalendar,
  FiBarChart2,
  FiPercent,
  FiCheckCircle,
} from 'react-icons/fi'

const SummaryCardsLeaveProvision = ({ summaryData, filters }) => {
  const getIcon = (type, trend) => {
    switch (type) {
      case 'debit':
        return <FiTrendingUp className="w-5 h-5 text-red-600" />
      case 'credit':
        return <FiTrendingDown className="w-5 h-5 text-green-600" />
      case 'liability':
        return <FiDollarSign className="w-5 h-5 text-purple-600" />
      case 'utilization':
        return <FiPercent className="w-5 h-5 text-blue-600" />
      default:
        if (trend === 'over') return <FiTrendingUp className="w-5 h-5 text-red-600" />
        if (trend === 'under') return <FiTrendingDown className="w-5 h-5 text-green-600" />
        return <FiBarChart2 className="w-5 h-5 text-gray-600" />
    }
  }

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'up':
      case 'over':
        return 'bg-red-50 border-red-200'
      case 'down':
      case 'under':
        return 'bg-green-50 border-green-200'
      case 'stable':
        return 'bg-blue-50 border-blue-200'
      case 'flat':
        return 'bg-gray-50 border-gray-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  const getValueColor = (type, trend) => {
    switch (type) {
      case 'debit':
        return 'text-red-700'
      case 'credit':
        return 'text-green-700'
      case 'balance':
        return 'text-blue-700'
      case 'variance':
        return trend === 'over' ? 'text-red-700' : 'text-green-700'
      case 'liability':
        return 'text-purple-700'
      case 'utilization':
        return 'text-blue-700'
      default:
        return 'text-gray-800'
    }
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Financial Summary & Analytics</h2>
        <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
          {filters.period === 'custom'
            ? `${filters.fromDate} to ${filters.toDate}`
            : `H1 FY 2024-25`}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4">
        {summaryData.map((card) => (
          <div
            key={card.id}
            className={`${getTrendColor(card.trend)} border rounded-xl p-4 hover:shadow-md transition-all duration-300 group relative overflow-hidden`}
          >
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              {card.type === 'debit' && <div className="text-4xl">📈</div>}
              {card.type === 'credit' && <div className="text-4xl">📉</div>}
              {card.type === 'balance' && <div className="text-4xl">⚖️</div>}
            </div>

            <div className="relative">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getIcon(card.type, card.trend)}
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    {card.title}
                  </h4>
                </div>
                {card.trend === 'over' && (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Over Budget
                  </span>
                )}
                {card.trend === 'under' && (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Under Budget
                  </span>
                )}
              </div>

              {/* Main Value */}
              <div className="mb-2">
                <div className={`text-xl font-bold ${getValueColor(card.type, card.trend)}`}>
                  {card.value}
                </div>
                {card.trend === 'up' && (
                  <div className="flex items-center gap-1 text-xs text-red-600 mt-1">
                    <FiTrendingUp className="w-3 h-3" />
                    <span>Increasing trend</span>
                  </div>
                )}
                {card.trend === 'down' && (
                  <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                    <FiTrendingDown className="w-3 h-3" />
                    <span>Decreasing trend</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-600 mb-3">{card.label}</p>

              {/* Status Indicators */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div className="text-xs text-gray-500">
                  {card.id === 1 && (
                    <span className="flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" /> New FY
                    </span>
                  )}
                  {card.id === 2 && (
                    <span className="flex items-center gap-1">
                      <FiUsers className="w-3 h-3" /> 85-90 employees
                    </span>
                  )}
                  {card.id === 3 && (
                    <span className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" /> H1 Adjustment
                    </span>
                  )}
                  {card.id === 4 && (
                    <span className="flex items-center gap-1">
                      <FiBarChart2 className="w-3 h-3" /> Net Expense
                    </span>
                  )}
                </div>

                {/* Quick Actions */}
                {card.type === 'variance' && (
                  <button className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                    Details
                  </button>
                )}
              </div>
            </div>

            {/* Tooltip on Hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 rounded-xl" />
          </div>
        ))}
      </div>

      {/* Summary Analytics Bar */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Budget Utilization</span>
            <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">102.5%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '102.5%' }}></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Budget: ₹3.69L</span>
            <span>Actual: ₹3.78L</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Employee Coverage</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              90 Employees
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-blue-700">85</div>
              <div className="text-xs text-gray-500">Apr Start</div>
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '105.9%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>+5.9% Growth</span>
                <span>90 Current</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Actuarial Accuracy</span>
            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              97.9%
            </span>
          </div>
          <div className="text-sm text-gray-600">
            <div className="flex justify-between mb-1">
              <span>Projected: ₹15.92L</span>
              <span>Actual: ₹15.58L</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '97.9%' }}></div>
            </div>
            <div className="text-xs text-gray-500 mt-1 text-center">Variance: ₹34,000 (2.1%)</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCardsLeaveProvision
