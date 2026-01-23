import React from 'react'

const ReportCard = ({ title, description, onOpen }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4 border">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div>
          <button
            onClick={() => onOpen && onOpen()}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
          >
            Open
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReportCard
