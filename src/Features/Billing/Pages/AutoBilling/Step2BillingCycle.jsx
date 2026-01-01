import React, { useState, useEffect } from 'react'
import { AlertCircle, Calendar } from 'lucide-react'

const Step2BillingCycle = ({ formData, setFormData, onNext, onPrevious }) => {
  const [errors, setErrors] = useState({})
  const [billingCycles, setBillingCycles] = useState([])
  const [availableMonths, setAvailableMonths] = useState([])

  // Generate available months (current month + next 11 months)
  useEffect(() => {
    const currentDate = new Date()
    const months = []

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1)
      months.push({
        value: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`,
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        year: date.getFullYear(),
        month: date.getMonth(),
      })
    }

    setAvailableMonths(months)

    // Set default month if not already set
    if (!formData.selectedMonth) {
      setFormData((prev) => ({ ...prev, selectedMonth: months[0].value }))
    }
  }, [])

  // Generate billing cycles when month changes
  useEffect(() => {
    if (formData.selectedMonth) {
      generateBillingCycles(formData.selectedMonth)
    }
  }, [formData.selectedMonth])

  const generateBillingCycles = (selectedMonthValue) => {
    const [year, month] = selectedMonthValue.split('-').map(Number)
    const currentMonth = month - 1 // Convert to 0-indexed
    const currentYear = year
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1
    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear

    // Month name for display
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    const displayMonth = monthNames[currentMonth]
    const displayYear = currentYear.toString().slice(-2)

    const cycles = [
      {
        id: 1,
        month: `${displayMonth}-${displayYear}`,
        cycleFrom: `16/${prevMonth + 1}/${prevMonthYear}`,
        cycleTo: `15/${currentMonth + 1}/${currentYear}`,
        totalDays: 30,
        divisionBy: 30,
      },
      {
        id: 2,
        month: `${displayMonth}-${displayYear}`,
        cycleFrom: `21/${prevMonth + 1}/${prevMonthYear}`,
        cycleTo: `20/${currentMonth + 1}/${currentYear}`,
        totalDays: 30,
        divisionBy: 30,
      },
      {
        id: 3,
        month: `${displayMonth}-${displayYear}`,
        cycleFrom: `25/${prevMonth + 1}/${prevMonthYear}`,
        cycleTo: `25/${currentMonth + 1}/${currentYear}`,
        totalDays: 31,
        divisionBy: 31,
      },
      {
        id: 4,
        month: `${displayMonth}-${displayYear}`,
        cycleFrom: `01/${currentMonth + 1}/${currentYear}`,
        cycleTo: `31/${currentMonth + 1}/${currentYear}`,
        totalDays: 31,
        divisionBy: 31,
      },
    ]

    setBillingCycles(cycles)
  }

  const handleMonthChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      selectedMonth: e.target.value,
      selectedBillingCycle: null, // Reset cycle when month changes
    }))
    setErrors((prev) => ({ ...prev, month: '', billingCycle: '' }))
  }

  const handleCycleSelect = (cycle) => {
    setFormData((prev) => ({
      ...prev,
      selectedBillingCycle: cycle,
    }))
    setErrors((prev) => ({ ...prev, billingCycle: '' }))
  }

  const validateStep = () => {
    const newErrors = {}

    if (!formData.selectedMonth) {
      newErrors.month = 'Please select a billing month'
    }

    if (!formData.selectedBillingCycle) {
      newErrors.billingCycle = 'Please select a billing cycle'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Billing Month & Cycle</h2>
        <p className="text-gray-600 text-sm flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          Choose the billing month and appropriate cycle for{' '}
          <span className="font-semibold ml-1">{formData.customer || 'selected customer'}</span>
        </p>
      </div>

      {/* Month Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Select Billing Month <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.selectedMonth || ''}
          onChange={handleMonthChange}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all ${
            errors.month ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">-- Select Month --</option>
          {availableMonths.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
        {errors.month && (
          <div className="mt-2 flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.month}
          </div>
        )}
      </div>

      {/* Info Message if cycle already selected */}
      {formData.selectedBillingCycle && formData.selectedMonth && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
          <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <span className="font-semibold">Billing cycle already selected.</span> You can change it
            by selecting a different cycle below.
          </div>
        </div>
      )}

      {/* Billing Cycles Table */}
      {formData.selectedMonth && billingCycles.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Select Billing Cycle <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">
                    Select
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Month
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Cycle From
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-700">
                    Cycle To
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Total Days
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-700">
                    Division By
                  </th>
                </tr>
              </thead>
              <tbody>
                {billingCycles.map((cycle) => {
                  const isSelected = formData.selectedBillingCycle?.id === cycle.id

                  return (
                    <tr
                      key={cycle.id}
                      onClick={() => handleCycleSelect(cycle)}
                      className={`
                    cursor-pointer transition-colors duration-150
                    ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-50'}
                  `}
                    >
                      <td className="border border-gray-300 px-4 py-3 text-center">
                        <input
                          type="radio"
                          name="billingCycle"
                          checked={isSelected}
                          onChange={() => handleCycleSelect(cycle)}
                          className="w-5 h-5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm font-medium text-gray-900">
                        {cycle.month}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        {cycle.cycleFrom}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">
                        {cycle.cycleTo}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-center font-medium text-gray-900">
                        {cycle.totalDays}
                      </td>
                      <td className="border border-gray-300 px-4 py-3 text-sm text-center font-medium text-gray-900">
                        {cycle.divisionBy}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Error Message */}
      {errors.billingCycle && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium">{errors.billingCycle}</span>
        </div>
      )}

      {/* Selected Cycle Summary */}
      {formData.selectedBillingCycle && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
          <h3 className="text-sm font-bold text-gray-800 mb-2">✓ Selected Billing Cycle:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Period:</span>
              <p className="font-semibold text-gray-900">{formData.selectedBillingCycle.month}</p>
            </div>
            <div>
              <span className="text-gray-600">From:</span>
              <p className="font-semibold text-gray-900">
                {formData.selectedBillingCycle.cycleFrom}
              </p>
            </div>
            <div>
              <span className="text-gray-600">To:</span>
              <p className="font-semibold text-gray-900">{formData.selectedBillingCycle.cycleTo}</p>
            </div>
            <div>
              <span className="text-gray-600">Total Days:</span>
              <p className="font-semibold text-gray-900">
                {formData.selectedBillingCycle.totalDays} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-6 mt-6 border-t">
        <button
          onClick={onPrevious}
          className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Previous
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center"
        >
          Next Step
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Step2BillingCycle
