import React, { useState } from 'react'
import {
  FaTimes,
  FaCheckCircle,
  FaFileInvoiceDollar,
  FaBuilding,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa'

const PaymentEntryModal = ({ isOpen, onClose, paymentData }) => {
  if (!isOpen || !paymentData) return null

  // Support single and multi-vendor display
  const isMultiVendor =
    paymentData.vendorDetails && Array.isArray(paymentData.vendorDetails)
  const vendors = isMultiVendor
    ? paymentData.vendorDetails
    : [
        {
          vendorName: paymentData.vendor,
          vendorGLCode: paymentData.vendorCode,
          totalAmount: paymentData.amount,
          invoices: [
            {
              invoiceNumber: paymentData.invoiceNo,
              originalAmount: paymentData.amount,
              paidAmount: paymentData.amount,
              paymentType: 'full',
            },
          ],
        },
      ]

  const totalAmountPaid = vendors.reduce(
    (sum, v) => sum + (v.totalAmount || v.amount || 0),
    0
  )

  const [expandedVendor, setExpandedVendor] = useState(
    vendors.length === 1 ? 0 : null
  )

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-4 flex justify-between items-center text-white shrink-0 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-white/20 p-1.5 rounded-lg text-sm">
                <FaFileInvoiceDollar />
              </span>
              Payment Accounting Entry
              <span className="ml-2 bg-green-800 text-green-100 text-xs px-2 py-0.5 rounded border border-green-500/30">
                {paymentData.status || 'Posted'}
              </span>
            </h2>
            <p className="text-green-100 text-xs mt-1 font-mono">
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
        <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6 space-y-6">
          {/* Top Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Basic Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
                <FaBuilding className="text-gray-400" /> Payment Details
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
                  <span className="font-mono text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 inline-block truncate max-w-full">
                    {paymentData.bankAccount}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 block mb-0.5">Particulars</span>
                  <span className="text-gray-700 line-clamp-2">
                    {paymentData.particulars}
                  </span>
                </div>
                {paymentData.utr && (
                  <div className="col-span-2">
                    <span className="text-xs text-gray-500 block mb-0.5">UTR Reference</span>
                    <span className="font-mono bg-yellow-50 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                      {paymentData.utr}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Vendor Breakdowns */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                <h3 className="text-sm font-bold text-gray-800">
                  {isMultiVendor ? `Vendors Paid (${vendors.length})` : 'Vendor Paid'}
                </h3>
                <span className="text-lg font-bold text-green-600">
                  ₹{totalAmountPaid.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
                <div className="space-y-2">
                  {vendors.map((vendor, idx) => (
                    <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() =>
                          setExpandedVendor(expandedVendor === idx ? null : idx)
                        }
                        className="w-full text-left px-3 py-2 flex justify-between items-center hover:bg-gray-100 transition-colors"
                      >
                        <div className="overflow-hidden pr-2">
                          <p className="text-xs font-bold text-gray-800 truncate">
                            {vendor.vendorName}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                            {vendor.vendorGLCode || 'N/A'} • {vendor.invoices?.length || 0} invoice(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-semibold text-gray-800">
                            ₹{(vendor.totalAmount || vendor.amount || 0).toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                          {expandedVendor === idx ? (
                            <FaChevronUp className="text-gray-400 text-[10px]" />
                          ) : (
                            <FaChevronDown className="text-gray-400 text-[10px]" />
                          )}
                        </div>
                      </button>

                      {expandedVendor === idx && vendor.invoices && (
                        <div className="bg-white px-3 py-2 border-t border-gray-100 divide-y divide-gray-50">
                          {vendor.invoices.map((inv, i) => (
                            <div key={i} className="flex justify-between py-1 text-xs">
                              <span className="text-gray-600 font-mono">
                                {inv.invoiceNumber}
                                {inv.paymentType === 'partial' && (
                                  <span className="ml-2 text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded border border-orange-200">
                                    Partial
                                  </span>
                                )}
                              </span>
                              <span className="font-medium text-gray-800">
                                ₹{(inv.paidAmount || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* GL Entries Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
              <h3 className="text-sm font-bold text-gray-800">General Ledger Entries</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-semibold">GL Code</th>
                    <th className="px-4 py-3 font-semibold">Description</th>
                    <th className="px-4 py-3 font-semibold">Cost Center</th>
                    <th className="px-4 py-3 font-semibold text-right w-32 bg-green-50/50">Debit (₹)</th>
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
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {entry.costCenter}
                        <span className="mx-1 text-gray-300">|</span>
                        {entry.department}
                      </td>
                      <td className="px-4 py-3 text-right bg-green-50/30 font-semibold text-green-700">
                        {entry.debitAmount > 0
                          ? entry.debitAmount.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })
                          : '-'}
                      </td>
                      <td className="px-4 py-3 text-right bg-blue-50/30 font-semibold text-blue-700">
                        {entry.creditAmount > 0
                          ? entry.creditAmount.toLocaleString('en-IN', {
                              minimumFractionDigits: 2,
                            })
                          : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-100 font-bold border-t-2 border-gray-300">
                  <tr>
                    <td colSpan="3" className="px-4 py-3 text-right text-gray-700">
                      Total:
                    </td>
                    <td className="px-4 py-3 text-right text-green-700">
                      {paymentData.glEntries
                        ?.reduce((sum, e) => sum + (e.debitAmount || 0), 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-right text-blue-700">
                      {paymentData.glEntries
                        ?.reduce((sum, e) => sum + (e.creditAmount || 0), 0)
                        .toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Workflow Footer */}
          <div className="flex flex-wrap items-center gap-4 bg-green-50 border border-green-100 rounded-xl p-4 text-xs shadow-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" size={16} />
              <span className="text-gray-600 font-semibold">Workflow Confirmed</span>
            </div>
            <div className="w-px h-6 bg-green-200 hidden sm:block"></div>
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
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold shadow-sm hover:bg-green-700 hover:shadow transition ml-auto border border-green-600"
            >
              Done
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  )
}

export default PaymentEntryModal
