import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp, FiPrinter, FiDownload, FiArrowLeft } from 'react-icons/fi'
import { PL_KEYS } from '../../Services/PLReportDataService'
import PLScheduleTable from './PLScheduleTable'

const PLReportViewer = ({ data, onBack }) => {
    const [expandedSchedules, setExpandedSchedules] = useState({})

    if (!data || !data.success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Report</div>
                <p className="text-gray-600">{data?.error || 'No report data available.'}</p>
                <button
                    onClick={onBack}
                    className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                    <FiArrowLeft /> Back to Dashboard
                </button>
            </div>
        )
    }

    const { current, previous, meta, schedule } = data
    const { periodLabel, filters } = meta

    const toggleSchedule = (key) => {
        setExpandedSchedules(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

    const formatCurrency = (amount) => {
        // Schedule III typically uses standard comma formatting (e.g. 1,23,456)
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0)
    }

    const ScheduleRow = ({
        srNo,
        label,
        noteNo,
        currentAmount,
        prevAmount,
        isBold = false,
        isTotal = false,
        plKey = null
    }) => {
        // Determine if this row has a drill-down
        const hasDrillDown = plKey &&
            [
                PL_KEYS.REVENUE_FROM_OPS,
                PL_KEYS.OTHER_INCOME,
                PL_KEYS.COST_OF_MATERIALS,
                PL_KEYS.EMPLOYEE_BENEFITS,
                PL_KEYS.FINANCE_COSTS,
                PL_KEYS.OTHER_EXPENSES
            ].includes(plKey)

        return (
            <>
                <tr className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${isTotal ? 'bg-gray-100 border-t-2 border-gray-400' : ''}`}>
                    <td className="py-2 px-4 w-12 text-center font-medium text-gray-700">{srNo}</td>
                    <td className="py-2 px-4">
                        <div
                            className={`flex items-center gap-2 ${hasDrillDown ? 'cursor-pointer group' : ''}`}
                            onClick={() => hasDrillDown && toggleSchedule(plKey)}
                        >
                            <span className={`${isBold || isTotal ? 'font-bold text-gray-900' : 'text-gray-700'} ${hasDrillDown ? 'group-hover:text-green-700' : ''}`}>
                                {label}
                            </span>
                            {hasDrillDown && (
                                <span className="text-gray-400 text-xs group-hover:text-green-600">
                                    {expandedSchedules[plKey] ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="py-2 px-4 w-24 text-center">
                        {noteNo && (
                            <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-gray-100 text-gray-600 rounded border border-gray-300">
                                {noteNo}
                            </span>
                        )}
                    </td>
                    <td className={`py-2 px-4 text-right w-40 ${isBold || isTotal ? 'font-bold text-gray-900' : 'text-gray-700'}`}>
                        {formatCurrency(currentAmount)}
                    </td>
                    <td className={`py-2 px-4 text-right w-40 ${isBold || isTotal ? 'font-bold text-gray-500' : 'text-gray-500'}`}>
                        {formatCurrency(prevAmount)}
                    </td>
                </tr>
                {/* Drill Down Schedule */}
                {hasDrillDown && expandedSchedules[plKey] && (
                    <tr>
                        <td colSpan="5" className="p-0 bg-gray-50">
                            <PLScheduleTable
                                title={label}
                                noteNo={noteNo}
                                data={(schedule.current?.schedule && schedule.current.schedule[plKey]) || {}}
                                previousData={(schedule.previous?.schedule && schedule.previous.schedule[plKey]) || {}}
                            />
                        </td>
                    </tr>
                )}
            </>
        )
    }

    return (
        <div className="bg-white min-h-screen">
            {/* Header Toolbar */}
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm px-6 py-4 flex items-center justify-between print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
                        title="Back to Dashboard"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Statement of Profit and Loss</h1>
                        <p className="text-sm text-gray-500">{periodLabel} • {filters.client || 'All Clients'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 px-4 py-2 border border-green-600 text-green-600 rounded hover:bg-green-50 transition-colors"
                    >
                        <FiPrinter /> Print
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 shadow-sm transition-colors">
                        <FiDownload /> Excel
                    </button>
                </div>
            </div>

            {/* Main Report Content */}
            <div className="max-w-5xl mx-auto p-8 print:p-0 print:w-full">
                {/* Report Header for Print/View */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">I SMART FACITECH PRIVATE LIMITED</h2>
                    <p className="text-sm font-semibold italic text-gray-600 mt-1">(Formerly known as "Comfort Facility Management Services Private Limited")</p>
                    <div className="mt-4 border-t-2 border-b-2 border-gray-800 py-2 inline-block w-full">
                        <h3 className="text-lg font-bold text-gray-900">Profit & Loss Account for the period ended on {periodLabel}</h3>
                    </div>
                </div>

                {/* Schedule III Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 py-3 px-4 text-center font-bold text-gray-800 w-12">I/II</th>
                                <th className="border border-gray-300 py-3 px-4 text-left font-bold text-gray-800">Particulars</th>
                                <th className="border border-gray-300 py-3 px-4 text-center font-bold text-gray-800 w-24">Note No</th>
                                <th className="border border-gray-300 py-3 px-4 text-right font-bold text-gray-800 w-40">Current Period</th>
                                <th className="border border-gray-300 py-3 px-4 text-right font-bold text-gray-800 w-40">Previous Year</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* === REVENUE === */}
                            <ScheduleRow
                                srNo="I."
                                label="Revenue from Operations"
                                noteNo="15"
                                plKey={PL_KEYS.REVENUE_FROM_OPS}
                                currentAmount={current[PL_KEYS.REVENUE_FROM_OPS]}
                                prevAmount={previous[PL_KEYS.REVENUE_FROM_OPS]}
                            />
                            <ScheduleRow
                                srNo="II."
                                label="Other Income"
                                noteNo="16"
                                plKey={PL_KEYS.OTHER_INCOME}
                                currentAmount={current[PL_KEYS.OTHER_INCOME]}
                                prevAmount={previous[PL_KEYS.OTHER_INCOME]}
                            />
                            <ScheduleRow
                                srNo="III."
                                label="Total Revenue (I + II)"
                                isTotal
                                currentAmount={current[PL_KEYS.TOTAL_REVENUE]}
                                prevAmount={previous[PL_KEYS.TOTAL_REVENUE]}
                            />

                            {/* === EXPENSES === */}
                            <tr className="bg-white"><td colSpan="5" className="py-4"></td></tr>
                            <tr>
                                <td className="py-2 px-4 font-bold text-gray-800">IV.</td>
                                <td colSpan="4" className="py-2 px-4 font-bold text-gray-800 underline">Expenses:</td>
                            </tr>

                            <ScheduleRow
                                label="Cost of Materials Consumed"
                                noteNo="17"
                                plKey={PL_KEYS.COST_OF_MATERIALS}
                                currentAmount={current[PL_KEYS.COST_OF_MATERIALS]}
                                prevAmount={previous[PL_KEYS.COST_OF_MATERIALS]}
                            />
                            <ScheduleRow
                                label="Changes in Inventories"
                                noteNo=""
                                currentAmount={0}
                                prevAmount={0}
                            />
                            <ScheduleRow
                                label="Employee Benefit Expenses"
                                noteNo="18"
                                plKey={PL_KEYS.EMPLOYEE_BENEFITS}
                                currentAmount={current[PL_KEYS.EMPLOYEE_BENEFITS]}
                                prevAmount={previous[PL_KEYS.EMPLOYEE_BENEFITS]}
                            />
                            <ScheduleRow
                                label="Finance Costs"
                                noteNo="19"
                                plKey={PL_KEYS.FINANCE_COSTS}
                                currentAmount={current[PL_KEYS.FINANCE_COSTS]}
                                prevAmount={previous[PL_KEYS.FINANCE_COSTS]}
                            />
                            <ScheduleRow
                                label="Depreciation and Amortization Expense"
                                noteNo="9"
                                plKey={PL_KEYS.DEPRECIATION_AMORT}
                                currentAmount={current[PL_KEYS.DEPRECIATION_AMORT]}
                                prevAmount={previous[PL_KEYS.DEPRECIATION_AMORT]}
                            />
                            <ScheduleRow
                                label="Other Expenses"
                                noteNo="20"
                                plKey={PL_KEYS.OTHER_EXPENSES}
                                currentAmount={current[PL_KEYS.OTHER_EXPENSES]}
                                prevAmount={previous[PL_KEYS.OTHER_EXPENSES]}
                            />
                            <ScheduleRow
                                srNo="V."
                                label="Total Expenses"
                                isTotal
                                currentAmount={current[PL_KEYS.TOTAL_EXPENSES]}
                                prevAmount={previous[PL_KEYS.TOTAL_EXPENSES]}
                            />

                            {/* === PROFIT === */}
                            <tr className="bg-white"><td colSpan="5" className="py-4"></td></tr>
                            <ScheduleRow
                                srNo="VI."
                                label="Profit before tax for the year (III - V)"
                                isBold
                                currentAmount={current[PL_KEYS.PROFIT_BEFORE_TAX]}
                                prevAmount={previous[PL_KEYS.PROFIT_BEFORE_TAX]}
                            />

                            <tr>
                                <td className="py-2 px-4 font-bold text-gray-800">VII.</td>
                                <td colSpan="4" className="py-2 px-4 font-bold text-gray-800 underline">Tax Expense:</td>
                            </tr>
                            <ScheduleRow
                                label="Current Tax"
                                currentAmount={current[PL_KEYS.CURRENT_TAX]}
                                prevAmount={previous[PL_KEYS.CURRENT_TAX]}
                            />
                            <ScheduleRow
                                label="Deferred Tax"
                                currentAmount={current[PL_KEYS.DEFERRED_TAX]}
                                prevAmount={previous[PL_KEYS.DEFERRED_TAX]}
                            />
                            <ScheduleRow
                                label="Total Tax Expense"
                                isBold
                                currentAmount={current[PL_KEYS.TAX_SUBTOTAL]}
                                prevAmount={previous[PL_KEYS.TAX_SUBTOTAL]}
                            />

                            <tr className="bg-white"><td colSpan="5" className="py-4"></td></tr>
                            <ScheduleRow
                                srNo="VIII."
                                label="Profit after tax for the year (VI - VII)"
                                isTotal
                                currentAmount={current[PL_KEYS.PROFIT_AFTER_TAX]}
                                prevAmount={previous[PL_KEYS.PROFIT_AFTER_TAX]}
                            />
                        </tbody>
                    </table>
                    <div className="mt-8 pt-8 border-t border-gray-300">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold">" As per our report of even date "</p>
                                <p className="mt-4 font-bold">For KARIA & SHAH</p>
                                <p className="font-semibold text-gray-700">Chartered Accountants</p>
                                <p className="font-semibold text-gray-700">FRN NO: 112203W</p>
                            </div>
                            <div>
                                <p className="font-bold mb-4">For I SMART FACITECH PVT LTD</p>
                                <div className="flex gap-16">
                                    <div>
                                        <p className="font-bold">Director</p>
                                        <p>Vinayak Bhise</p>
                                        <p>DIN: 02711584</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Director</p>
                                        <p>Shobhana Bagwe</p>
                                        <p>DIN: 02711562</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PLReportViewer
