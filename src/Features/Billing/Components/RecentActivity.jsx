import React from 'react'
import { Clock } from 'lucide-react'

const RecentActivity = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'invoice_generated':
        return '📄'
      case 'rate_card_updated':
        return '💳'
      case 'manual_bill_created':
        return '📝'
      case 'invoice_approved':
        return '✅'
      case 'invoice_rejected':
        return '❌'
      default:
        return '📌'
    }
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-IN')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-green-600" />
        Recent Activity
      </h3>

      {activities.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">No recent activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-3 p-3 border-l-4 border-green-500 bg-gray-50 rounded-r-lg hover:bg-green-50 transition-colors duration-200"
            >
              <span className="text-2xl flex-shrink-0">{getActivityIcon(activity.type)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 font-medium">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-center">
        <button className="text-sm text-green-600 hover:text-green-700 font-medium hover:underline">
          View All Activities →
        </button>
      </div>
    </div>
  )
}

export default RecentActivity
