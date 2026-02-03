import React, { useState, useEffect } from 'react'
import { FiX, FiCalendar, FiMapPin } from 'react-icons/fi'

/**
 * MIS Month Selection Modal
 * Allows selection of Year, Month, and State only (no Client filter)
 */
const MISMonthSelectionModal = ({ isOpen, onClose, onSelect }) => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [selectedMonth, setSelectedMonth] = useState(currentMonth)
    const [selectedState, setSelectedState] = useState('All')
    const [states, setStates] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const months = [
        { value: 1, label: 'January' },
        { value: 2, label: 'February' },
        { value: 3, label: 'March' },
        { value: 4, label: 'April' },
        { value: 5, label: 'May' },
        { value: 6, label: 'June' },
        { value: 7, label: 'July' },
        { value: 8, label: 'August' },
        { value: 9, label: 'September' },
        { value: 10, label: 'October' },
        { value: 11, label: 'November' },
        { value: 12, label: 'December' }
    ]

    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i)

    // Load states from localStorage
    useEffect(() => {
        if (!isOpen) return

        try {
            setLoading(true)
            setError(null)

            // Load states from rate cards or billing data
            const rateCardsData = localStorage.getItem('rateCards')
            if (rateCardsData) {
                const rateCards = JSON.parse(rateCardsData)
                const uniqueStates = new Set()

                rateCards.forEach(card => {
                    if (card.state) {
                        uniqueStates.add(card.state)
                    }
                })

                const statesList = Array.from(uniqueStates).sort()
                setStates(statesList)
            } else {
                // Fallback to hardcoded states if no data
                setStates([
                    'Karnataka',
                    'Tamil Nadu',
                    'Maharashtra',
                    'Delhi',
                    'Gujarat',
                    'Telangana',
                    'West Bengal'
                ])
            }
        } catch (err) {
            console.error('MISMonthSelectionModal: Error loading states', err)
            setError('Failed to load states')
            setStates([])
        } finally {
            setLoading(false)
        }
    }, [isOpen])

    const handleSubmit = (e) => {
        e.preventDefault()

        try {
            if (!selectedYear || !selectedMonth) {
                setError('Please select both year and month')
                return
            }

            const monthData = {
                year: selectedYear,
                month: selectedMonth,
                monthName: months.find(m => m.value === selectedMonth)?.label || '',
                state: selectedState,
                stateName: selectedState,
                periodType: 'monthly'
            }

            console.log('MIS Month Selection:', monthData)

            if (onSelect) {
                onSelect(monthData)
            }

            handleClose()
        } catch (err) {
            console.error('MISMonthSelectionModal: handleSubmit error', err)
            setError('Failed to submit selection')
        }
    }

    const handleClose = () => {
        try {
            setError(null)
            if (onClose) {
                onClose()
            }
        } catch (err) {
            console.error('MISMonthSelectionModal: handleClose error', err)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
                    <div className="flex items-center gap-3">
                        <FiCalendar className="w-6 h-6" />
                        <h2 className="text-xl font-bold">Select Period for MIS Report</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
                        aria-label="Close modal"
                    >
                        <FiX className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <form onSubmit={handleSubmit} className="p-6">
                    {/* Error Display */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-600 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-center gap-3">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                            <p className="text-sm text-blue-700">Loading states...</p>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Year Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiCalendar className="w-4 h-4 text-green-600" />
                                Year <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                                required
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Month Selection */}
                        <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiCalendar className="w-4 h-4 text-green-600" />
                                Month <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                                required
                            >
                                {months.map(month => (
                                    <option key={month.value} value={month.value}>
                                        {month.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* State Selection */}
                        {/* <div>
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                <FiMapPin className="w-4 h-4 text-green-600" />
                                State
                            </label>
                            <select
                                value={selectedState}
                                onChange={(e) => setSelectedState(e.target.value)}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                            >
                                <option value="All">All States</option>
                                {states.map(state => (
                                    <option key={state} value={state}>
                                        {state}
                                    </option>
                                ))}
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                Select a specific state or choose "All States" for consolidated report
                            </p>
                        </div> */}
                    </div>

                    {/* Summary Box */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Selected Period:</h3>
                        <div className="space-y-1">
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">Period:</span>{' '}
                                {months.find(m => m.value === selectedMonth)?.label} {selectedYear}
                            </p>
                            <p className="text-sm text-gray-800">
                                <span className="font-medium">State:</span>{' '}
                                {selectedState}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? 'Loading...' : 'Generate Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default MISMonthSelectionModal
