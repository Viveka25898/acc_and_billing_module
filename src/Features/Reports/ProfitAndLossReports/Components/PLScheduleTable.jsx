import React, { useState } from 'react'
import { FiSearch } from 'react-icons/fi'

const PLScheduleTable = ({ title, noteNo, data, previousData }) => {
    const [searchTerm, setSearchTerm] = useState('')

    const ledgerKeys = Object.keys(data || {})
    // Filter logic
    const filteredLedgers = ledgerKeys.filter(key =>
        key.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort()

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount || 0)
    }

    const currentTotal = ledgerKeys.reduce((sum, k) => sum + (data[k] || 0), 0)
    const previousTotal = Object.keys(previousData || {}).reduce((sum, k) => sum + (previousData[k] || 0), 0)

    if (ledgerKeys.length === 0) {
        return (
            <div className="p-4 text-center text-gray-500 text-sm bg-white border border-t-0 border-gray-200">
                No detailed records found for {title}.
            </div>
        )
    }

    return (
        <div className="bg-white border border-t-0 border-gray-300 p-4 shadow-inner">
            {/* Schedule Header matching Image 2 style */}
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-gray-800 underline uppercase">
                    {noteNo ? `Note ${noteNo}: ` : ''}{title}
                </h4>

                {/* Helper Search (not in print, but useful for UI) */}
                <div className="relative print:hidden">
                    <input
                        type="text"
                        placeholder="Search ledger..."
                        className="text-xs px-3 py-1.5 pl-8 border border-gray-300 rounded focus:ring-1 focus:ring-green-500 outline-none w-48"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <FiSearch className="absolute left-2.5 top-2 text-gray-400 w-3 h-3" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse border border-gray-800">
                    <thead>
                        <tr className="bg-gray-50">
                            <th className="border border-gray-800 py-2 px-4 text-left font-bold text-gray-900">Particulars</th>
                            <th className="border border-gray-800 py-2 px-4 text-right font-bold text-gray-900 w-40">Current Year</th>
                            <th className="border border-gray-800 py-2 px-4 text-right font-bold text-gray-900 w-40">Previous Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLedgers.map((ledger) => (
                            <tr key={ledger} className="hover:bg-gray-50 transition-colors">
                                <td className="border border-gray-800 py-1.5 px-4 text-gray-800">{ledger}</td>
                                <td className="border border-gray-800 py-1.5 px-4 text-right text-gray-900">
                                    {formatCurrency(data[ledger])}
                                </td>
                                <td className="border border-gray-800 py-1.5 px-4 text-right text-gray-500">
                                    {previousData && previousData[ledger] !== undefined
                                        ? formatCurrency(previousData[ledger])
                                        : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-gray-100 font-bold">
                            <td className="border border-gray-800 py-2 px-4 uppercase">TOTAL</td>
                            <td className="border border-gray-800 py-2 px-4 text-right text-black">
                                {formatCurrency(currentTotal)}
                            </td>
                            <td className="border border-gray-800 py-2 px-4 text-right text-black">
                                {formatCurrency(previousTotal)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default PLScheduleTable
