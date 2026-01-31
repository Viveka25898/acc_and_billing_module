import React, { useState, useEffect } from 'react'
import { FiCalendar, FiFileText, FiDownload } from 'react-icons/fi'

/**
 * MIS Report Card Component
 * Displays individual MIS report cards with month selection and view/download actions
 */
const MISReportCard = ({
    title,
    description,
    reportKey,
    onSelectMonth,
    onViewReport,
    onDownloadReport,
    selectedPeriod
}) => {
    const [isHovered, setIsHovered] = useState(false)
    const [downloading, setDownloading] = useState(false)
    const [error, setError] = useState(null)

    // Clear error when period changes
    useEffect(() => {
        if (selectedPeriod) {
            setError(null)
        }
    }, [selectedPeriod])

    const handleSelectMonth = () => {
        try {
            if (onSelectMonth) {
                onSelectMonth(reportKey)
            }
        } catch (err) {
            console.error('MISReportCard: handleSelectMonth error', err)
            setError('Failed to open month selection')
        }
    }

    const handleViewReport = () => {
        if (!selectedPeriod) {
            setError('Please select a month first')
            return
        }

        try {
            setError(null)
            if (onViewReport) {
                onViewReport(reportKey, selectedPeriod)
            }
        } catch (err) {
            console.error('MISReportCard: handleViewReport error', err)
            setError('Failed to view report')
        }
    }

    const handleDownload = async () => {
        if (!selectedPeriod) {
            setError('Please select a month first')
            return
        }

        try {
            setDownloading(true)
            setError(null)

            if (onDownloadReport) {
                await onDownloadReport(reportKey, selectedPeriod)
            }
        } catch (err) {
            console.error('MISReportCard: handleDownload error', err)
            setError(err.message || 'Failed to download report')
        } finally {
            setDownloading(false)
        }
    }

    const getPeriodDisplayText = () => {
        if (!selectedPeriod) return null

        const { monthName, year, stateName } = selectedPeriod
        let periodText = `${monthName} ${year}`

        // Only show state filter (no client for MIS reports)
        if (stateName && stateName !== 'All') {
            return `${periodText} (State: ${stateName})`
        }

        return periodText
    }

    return (
        <div
            className="bg-white shadow-md rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col gap-4">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 truncate mb-1">
                            {title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {description}
                        </p>
                    </div>

                    <div className="flex-shrink-0">
                        <button
                            onClick={handleSelectMonth}
                            className={`w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 text-white text-sm font-medium rounded-md hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md ${isHovered ? 'scale-105' : ''
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <FiCalendar className="w-4 h-4" />
                                <span>{selectedPeriod ? 'Change Month' : 'Select Month'}</span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Selected Period Display */}
                {selectedPeriod && (
                    <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-3">
                            <FiCalendar className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">Selected Period:</span>
                            <span className="text-sm text-gray-900 font-semibold">
                                {getPeriodDisplayText()}
                            </span>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-xs text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleViewReport}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-md hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                            >
                                <FiFileText className="w-4 h-4" />
                                <span>View Report</span>
                            </button>

                            <button
                                onClick={handleDownload}
                                disabled={downloading}
                                className="flex-1 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 text-white text-sm font-medium rounded-md hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {downloading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiDownload className="w-4 h-4" />
                                        <span>Download</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Placeholder when no period selected */}
                {!selectedPeriod && (
                    <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center italic">
                            Select a month to view and download this report
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default MISReportCard
