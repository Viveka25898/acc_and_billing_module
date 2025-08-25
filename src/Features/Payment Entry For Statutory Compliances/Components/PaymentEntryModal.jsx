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
  FaEdit,
  FaGavel,
  FaShieldAlt,
  FaReceipt
} from 'react-icons/fa';

const StatutoryPaymentEntryModal = ({ isOpen, onClose, complianceData }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [currentComplianceData, setCurrentComplianceData] = useState(complianceData);

  if (!isOpen) return null;

  const handleEdit = () => {
    setIsEditable(!isEditable);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending-ae': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending-manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getComplianceIcon = (type) => {
    switch(type) {
      case 'PF': return <FaShieldAlt className="text-blue-600" />;
      case 'ESIC': return <FaGavel className="text-green-600" />;
      case 'PT': return <FaReceipt className="text-purple-600" />;
      case 'TDS': return <FaTag className="text-orange-600" />;
      default: return <FaFileAlt className="text-gray-600" />;
    }
  };

  const getAuthorityDetails = (type) => {
    const authorities = {
      'PF': {
        name: "Employees' Provident Fund Organisation (EPFO)",
        code: "EPFO001",
        department: "Ministry of Labour and Employment",
        glCode: "2100001"
      },
      'ESIC': {
        name: "Employees' State Insurance Corporation",
        code: "ESIC001", 
        department: "Ministry of Labour and Employment",
        glCode: "2100002"
      },
      'PT': {
        name: "Professional Tax Department",
        code: "PT001",
        department: "State Government",
        glCode: "2100003"
      },
      'TDS': {
        name: "Income Tax Department",
        code: "ITD001",
        department: "Ministry of Finance",
        glCode: "2100004"
      }
    };
    return authorities[type] || authorities['PF'];
  };

  const authority = getAuthorityDetails(currentComplianceData.type);
  const paymentDate = new Date().toLocaleDateString();
  const dueDate = new Date(currentComplianceData.dueDate || Date.now()).toLocaleDateString();

  // Generate GL Entries for Statutory Payment
  const generateGLEntries = () => {
    const amount = parseFloat(currentComplianceData.amount);
    const entries = [];

    // 1. Statutory Liability Account (Credit)
    entries.push({
      glCode: authority.glCode,
      glDescription: `${currentComplianceData.type} Payable`,
      costCenter: "CC001",
      department: "Human Resources",
      debitAmount: 0,
      creditAmount: amount
    });

    // 2. Bank Account (Credit)
    entries.push({
      glCode: "1100001",
      glDescription: "HDFC Bank Current Account",
      costCenter: "CC001", 
      department: "Accounts",
      debitAmount: 0,
      creditAmount: amount
    });

    // 3. Statutory Expense (Debit) 
    const expenseGLCode = authority.glCode.replace('2100', '5200');
    entries.push({
      glCode: expenseGLCode,
      glDescription: `${currentComplianceData.type} Compliance Expense`,
      costCenter: "CC001",
      department: "Human Resources", 
      debitAmount: amount,
      creditAmount: 0
    });

    // 4. Clearing Account (Debit)
    entries.push({
      glCode: "1300001",
      glDescription: "Statutory Payments Clearing Account",
      costCenter: "CC001",
      department: "Accounts",
      debitAmount: amount,
      creditAmount: 0
    });

    return entries;
  };

  const glEntries = generateGLEntries();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {getComplianceIcon(currentComplianceData.type)}
                Statutory Payment Entry - {currentComplianceData.type}
              </h1>
              <p className="text-gray-600 mt-1">Request ID: #{currentComplianceData.id?.slice(-6)}</p>
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(currentComplianceData.status)}`}>
                {currentComplianceData.status?.replace('-', ' ').toUpperCase()}
              </div>
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
              
              {/* Compliance Information */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaGavel className="text-blue-600" size={20} />
                  Compliance Details
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Compliance Type:</span>
                    <span className="font-medium">{currentComplianceData.type || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{currentComplianceData.period || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Due Date:</span>
                    <span className="font-medium">{dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Date:</span>
                    <span className="font-medium">{paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Challan Number:</span>
                    <span className="font-medium">
                      {currentComplianceData.challanNumber || 
                       (typeof currentComplianceData.challanRef === 'object' && currentComplianceData.challanRef?.name 
                        ? currentComplianceData.challanRef.name.split('.')[0]
                        : 'Auto-Generated')
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Authority Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBuilding className="text-blue-600" size={20} />
                  Government Authority
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authority Name:</span>
                    <span className="font-medium text-sm">{authority.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Authority Code:</span>
                    <span className="font-medium">{authority.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department:</span>
                    <span className="font-medium text-sm">{authority.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-medium">RTGS/Online Banking</span>
                  </div>
                </div>
              </div>

              {/* GL Entries Table */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" size={20} />
                  General Ledger Entries
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
                      {glEntries.map((entry, index) => (
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
                          ₹ {glEntries.reduce((sum, entry) => sum + entry.debitAmount, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-1 text-sm font-bold text-right">
                          ₹ {glEntries.reduce((sum, entry) => sum + entry.creditAmount, 0).toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Amount Information */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-green-600" size={20} />
                  Payment Amount
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statutory Amount:</span>
                    <span className="font-medium">₹ {parseFloat(currentComplianceData.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Late Fee (if any):</span>
                    <span className="font-medium">₹ {parseFloat(currentComplianceData.lateFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Interest/Penalty:</span>
                    <span className="font-medium">₹ {parseFloat(currentComplianceData.penalty || 0).toLocaleString()}</span>
                  </div>
                  <hr className="border-green-300" />
                  <div className="flex justify-between text-lg font-bold text-green-800">
                    <span>Total Payment:</span>
                    <span>₹ {(parseFloat(currentComplianceData.amount || 0) + parseFloat(currentComplianceData.lateFee || 0) + parseFloat(currentComplianceData.penalty || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Compliance Remarks */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-blue-600" size={20} />
                  Compliance Remarks
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {currentComplianceData.remarks || `Statutory payment for ${currentComplianceData.type} compliance for the period ${currentComplianceData.period}. Payment processed as per regulatory requirements.`}
                </p>
              </div>

              {/* Workflow Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaUser className="text-blue-600" size={20} />
                  Approval Workflow
                </h2>
                <div className="space-y-3">
                  {currentComplianceData.history?.map((step, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">{step.action}:</span>
                        <span className="font-medium text-sm">{step.by}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(step.at).toLocaleDateString()} at {new Date(step.at).toLocaleTimeString()}
                      </div>
                      {step.comments && (
                        <div className="text-sm text-gray-600 italic mt-1">"{step.comments}"</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Challan Information */}
              {(currentComplianceData.challanRef || currentComplianceData.challanNumber) && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaReceipt className="text-yellow-600" size={20} />
                    Challan Details
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Challan Reference:</span>
                      <span className="font-medium">
                        {typeof currentComplianceData.challanRef === 'object' && currentComplianceData.challanRef?.name 
                          ? currentComplianceData.challanRef.name 
                          : currentComplianceData.challanRef || 'No challan uploaded'
                        }
                      </span>
                    </div>
                    <button 
                      className="w-full bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700 transition-colors text-sm"
                      onClick={() => {/* Handle challan preview */}}
                    >
                      View Challan Document
                    </button>
                  </div>
                </div>
              )}
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
            <button 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              onClick={() => {/* Handle print/export */}}
            >
              <FaFileAlt size={16} />
              Export Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatutoryPaymentEntryModal;