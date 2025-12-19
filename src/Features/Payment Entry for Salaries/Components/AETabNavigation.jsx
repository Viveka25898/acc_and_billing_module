const AETabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'salary', label: 'Salary Payment Requests' },
    { id: 'monthLock', label: 'Month Lock Requests' },
  ]

  return (
    <div className="mb-6 border-b border-gray-200">
      <nav className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              py-3 px-4 font-medium text-sm border-b-2 transition-colors duration-200
              ${
                activeTab === tab.id
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50
            `}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  )
}
export default AETabNavigation
