import React, { useState } from 'react'
import {
  FaTimes,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaMapMarkedAlt,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'

const ConveyancePaymentEntryModal = ({ isOpen, onClose, paymentData }) => {
  if (!isOpen || !paymentData) return null

  const [expanded, setExpanded] = useState(true)
  const employees = paymentData.employeeDetails || []

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-600 px-6 py-4 flex justify-between items-center text-white shrink-0 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg text-sm">
                <FaFileInvoiceDollar />
              </span>
              Conveyance Payment Entry
              <span className="ml-2 bg-purple-800 text-purple-100 text-xs px-2 py-0.5 rounded border border-purple-500/30">
                {paymentData.status || 'Posted'}
              </span>
            </h2>
            <p className="text-purple-100 text-xs mt-1 font-mono">
              Entry No: {paymentData.entryNo} | Date: {paymentData.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-colors relative z-10"
          >
            <FaTimes size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 space-y-6 custom-scrollbar">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                <span className="text-gray-400">🏢</span> Payment Overview
              </h3>
              <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Payment Method</span>
                  <span className="font-semibold text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                    {paymentData.paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 block mb-0.5">Bank Account</span>
                  <span className="font-mono text-[11px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100 block truncate" title={paymentData.bankAccount}>
                    {paymentData.bankAccount}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 block mb-0.5">Particulars</span>
                  <span className="text-gray-700 text-sm">
                    {paymentData.particulars}
                  </span>
                </div>
              </div>
            </div>

            {/* Employee Breakdown Grid */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col max-h-[220px]">
              <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2 shrink-0">
                <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                  <FaMapMarkedAlt className="text-gray-400" /> Employees Paid ({paymentData.employeesProcessed})
                </h3>
                <span className="text-lg font-bold text-purple-600">
                  ₹{(paymentData.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1">
                  {employees.map((e, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1.5 px-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-800">{e.employeeName}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] text-gray-400 font-mono">{e.employeeId}</span>
                          {e.utr && (
                            <span className="text-[9px] bg-green-50 text-green-700 font-mono px-1 rounded border border-green-200">
                              UTR: {e.utr}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-gray-700">
                        ₹{Number(e.amount || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GL Entries Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setExpanded(!expanded)}>
              <h3 className="text-sm font-bold text-gray-800">General Ledger Entries</h3>
              {expanded ? <FaChevronUp className="text-gray-500 text-xs" /> : <FaChevronDown className="text-gray-500 text-xs" />}
            </div>
            
            {expanded && (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 font-semibold">GL Code</th>
                      <th className="px-4 py-3 font-semibold">Description</th>
                      <th className="px-4 py-3 font-semibold text-right w-32 bg-purple-50/50">Debit (₹)</th>
                      <th className="px-4 py-3 font-semibold text-right w-32 bg-blue-50/50">Credit (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paymentData.glEntries?.map((entry, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">
                          {entry.glCode}
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">
                          {entry.glDescription}
                          <div className="text-[10px] text-gray-400 font-normal mt-0.5">
                            {entry.costCenter} • {entry.department}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right bg-purple-50/30 font-semibold text-purple-700">
                          {entry.debitAmount > 0
                            ? entry.debitAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                            : '-'}
                        </td>
                        <td className="px-4 py-3 text-right bg-blue-50/30 font-semibold text-blue-700">
                          {entry.creditAmount > 0
                            ? entry.creditAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
                    <tr>
                      <td colSpan="2" className="px-4 py-3 text-right text-gray-700">Summary Totals:</td>
                      <td className="px-4 py-3 text-right text-purple-700">
                        {paymentData.glEntries?.reduce((s, e) => s + (e.debitAmount || 0), 0)
                          .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-3 text-right text-blue-700">
                        {paymentData.glEntries?.reduce((s, e) => s + (e.creditAmount || 0), 0)
                          .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

          {/* Workflow Footer */}
          <div className="flex flex-wrap items-center gap-4 bg-purple-50 border border-purple-100 rounded-xl p-4 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-purple-500" size={16} />
              <span className="text-gray-700 font-semibold">Workflow Confirmed</span>
            </div>
            <div className="w-px h-6 bg-purple-200 hidden sm:block"></div>
            <div className="flex items-center gap-4 flex-1">
              <div>
                <span className="text-gray-400 block text-[10px]">Prepared By</span>
                <span className="font-medium text-gray-800">{paymentData.preparedBy}</span>
              </div>
              <div className="hidden sm:block text-gray-300">→</div>
              <div>
                <span className="text-gray-400 block text-[10px]">Auto-Approved</span>
                <span className="font-medium text-gray-800">{paymentData.approvedBy}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-sm hover:bg-purple-700 transition ml-auto border border-purple-600"
            >
              Done
            </button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
      `}</style>
    </div>
  )
}

export default ConveyancePaymentEntryModal
