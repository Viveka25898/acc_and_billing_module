// HouseKeeping Charges Filter Section Component
import React from 'react'
import { Search, Filter, Calendar, Download } from 'lucide-react'

const HKChargesFilterSection = () => {
  return (
    <div className="border-b bg-gray-50 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search voucher, narration..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Date Range */}
        <div className="relative">
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="date"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>

        {/* Filter by Client */}
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none">
            <option value="">All Clients</option>
            <option value="C001">ABC Corp</option>
            <option value="C002">XYZ Ltd</option>
            <option value="C003">PQR Industries</option>
          </select>
        </div>

        {/* Export Button */}
        <button className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          <Download size={18} />
          Export to Excel
        </button>
      </div>
    </div>
  )
}

export default HKChargesFilterSection
