/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ManagerFilter from './ManagerFilter';
import { useSelector } from 'react-redux';

const ManagerApproval = () => {
  const loggedInUser = useSelector((state) => state.auth.user);
  console.log(loggedInUser);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ name: '', employeeId: '', date: '', requestId: '' });
  const [modalData, setModalData] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("advanceRequests")) || [];

    // Filter only those requests assigned to the logged-in line manager
    const filteredRequests = allRequests.filter(
      (req) => req.assignedTo === loggedInUser
    );

    setRequests(filteredRequests);
  }, [loggedInUser]);
  console.log(requests);

  // Helper function to format multiple reasons
  const formatReasons = (reason, customReason) => {
    const reasons = [];
    
    if (reason) {
      // Handle case where reason might be an array or comma-separated string
      if (Array.isArray(reason)) {
        reasons.push(...reason.filter(r => r && r.toString().trim()));
      } else if (typeof reason === 'string' && reason.trim()) {
        // Split by comma and clean up each reason
        const splitReasons = reason.split(',').map(r => r.trim()).filter(r => r);
        reasons.push(...splitReasons);
      } else if (reason && typeof reason === 'object') {
        // Handle case where reason might be an object
        reasons.push(reason.toString().trim());
      } else if (reason) {
        // Handle any other type
        reasons.push(reason.toString().trim());
      }
    }
    
    if (customReason && customReason.toString().trim()) {
      reasons.push(customReason.toString().trim());
    }
    
    // Remove duplicates and join with comma and space
    const uniqueReasons = [...new Set(reasons.filter(r => r))];
    return uniqueReasons.length > 0 ? uniqueReasons.join(', ') : 'No reason provided';
  };

