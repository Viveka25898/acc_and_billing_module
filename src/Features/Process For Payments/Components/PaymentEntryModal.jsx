/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
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
  FaEdit 
} from 'react-icons/fa';

const PaymentEntryModal = ({ isOpen, onClose, paymentData }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [currentPaymentData, setCurrentPaymentData] = useState(paymentData);

  if (!isOpen) return null;

  const handleEdit = () => {
    setIsEditable(!isEditable);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending Approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                <FaCreditCard className="text-blue-600" />
                Payment Entry
              </h1>
              <p className="text-gray-600 mt-1">Entry No: {currentPaymentData.entryNo}</p>
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
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaCalendarAlt className="text-blue-600" size={20} />
                  Basic Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{currentPaymentData.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">{currentPaymentData.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Account:</span>
                    <span className="font-medium text-sm">{currentPaymentData.bankAccount}</span>
                  </div>
                </div>
              </div>

              {/* Vendor Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBuilding className="text-blue-600" size={20} />
                  Vendor Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor Name:</span>
                    <span className="font-medium">{currentPaymentData.vendor}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vendor Code:</span>
                    <span className="font-medium">{currentPaymentData.vendorCode}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Invoice No:</span>
                    <span className="font-medium">{currentPaymentData.invoiceNo}</span>
                  </div>
                </div>
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
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">GL Code</th>
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">Description</th>
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">Cost Center</th>
                        <th className="text-left py-2 px-1 text-sm font-semibold text-gray-700">Department</th>
                        <th className="text-right py-2 px-1 text-sm font-semibold text-gray-700">Debit</th>
                        <th className="text-right py-2 px-1 text-sm font-semibold text-gray-700">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentPaymentData.glEntries?.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-2 px-1 text-sm font-medium text-blue-700">{entry.glCode}</td>
                          <td className="py-2 px-1 text-sm">{entry.glDescription}</td>
                          <td className="py-2 px-1 text-sm">{entry.costCenter}</td>
                          <td className="py-2 px-1 text-sm">{entry.department}</td>
                          <td className="py-2 px-1 text-sm text-right font-medium">
                            {entry.debitAmount > 0 ? `₹ ${entry.debitAmount.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-2 px-1 text-sm text-right font-medium">
                            {entry.creditAmount > 0 ? `₹ ${entry.creditAmount.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-400 bg-gray-100">
                        <td colSpan="4" className="py-2 px-1 text-sm font-bold text-gray-800">TOTALS</td>
                        <td className="py-2 px-1 text-sm font-bold text-right">
                          ₹ {currentPaymentData.glEntries?.reduce((sum, entry) => sum + entry.debitAmount, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-1 text-sm font-bold text-right">
                          ₹ {currentPaymentData.glEntries?.reduce((sum, entry) => sum + entry.creditAmount, 0).toLocaleString()}
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
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-blue-600" size={20} />
                  Amount Breakdown
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Base Amount:</span>
                    <span className="font-medium">₹ {currentPaymentData.netAmount?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST Amount:</span>
                    <span className="font-medium">₹ {currentPaymentData.gstAmount?.toLocaleString()}</span>
                  </div>
                  <hr className="border-blue-300" />
                  <div className="flex justify-between text-lg font-bold text-blue-800">
                    <span>Total Payment:</span>
                    <span>₹ {currentPaymentData.amount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Particulars */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-blue-600" size={20} />
                  Particulars
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {currentPaymentData.particulars}
                </p>
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
                    <span className="font-medium">Account Executive</span>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Approved By:</span>
                    <span className="font-medium">
                      Account Manager
                    </span>
                  </div>
                  {currentPaymentData.remarks && (
                    <div>
                      <span className="text-gray-600 block">Remarks:</span>
                      <span className="font-medium italic">{currentPaymentData.remarks}</span>
                    </div>
                  )}
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
  );
};

export default PaymentEntryModal;