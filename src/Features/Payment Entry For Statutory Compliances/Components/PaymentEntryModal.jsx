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
  FaReceipt,
  FaBalanceScale
} from 'react-icons/fa';

const StatutoryPaymentEntryModal = ({ isOpen, onClose, complianceData }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [currentComplianceData, setCurrentComplianceData] = useState(complianceData);

  if (!isOpen) return null;

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
        liabilityGL: "2100001", // PF Payable
        expenseGL: "5200001"    // PF Expense
      },
      'ESIC': {
        name: "Employees' State Insurance Corporation",
        code: "ESIC001", 
        department: "Ministry of Labour and Employment",
        liabilityGL: "2100002", // ESIC Payable
        expenseGL: "5200002"    // ESIC Expense
      },
      'PT': {
        name: "Professional Tax Department",
        code: "PT001",
        department: "State Government",
        liabilityGL: "2100003", // PT Payable
        expenseGL: "5200003"    // PT Expense
      },
      'TDS': {
        name: "Income Tax Department",
        code: "ITD001",
        department: "Ministry of Finance",
        liabilityGL: "2100004", // TDS Payable
        expenseGL: "5200004"    // TDS Expense
      }
    };
    return authorities[type] || authorities['PF'];
  };

  const authority = getAuthorityDetails(currentComplianceData.type);
  const paymentDate = new Date().toLocaleDateString();
  const dueDate = new Date(currentComplianceData.dueDate || Date.now()).toLocaleDateString();

  // CORRECTED: Generate Proper GL Entries
  const generateGLEntries = () => {
    const amount = parseFloat(currentComplianceData.amount || 0);
    const lateFee = parseFloat(currentComplianceData.lateFee || 0);
    const penalty = parseFloat(currentComplianceData.penalty || 0);
    const totalAmount = amount + lateFee + penalty;
    
    const entries = [];

    // SIMPLIFIED AND CORRECT APPROACH:
    // Debit: Expense Account (Total payment treated as expense)
    if (totalAmount > 0) {
      entries.push({
        glCode: authority.expenseGL,
        glDescription: `${currentComplianceData.type} Compliance Payment`,
        costCenter: "CC001",
        department: "Human Resources",
        debitAmount: totalAmount,
        creditAmount: 0,
        note: "Statutory compliance expense"
      });

      // Credit: Bank Account
      entries.push({
        glCode: "1100001", // Bank GL
        glDescription: "HDFC Bank Current Account",
        costCenter: "CC001",
        department: "Accounts",
        debitAmount: 0,
        creditAmount: totalAmount,
        note: "Bank payment"
      });
    }

    return entries;
  };

  const glEntries = generateGLEntries();
  const totalDebit = glEntries.reduce((sum, entry) => sum + entry.debitAmount, 0);
  const totalCredit = glEntries.reduce((sum, entry) => sum + entry.creditAmount, 0);
  const isBalanced = totalDebit === totalCredit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-6xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                Statutory Payment Entry - {currentComplianceData.type}
              </h1>
              <p className="text-gray-600 mt-1">Request ID: #{currentComplianceData.id?.slice(-6)}</p>
              
              {/* Accounting Balance Indicator */}
              <div className={`mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                isBalanced 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                <FaBalanceScale className="mr-1" />
                {isBalanced ? 'Accounting Balanced ✓' : 'Accounting Error ✗'}
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close Modal"
            >
              <FaTimes size={20} />
            </button>
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
                </div>
              </div>

              {/* GL Entries Table - UPDATED */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" size={20} />
                  General Ledger Entries (Corrected)
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-300 bg-gray-100">
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">GL Code</th>
                        <th className="text-left py-2 px-2 font-semibold text-gray-700">Description</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">Debit (₹)</th>
                        <th className="text-right py-2 px-2 font-semibold text-gray-700">Credit (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="py-2 px-2 font-medium text-blue-700">{entry.glCode}</td>
                          <td className="py-2 px-2">{entry.glDescription}</td>
                          <td className="py-2 px-2 text-right font-medium">
                            {entry.debitAmount > 0 ? entry.debitAmount.toLocaleString() : '-'}
                          </td>
                          <td className="py-2 px-2 text-right font-medium">
                            {entry.creditAmount > 0 ? entry.creditAmount.toLocaleString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-400 bg-gray-100 font-bold">
                        <td colSpan="2" className="py-2 px-2 text-gray-800">TOTALS</td>
                        <td className="py-2 px-2 text-right text-green-700">
                          ₹ {totalDebit.toLocaleString()}
                        </td>
                        <td className="py-2 px-2 text-right text-green-700">
                          ₹ {totalCredit.toLocaleString()}
                        </td>
                      </tr>
                      <tr className={`${isBalanced ? 'bg-green-50' : 'bg-red-50'}`}>
                        <td colSpan="4" className="py-2 px-2 text-center text-sm font-medium">
                          {isBalanced ? 
                            '✓ Debits equal Credits - Accounting Balanced' : 
                            '✗ Debits and Credits do not match - Accounting Error'
                          }
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
                  Payment Summary
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Statutory Amount:</span>
                    <span className="font-medium">₹ {parseFloat(currentComplianceData.amount || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Late Fee:</span>
                    <span className="font-medium">₹ {parseFloat(currentComplianceData.lateFee || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Penalty:</span>
                    <span className="font-medium">₹ {parseFloat(currentComplianceData.penalty || 0).toLocaleString()}</span>
                  </div>
                  <hr className="border-green-300" />
                  <div className="flex justify-between text-lg font-bold text-green-800">
                    <span>Total Payment:</span>
                    <span>₹ {(parseFloat(currentComplianceData.amount || 0) + parseFloat(currentComplianceData.lateFee || 0) + parseFloat(currentComplianceData.penalty || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Accounting Summary */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBalanceScale className="text-blue-600" size={20} />
                  Accounting Summary
                </h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Debits:</span>
                    <span className="font-medium">₹ {totalDebit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Credits:</span>
                    <span className="font-medium">₹ {totalCredit.toLocaleString()}</span>
                  </div>
                  <div className={`flex justify-between font-bold ${
                    isBalanced ? 'text-green-700' : 'text-red-700'
                  }`}>
                    <span>Balance Status:</span>
                    <span>{isBalanced ? 'BALANCED' : 'UNBALANCED'}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-2">
                    * Proper accounting requires Debits = Credits for each transaction
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
  );
};

export default StatutoryPaymentEntryModal;