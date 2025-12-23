import React, { useState } from 'react'

const MonthlyFilter = ({ onFilterChange }) => {
  const [selectedYear, setSelectedYear] = useState('2024-2025')
  const [selectedMonth, setSelectedMonth] = useState('All Months')

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value)
    onFilterChange?.({ year: e.target.value, month: selectedMonth })
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
    onFilterChange?.({ year: selectedYear, month: e.target.value })
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8 border-t-4 border-teal-600">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-teal-800 flex items-center gap-3">
          <i className="fas fa-chart-bar"></i>
          Monthly Bonus Expense Summary
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <span className="text-gray-600 text-sm">Filter by:</span>
          <div className="flex gap-2">
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
              <option value="2022-2023">2022-2023</option>
            </select>

            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            >
              <option value="All Months">All Months</option>
              <option value="April 2024">April 2024</option>
              <option value="May 2024">May 2024</option>
              <option value="June 2024">June 2024</option>
              <option value="July 2024">July 2024</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-teal-50 p-5 rounded-lg border border-teal-100">
          <h3 className="text-sm text-gray-600 mb-2">Total Bonus Paid (FY 2024-25)</h3>
          <div className="text-2xl font-bold text-teal-800">₹ 6,45,000</div>
          <p className="text-sm text-gray-500 mt-1">April 2024 - Till Date</p>
        </div>

        <div className="bg-amber-50 p-5 rounded-lg border border-amber-100">
          <h3 className="text-sm text-gray-600 mb-2">Average Monthly Bonus</h3>
          <div className="text-2xl font-bold text-amber-700">₹ 1,29,000</div>
          <p className="text-sm text-gray-500 mt-1">Based on 5 months data</p>
        </div>

        <div className="bg-red-50 p-5 rounded-lg border border-red-100">
          <h3 className="text-sm text-gray-600 mb-2">Highest Bonus Month</h3>
          <div className="text-2xl font-bold text-red-700">₹ 1,80,000</div>
          <p className="text-sm text-gray-500 mt-1">March 2024 (Year-end)</p>
        </div>

        <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <h3 className="text-sm text-gray-600 mb-2">Lowest Bonus Month</h3>
          <div className="text-2xl font-bold text-blue-700">₹ 85,000</div>
          <p className="text-sm text-gray-500 mt-1">July 2024</p>
        </div>
      </div>
    </div>
  )
}

export default MonthlyFilter
