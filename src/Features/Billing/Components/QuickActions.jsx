import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, FilePlus, CreditCard } from 'lucide-react'

const QuickActions = () => {
  const navigate = useNavigate()

  const actions = [
    {
      id: 1,
      title: 'Generate Auto Invoice',
      description: 'Create automated invoice for clients',
      icon: FileText,
      bgColor: 'bg-green-600 hover:bg-green-700',
      onClick: () => navigate('/dashboard/billing-manager/auto-billing'),
    },
    {
      id: 2,
      title: 'Create Manual Bill',
      description: 'Quick manual billing for special cases',
      icon: FilePlus,
      bgColor: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => navigate('/dashboard/billing-manager/manual-billing'),
    },
    {
      id: 3,
      title: 'Add Rate Card',
      description: 'Configure new rate card for client',
      icon: CreditCard,
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      onClick: () => navigate('/dashboard/billing-manager/rate-card'),
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">⚡</span>
        Quick Actions
      </h3>
      <div className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`w-full ${action.bgColor} text-white rounded-lg p-4 flex items-center justify-between transition-all duration-300 transform hover:scale-102 shadow-md hover:shadow-lg`}
            >
              <div className="flex items-center space-x-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-xs opacity-90">{action.description}</p>
                </div>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default QuickActions
