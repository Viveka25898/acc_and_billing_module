/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react'
import {
  FaCalendarAlt,
  FaUser,
  FaCreditCard,
  FaFileAlt,
  FaBuilding,
  FaTag,
  FaRupeeSign,
  FaCheck,
  FaTimes,
  FaEdit,
  FaChevronDown,
  FaChevronRight,
  FaUsers,
  FaIdCard,
  FaCar,
} from 'react-icons/fa'

const ConveyancePaymentEntryModal = ({ isOpen, onClose, paymentData }) => {
  const [isEditable, setIsEditable] = useState(false)
  const [currentPaymentData, setCurrentPaymentData] = useState(paymentData)
  const [expandedEmployees, setExpandedEmployees] = useState({})

  if (!isOpen) return null

  // Enhanced data handling with fallbacks
  useEffect(() => {
    if (paymentData) {
      console.log('🔍 ConveyancePaymentEntryModal received data:', paymentData)
      setCurrentPaymentData(paymentData)
    }
  }, [paymentData])

  // Safe data access with fallbacks
  const safeData = {
    entryNo: currentPaymentData?.entryNo || 'N/A',
    date: currentPaymentData?.date || new Date().toISOString().split('T')[0],
    vendor: currentPaymentData?.vendor || 'Unknown Employee',
    amount: currentPaymentData?.amount || 0,
    paymentMethod: currentPaymentData?.paymentMethod || 'Bank Transfer',
    bankAccount: currentPaymentData?.bankAccount || 'N/A',
    invoiceNo: currentPaymentData?.invoiceNo || 'N/A',
    particulars: currentPaymentData?.particulars || 'No particulars provided',
    gstAmount: currentPaymentData?.gstAmount || 0,
    netAmount: currentPaymentData?.netAmount || currentPaymentData?.amount || 0,
    status: currentPaymentData?.status || 'Posted',
    preparedBy: currentPaymentData?.preparedBy || 'System',
    approvedBy: currentPaymentData?.approvedBy || 'System',
    remarks: currentPaymentData?.remarks || '',
    glEntries: currentPaymentData?.glEntries || [],
    employeeDetails: currentPaymentData?.employeeDetails || currentPaymentData?.vendorDetails || [],
    paymentCount: currentPaymentData?.paymentCount || 0,
    totalAmount: currentPaymentData?.totalAmount || currentPaymentData?.amount || 0,
  }

  const handleEdit = () => {
    setIsEditable(!isEditable)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Pending Approval':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Toggle employee expansion in breakdown section
  const toggleEmployeeExpansion = (employeeIndex) => {
    setExpandedEmployees((prev) => ({
      ...prev,
      [employeeIndex]: !prev[employeeIndex],
    }))
  }

  // Check if this is a multi-employee payment
  const isMultiEmployee = safeData.employeeDetails && safeData.employeeDetails.length > 1

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-purple-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaCar className="text-purple-600" />
                Conveyance Payment Entry
                {isMultiEmployee && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm flex items-center gap-1">
                    <FaUsers size={12} />
                    Multi-Employee
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-1">Entry No: {safeData.entryNo}</p>
              {safeData.paymentCount > 0 && (
                <p className="text-sm text-purple-600 mt-1">
                  {safeData.paymentCount} employee(s) • Total: ₹
                  {safeData.totalAmount.toLocaleString()}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                title="Close Modal"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-purple-600" size={20} />
                  Payment Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">{safeData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{safeData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Account:</span>
                    <span className="font-medium text-sm">{safeData.bankAccount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Employees:</span>
                    <span className="font-medium text-purple-700">
                      {isMultiEmployee ? safeData.employeeDetails.length : 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(safeData.status)}`}
                    >
                      {safeData.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Employee Information - Enhanced for Multiple Employees */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaIdCard className="text-purple-600" size={20} />
                  Employee Details
                  {isMultiEmployee && (
                    <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {safeData.employeeDetails.length} employees
                    </span>
                  )}
                </h2>

                {!isMultiEmployee ? (
                  // Single Employee Display
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee Name:</span>
                      <span className="font-medium">{safeData.vendor}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Employee ID:</span>
                      <span className="font-medium">
                        {safeData.employeeDetails[0]?.employeeId || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">
                        {safeData.employeeDetails[0]?.client || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Purpose:</span>
                      <span className="font-medium">
                        {safeData.employeeDetails[0]?.purpose || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium text-purple-700">
                        ₹ {safeData.amount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  // Multiple Employees Display
                  <div className="space-y-4 max-h-80 overflow-y-auto">
                    {safeData.employeeDetails.map((employee, index) => (
                      <div key={index} className="border border-purple-200 rounded-lg p-3 bg-white">
                        <div
                          className="flex items-center justify-between cursor-pointer hover:bg-purple-50 p-2 rounded"
                          onClick={() => toggleEmployeeExpansion(index)}
                        >
                          <div className="flex items-center gap-2">
                            {expandedEmployees[index] ? (
                              <FaChevronDown size={14} className="text-purple-600" />
                            ) : (
                              <FaChevronRight size={14} className="text-purple-600" />
                            )}
                            <span className="font-medium text-gray-800">
                              {employee.employeeName}
                            </span>
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                              ₹{employee.totalAmount?.toLocaleString() || '0'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-500">
                            {employee.invoices?.length || 0} payment
                            {(employee.invoices?.length || 0) > 1 ? 's' : ''}
                          </span>
                        </div>

                        {expandedEmployees[index] && (
                          <div className="mt-3 pl-4 border-l-2 border-purple-200 space-y-2">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Employee ID:</span>
                                <span className="ml-2 font-medium">
                                  {employee.employeeId || 'N/A'}
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">Client:</span>
                                <span className="ml-2 font-medium">{employee.client || 'N/A'}</span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Purpose:</span>
                                <span className="ml-2 font-medium">
                                  {employee.purpose || 'Conveyance Reimbursement'}
                                </span>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Distance:</span>
                                <span className="ml-2 font-medium">
                                  {employee.invoices?.[0]?.distance || 'N/A'}
                                </span>
                              </div>
                            </div>

                            {/* Payment Details */}
                            <div className="bg-purple-50 p-2 rounded">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                Payment Details:
                              </h4>
                              <div className="space-y-1">
                                {employee.invoices?.map((invoice, invIndex) => (
                                  <div
                                    key={invIndex}
                                    className="flex justify-between items-center text-xs"
                                  >
                                    <span className="text-purple-600 font-medium">
                                      {invoice.invoiceNumber || `CONV-${index + 1}`}
                                    </span>
                                    <div className="flex gap-2">
                                      <span className="text-gray-500">
                                        Distance: {invoice.distance || 'N/A'}
                                      </span>
                                      <span className="text-green-600 font-medium">
                                        ₹
                                        {invoice.paidAmount?.toLocaleString() ||
                                          invoice.originalAmount?.toLocaleString() ||
                                          '0'}
                                      </span>
                                    </div>
                                  </div>
                                )) || (
                                  <div className="text-xs text-gray-500">
                                    Single payment: ₹{employee.totalAmount?.toLocaleString() || '0'}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* GL Entries Table */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" size={20} />
                  GL Entries & Accounting Details
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">
                          GL Code
                        </th>
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">
                          Cost Center
                        </th>
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">
                          Department
                        </th>
                        <th className="text-right py-2 px-1 text-sm font-semibold text-gray-700">
                          Debit
                        </th>
                        <th className="text-right py-2 px-1 text-sm font-semibold text-gray-700">
                          Credit
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {safeData.glEntries.length > 0 ? (
                        safeData.glEntries.map((entry, index) => (
                          <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-2 px-1 text-sm font-medium text-blue-700">
                              {entry.glCode}
                            </td>
                            <td className="py-2 px-1 text-sm">{entry.glDescription}</td>
                            <td className="py-2 px-1 text-sm">{entry.costCenter}</td>
                            <td className="py-2 px-1 text-sm">{entry.department}</td>
                            <td className="py-2 px-1 text-sm text-right font-medium">
                              {entry.debitAmount > 0
                                ? `₹ ${entry.debitAmount.toLocaleString()}`
                                : '-'}
                            </td>
                            <td className="py-2 px-1 text-sm text-right font-medium">
                              {entry.creditAmount > 0
                                ? `₹ ${entry.creditAmount.toLocaleString()}`
                                : '-'}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="py-4 text-center text-gray-500">
                            No GL entries available
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-400 bg-gray-100">
                        <td colSpan="4" className="py-2 px-1 text-sm font-bold text-gray-800">
                          TOTALS
                        </td>
                        <td className="py-2 px-1 text-sm font-bold text-right">
                          ₹{' '}
                          {safeData.glEntries
                            .reduce((sum, entry) => sum + (entry.debitAmount || 0), 0)
                            .toLocaleString()}
                        </td>
                        <td className="py-2 px-1 text-sm font-bold text-right">
                          ₹{' '}
                          {safeData.glEntries
                            .reduce((sum, entry) => sum + (entry.creditAmount || 0), 0)
                            .toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Amount Breakdown */}
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-purple-600" size={20} />
                  Amount Breakdown
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Payment Amount:</span>
                    <span className="font-bold text-purple-800 text-lg">
                      ₹ {safeData.amount?.toLocaleString()}
                    </span>
                  </div>

                  {isMultiEmployee && (
                    <div className="mt-4 pt-3 border-t border-purple-300">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2">
                        Employee-wise Breakdown:
                      </h3>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {safeData.employeeDetails.map((employee, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span
                              className="text-gray-600 truncate mr-2"
                              title={employee.employeeName}
                            >
                              {employee.employeeName.length > 20
                                ? employee.employeeName.substring(0, 20) + '...'
                                : employee.employeeName}
                            </span>
                            <span className="font-medium text-purple-700">
                              ₹ {employee.totalAmount?.toLocaleString() || '0'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Particulars */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-blue-600" size={20} />
                  Particulars
                </h2>
                <p className="text-gray-700 leading-relaxed">{safeData.particulars}</p>
              </div>

              {/* Workflow Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" size={20} />
                  Workflow
                </h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600 block">Prepared By:</span>
                    <span className="font-medium">{safeData.preparedBy}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Approved By:</span>
                    <span className="font-medium">{safeData.approvedBy}</span>
                  </div>
                  {safeData.remarks && (
                    <div>
                      <span className="text-gray-600 block">Remarks:</span>
                      <span className="font-medium italic">{safeData.remarks}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCheck className="text-green-600" size={20} />
                  Payment Summary
                </h2>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Transaction Type:</span>
                    <span className="font-medium">Conveyance Bank Payment</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GL Impact:</span>
                    <span className="font-medium">Debit L2001001, Credit Bank</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Processing Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-4 border-t flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConveyancePaymentEntryModal
