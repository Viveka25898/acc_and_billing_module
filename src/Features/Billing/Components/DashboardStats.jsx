import React from 'react'
import { TrendingUp, FileText, Percent, Users } from 'lucide-react'

const DashboardStats = ({ stats }) => {
  const statsData = [
    {
      id: 1,
      title: 'This Month Revenue',
      value: `₹${stats.monthlyRevenue.toLocaleString('en-IN')}`,
      icon: TrendingUp,
      bgColor: 'from-green-500 to-green-600',
      iconColor: 'text-green-100',
    },
    {
      id: 2,
      title: 'Pending Invoices',
      value: stats.pendingInvoices,
      icon: FileText,
      bgColor: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-100',
    },
    {
      id: 3,
      title: 'Profit Margin',
      value: `${stats.profitMargin}%`,
      icon: Percent,
      bgColor: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-100',
    },
    {
      id: 4,
      title: 'Active Clients',
      value: stats.activeClients,
      icon: Users,
      bgColor: 'from-orange-500 to-orange-600',
      iconColor: 'text-orange-100',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statsData.map((stat) => {
        const Icon = stat.icon
        return (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${stat.bgColor} rounded-lg shadow-lg p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 bg-white bg-opacity-20 rounded-lg ${stat.iconColor}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm opacity-90">{stat.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default DashboardStats
