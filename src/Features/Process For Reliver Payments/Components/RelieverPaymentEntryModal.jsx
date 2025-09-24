/* eslint-disable no-unused-vars */
import React from 'react';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaCreditCard, 
  FaFileAlt, 
  FaBuilding, 
  FaTag, 
  FaRupeeSign, 
  FaTimes, 
  FaIdCard,
  FaPhone,
  FaEnvelope,
  FaBriefcase,
  FaChartLine,
  FaClock,
  FaCheck,
  FaUsers,
  FaMapMarkerAlt
} from 'react-icons/fa';

const RelieverPaymentEntryModal = ({ isOpen, onClose, requestData, approvedRequests }) => {
  if (!isOpen) return null;

  // Determine if this is single or multiple requests
  const isMultipleRequests = approvedRequests && approvedRequests.length > 0;
  const requests = isMultipleRequests ? approvedRequests : (requestData ? [requestData] : []);
  
  if (requests.length === 0) return null;

  const getStatusColor = (status) => {
    switch(status) {
      case 'Approved': 
      case 'Pending Account Executive Approval': 
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected by VP Operations': 
      case 'Rejected by Account Executive': 
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Pending VP Operations Approval': 
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: 
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Generate GL entries for all approved reliever requests
  const generateAllGLEntries = (requests) => {
    const glEntries = [];
    let totalAmount = 0;

    requests.forEach((request, index) => {
      const amount = parseFloat(request.amount);
      totalAmount += amount;

      // Debit entry for each request
      glEntries.push({
        glCode: 'E301001',
        glDescription: `Reliever Payments - ${request.name}`,
        costCenter: request.site || 'CC001',
        department: request.site || 'Operations',
        debitAmount: amount,
        creditAmount: 0,
        employeeName: request.name,
        employeeId: request.id?.slice(-6) || 'N/A',
        site: request.site
      });
    });

    // Single credit entry for total
    glEntries.push({
      glCode: 'L101001', 
      glDescription: 'Cash/Bank Account - Batch Payment',
      costCenter: 'CC001',
      department: 'Operations',
      debitAmount: 0,
      creditAmount: totalAmount,
      employeeName: null,
      employeeId: null,
      site: null
    });

    return glEntries;
  };

  const glEntries = generateAllGLEntries(requests);
  const totalAmount = requests.reduce((sum, req) => sum + parseFloat(req.amount), 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-blue-500">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {isMultipleRequests ? (
                  <>
                    <FaUsers className="text-blue-600" />
                    Reliever Requests - Approved
                    <span className="bg-green-100 text-green-800 border border-green-200 px-3 py-1 rounded-lg text-sm">
                      <FaCheck className="inline mr-1" size={12} />
                      {requests.length} Requests Approved
                    </span>
                  </>
                ) : (
                  <>
                    <FaCreditCard className="text-blue-600" />
                    Reliever Request - Approved
                    <span className={`px-3 py-1 rounded-lg text-sm border ${getStatusColor(requests[0].status)}`}>
                      <FaCheck className="inline mr-1" size={12} />
                      {requests[0].status}
                    </span>
                  </>
                )}
              </h1>
              <p className="text-gray-600 mt-1">
                {isMultipleRequests 
                  ? `Batch Approval - ${requests.length} requests processed`
                  : `Request ID: ${requests[0].id?.slice(-6) || 'AUTO-' + Date.now().toString().slice(-8)}`
                }
              </p>
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
              
              {/* Batch Summary (for multiple requests) or Reliever Information (for single) */}
              {isMultipleRequests ? (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUsers className="text-blue-600" size={20} />
                    Batch Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Requests:</span>
                      <span className="font-medium">{requests.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-medium text-lg">₹ {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approval Date:</span>
                      <span className="font-medium">{formatDate(new Date().toISOString())}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved By:</span>
                      <span className="font-medium">Account Executive</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaUser className="text-blue-600" size={20} />
                    Reliever Information
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{requests[0].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-medium">#{requests[0].id?.slice(-6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Site:</span>
                      <span className="font-medium">{requests[0].site}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{requests[0].type}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Request Details Table (for multiple) or Request Details (for single) */}
              {isMultipleRequests ? (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaFileAlt className="text-blue-600" size={20} />
                    Request Details
                  </h2>
                  <div className="overflow-x-auto max-h-80 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100 sticky top-0">
                        <tr>
                          <th className="text-left p-2 border">Name</th>
                          <th className="text-left p-2 border">Site</th>
                          <th className="text-right p-2 border">Amount</th>
                          <th className="text-left p-2 border">Type</th>
                          <th className="text-left p-2 border">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {requests.map((req, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="p-2 border font-medium">{req.name}</td>
                            <td className="p-2 border">{req.site}</td>
                            <td className="p-2 border text-right font-medium">₹ {parseFloat(req.amount).toLocaleString()}</td>
                            <td className="p-2 border text-xs">{req.type}</td>
                            <td className="p-2 border text-xs">{new Date(req.date).toLocaleDateString('en-GB')}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-100">
                        <tr>
                          <td colSpan="2" className="p-2 border font-bold">TOTAL</td>
                          <td className="p-2 border text-right font-bold">₹ {totalAmount.toLocaleString()}</td>
                          <td colSpan="2" className="p-2 border"></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FaCalendarAlt className="text-blue-600" size={20} />
                    Request Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request Date:</span>
                      <span className="font-medium">{new Date(requests[0].date).toLocaleDateString('en-GB')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Number:</span>
                      <span className="font-medium">{requests[0].accountNo || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">IFSC Code:</span>
                      <span className="font-medium">{requests[0].ifscCode || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approved At:</span>
                      <span className="font-medium text-sm text-green-600">
                        {formatDate(new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* GL Entries Table */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaTag className="text-blue-600" size={20} />
                  GL Entries & Accounting
                </h2>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">GL Code</th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">Description</th>
                        <th className="text-left py-2 px-1 text-xs font-semibold text-gray-700">Reliever</th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-gray-700">Debit</th>
                        <th className="text-right py-2 px-1 text-xs font-semibold text-gray-700">Credit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {glEntries.map((entry, index) => (
                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                          <td className="py-2 px-1 text-xs font-medium text-blue-700">{entry.glCode}</td>
                          <td className="py-2 px-1 text-xs">{entry.glDescription}</td>
                          <td className="py-2 px-1 text-xs">
                            {entry.employeeName ? `${entry.employeeName} (${entry.site})` : '-'}
                          </td>
                          <td className="py-2 px-1 text-xs text-right font-medium">
                            {entry.debitAmount > 0 ? `₹ ${entry.debitAmount.toLocaleString()}` : '-'}
                          </td>
                          <td className="py-2 px-1 text-xs text-right font-medium">
                            {entry.creditAmount > 0 ? `₹ ${entry.creditAmount.toLocaleString()}` : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr className="border-t-2 border-gray-400">
                        <td colSpan="3" className="py-2 px-1 text-xs font-bold text-gray-800">TOTALS</td>
                        <td className="py-2 px-1 text-xs font-bold text-right">
                          ₹ {glEntries.reduce((sum, entry) => sum + entry.debitAmount, 0).toLocaleString()}
                        </td>
                        <td className="py-2 px-1 text-xs font-bold text-right">
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
              
              {/* Amount Details */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaRupeeSign className="text-blue-600" size={20} />
                  Amount Details
                </h2>
                <div className="space-y-3">
                  {isMultipleRequests ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Number of Requests:</span>
                        <span className="font-medium">{requests.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Average Amount:</span>
                        <span className="font-medium">₹ {(totalAmount / requests.length).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Requested Amount:</span>
                      <span className="font-medium">₹ {parseFloat(requests[0].amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee:</span>
                    <span className="font-medium">₹ 0</span>
                  </div>
                  <hr className="border-blue-300" />
                  <div className="flex justify-between text-lg font-bold text-blue-800">
                    <span>Total Approved Amount:</span>
                    <span>₹ {totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBuilding className="text-blue-600" size={20} />
                  Bank Details
                </h2>
                <div className="space-y-3">
                  {isMultipleRequests ? (
                    <div className="text-sm text-gray-600">
                      <div className="font-medium mb-2">Multiple Bank Accounts:</div>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {requests.map((req, index) => (
                          <div key={index} className="bg-white p-2 rounded border">
                            <div className="font-medium">{req.name}</div>
                            <div>A/C: {req.accountNo || 'N/A'}</div>
                            <div>IFSC: {req.ifscCode || 'N/A'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Account Number:</span>
                        <span className="font-medium">{requests[0].accountNo || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IFSC Code:</span>
                        <span className="font-medium">{requests[0].ifscCode || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Mode:</span>
                        <span className="font-medium">NEFT</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Approval Workflow */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaChartLine className="text-blue-600" size={20} />
                  Approval Workflow
                </h2>
                <div className="space-y-4">
                  {/* VP Operations Approval Summary */}
                  {requests.some(req => req.history?.some(h => h.action.includes("VP Operations"))) && (
                    <div className="border-l-4 border-green-500 pl-4">
                      <div className="flex items-center gap-2 mb-1">
                        <FaCheck className="text-green-600" size={14} />
                        <span className="font-semibold text-green-700">VP Operations Approval</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>VP Approved Requests: {requests.filter(req => req.history?.some(h => h.action.includes("VP Operations"))).length}</div>
                        <div>Status: Completed</div>
                      </div>
                    </div>
                  )}
                  
                  {/* AE Approval */}
                  <div className="border-l-4 border-green-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaCheck className="text-green-600" size={14} />
                      <span className="font-semibold text-green-700">
                        AE {isMultipleRequests ? 'Batch ' : ''}Approval
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>Approved by: Account Executive</div>
                      <div>Time: {formatDate(new Date().toISOString())}</div>
                      <div className="text-green-600">
                        Status: Approved for payment processing
                      </div>
                      {isMultipleRequests && (
                        <div>Batch Size: {requests.length} requests</div>
                      )}
                    </div>
                  </div>
                  
                  {/* Next Steps */}
                  <div className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <FaClock className="text-blue-600" size={14} />
                      <span className="font-semibold text-blue-700">Next Steps</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <div>• {isMultipleRequests ? 'All requests' : 'Request'} included in bank upload file</div>
                      <div>• {isMultipleRequests ? 'Payments' : 'Payment'} will be processed via NEFT</div>
                      <div>• Amount{isMultipleRequests ? 's' : ''} will be credited to reliever account{isMultipleRequests ? 's' : ''}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Notes */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-yellow-600" size={20} />
                  Processing Notes
                </h2>
                <div className="text-sm text-gray-700 space-y-2">
                  <div>• {isMultipleRequests ? 'These payments' : 'This payment'} will be processed as reliever compensation</div>
                  <div>• Transaction reference{isMultipleRequests ? 's' : ''} will be provided once bank processing is complete</div>
                  <div>• All necessary documentation has been verified and approved</div>
                  {isMultipleRequests && (
                    <div className="font-medium text-blue-600">
                      • Batch processing: All {requests.length} requests processed simultaneously
                    </div>
                  )}
                  {requests.some(req => req.delayed) && (
                    <div className="text-orange-600 font-medium">
                      • Some approvals were after 7:00 PM - those will be processed next working day
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

export default RelieverPaymentEntryModal;