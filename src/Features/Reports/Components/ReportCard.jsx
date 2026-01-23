import React from 'react'

const ReportCard = ({ title, description, onOpen }) => {
  const handleOpen = () => {
    try {
      if (onOpen) {
        onOpen()
      }
    } catch (err) {
      console.error('ReportCard: handleOpen error', err)
    }
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 sm:p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">{title}</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">{description}</p>
        </div>
        <div className="flex-shrink-0">
          <button
            onClick={handleOpen}
            className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportCard
