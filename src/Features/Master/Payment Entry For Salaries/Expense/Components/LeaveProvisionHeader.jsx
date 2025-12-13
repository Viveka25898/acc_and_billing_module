import React from 'react'
import { FiInfo, FiCalendar, FiTrendingUp } from 'react-icons/fi'

const LeaveProvisionHeader = () => {
  return (
    <div className="bg-gradient-to-r from-green-800 to-green-900 text-white p-6 md:p-8 border-b-4 border-blue-600">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FiTrendingUp className="w-8 h-8 text-blue-300" />
            <h1 className="text-2xl md:text-3xl font-bold">LEAVE PROVISION EXPENSE LEDGER</h1>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-white/10 p-3 rounded-lg">
          <div className="text-xs text-blue-300">Total Provision</div>
          <div className="text-lg font-bold">₹3.78 L</div>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <div className="text-xs text-blue-300">Employees</div>
          <div className="text-lg font-bold">85-90</div>
        </div>
        <div className="bg-white/10 p-3 rounded-lg">
          <div className="text-xs text-blue-300">Leave Days</div>
          <div className="text-lg font-bold">11,993</div>
        </div>
      </div>
    </div>
  )
}

export default LeaveProvisionHeader