// Helper function to get employee O/S balance
const getEmployeeOSBalance = (employeeId) => {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find the employee by employeeId
    const employee = users.find(user => 
      user.empId === employeeId || 
      user.username === employeeId ||
      (user.empId && user.empId.toString() === employeeId.toString())
    );
    
    return employee?.osBalance || 0;
  } catch (error) {
    console.error('Error getting employee O/S balance:', error);
    return 0;
  }
};

  //Approve
  const handleApprove = (submittedAt) => {
    // 1. Get all requests
    const allRequests = JSON.parse(localStorage.getItem("advanceRequests")) || [];

    // 2. Update status of the specific request
    const updatedAllRequests = allRequests.map((req) =>
      req.submittedAt === submittedAt
        ? { ...req, status: 'Pending VP Approval', remarks: '' }
        : req
    );

    // 3. Save globally
    localStorage.setItem("advanceRequests", JSON.stringify(updatedAllRequests));

    // 4. Filter and update local view
    const filtered = updatedAllRequests.filter(
      (req) => req.assignedTo === loggedInUser
    );
    setRequests(filtered);

    toast.success("Request Approved");
  };

  //Reject
  const handleReject = () => {
    if (!remarks.trim()) return alert('Please provide rejection remarks');

    const allRequests = JSON.parse(localStorage.getItem("advanceRequests")) || [];

    const updatedAllRequests = allRequests.map((req) =>
      req.submittedAt === rejectId
        ? {
            ...req,
            status: 'Rejected by Line Manager',
            remarks,
            clarification: '', // clear previous clarification
          }
        : req
    );

    localStorage.setItem("advanceRequests", JSON.stringify(updatedAllRequests));

    const filtered = updatedAllRequests.filter(
      (req) => req.assignedTo === loggedInUser
    );
    setRequests(filtered);

    setRemarks('');
    setRejectId(null);
    toast.error('Rejected successfully.');
  };

  const filteredRequests = requests
    .filter((req) =>
      req.employeeName.toLowerCase().includes(filters.name.toLowerCase()) &&
      req.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase()) &&
      (filters.date === '' || req.requestDate === filters.date) &&
      (filters.requestId === '' || (req.requestId && req.requestId.toLowerCase().includes(filters.requestId.toLowerCase())))
    )
    .sort((a, b) => {
      const order = {
      'Pending Manager Approval': 1,
      'Rejected by Line Manager': 2,
      'Pending VP Approval': 3,
      'Rejected by VP': 4,
      'Pending AE Approval': 5,
      'Approved by AE': 6,
      'Rejected by AE': 7,
    };

      return (order[a.status] || 99) - (order[b.status] || 99);
    });

    //Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isActionAllowed = (req) => {
  return (
    req.status === 'Pending Manager Approval' ||
    (req.status === 'Rejected by Line Manager' && req.clarification)
  );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-2xl px-6 py-5 mb-6 shadow">
          <h1 className="text-xl sm:text-2xl font-bold text-white">✅ Advance Requests – Line Manager Approval</h1>
          <p className="text-green-100 text-sm mt-0.5">Review and approve/reject employee advance requests</p>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-xl border border-green-100 shadow-sm px-4 py-3 mb-5">
          <ManagerFilter filters={filters} setFilters={setFilters} />
        </div>

        {/* Table */}
        {paginatedRequests.length === 0 ? (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm py-16 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 font-medium">No pending requests found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-green-600 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Request ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Emp ID</th>
                    <th className="px-4 py-3 text-left font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">O/S Balance</th>
                    <th className="px-4 py-3 text-left font-semibold">Reason</th>
                    <th className="px-4 py-3 text-left font-semibold">Status</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-50">
                  {paginatedRequests.map((req) => (
                    <tr key={req.submittedAt} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">{req.requestId || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{req.employeeName}</td>
                      <td className="px-4 py-3 text-gray-600">{req.employeeId}</td>
                      <td className="px-4 py-3 font-semibold text-green-700">₹{Number(req.amount).toLocaleString('en-IN')}</td>
                      <td className="px-4 py-3 text-gray-600">{req.requestDate}</td>
                      <td className="px-4 py-3 text-gray-700">₹{(getEmployeeOSBalance(req.employeeId) || 0).toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setModalData({
                            reason: req.reason,
                            customReason: req.customReason,
                            formattedReason: formatReasons(req.reason, req.customReason)
                          })}
                          className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 px-2.5 py-1 rounded-full hover:bg-green-100 transition"
                        >
                          <FaEye className="text-xs" /> View
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            req.status.includes('Rejected') ? 'bg-red-100 text-red-700' :
                            req.status.includes('Pending') ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {req.status}
                          </span>
                          {req.status === 'Rejected by Line Manager' && req.clarification && (
                            <button
                              onClick={() => setModalData({
                                reason: req.remarks || req.reason,
                                clarification: req.clarification,
                                formattedReason: formatReasons(req.remarks || req.reason, req.customReason)
                              })}
                              title="View Remarks / Clarification"
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEye className="text-xs" />
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            disabled={!isActionAllowed(req)}
                            onClick={() => handleApprove(req.submittedAt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req)
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Approve
                          </button>
                          <button
                            disabled={!isActionAllowed(req)}
                            onClick={() => setRejectId(req.submittedAt)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                              isActionAllowed(req)
                                ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 px-4 py-4 border-t border-green-100">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold transition ${
                      page === currentPage
                        ? 'bg-green-600 text-white shadow'
                        : 'bg-white text-green-700 border border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reason / Clarification Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Request Details</h3>
            {(modalData.reason || modalData.customReason || modalData.formattedReason) && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-semibold text-green-700 mb-1 text-sm">Reason(s)</h4>
                <p className="text-gray-700 text-sm">
                  {modalData.formattedReason || formatReasons(modalData.reason, modalData.customReason)}
                </p>
              </div>
            )}
            {modalData.clarification && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h4 className="font-semibold text-yellow-700 mb-1 text-sm">Employee Clarification</h4>
                <p className="text-gray-700 text-sm">{modalData.clarification}</p>
              </div>
            )}
            <div className="text-right mt-5">
              <button
                onClick={() => setModalData(null)}
                className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-1">❌ Rejection Remarks</h3>
            <p className="text-sm text-gray-500 mb-4">Please provide a reason for rejecting this request.</p>
            <textarea
              className="w-full border border-gray-300 px-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none mb-4"
              rows="3"
              placeholder="Enter reason for rejection..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setRejectId(null); setRemarks(''); }}
                className="px-4 py-2 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 rounded-lg text-sm bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerApproval;