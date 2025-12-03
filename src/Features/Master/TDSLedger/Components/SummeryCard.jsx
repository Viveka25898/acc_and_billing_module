import React from 'react'

export const SummaryCard = ({ label, value, icon = '📊', color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  }

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    orange: 'text-orange-600',
    gray: 'text-gray-600',
  }

  return (
    <div className={`rounded-lg border p-4 ${colorClasses[color] || colorClasses.blue}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-sm font-medium opacity-80 mb-1">{label}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        <div className={`text-2xl ${iconColors[color] || iconColors.blue}`}>{icon}</div>
      </div>
      {/* Progress bar for TDS cards */}
      {(label.includes('TDS') || label.includes('Outstanding')) && (
        <div className="mt-3">
          <div className="h-2 bg-white bg-opacity-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-current opacity-30 rounded-full"
              style={{ width: '75%' }} // This could be dynamic based on data
            ></div>
          </div>
        </div>
      )}
    </div>
  )
}
