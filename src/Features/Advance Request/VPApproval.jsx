import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ManagerFilter from './ManagerFilter';
import { useSelector } from 'react-redux';

const VPApproval = () => {
  const loggedInUser = useSelector((state) => state.auth.user);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ name: '', employeeId: '', date: '', requestId: '' });
  const [modalData, setModalData] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [rejectId, setRejectId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

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

  useEffect(() => {
    const allRequests = JSON.parse(localStorage.getItem("advanceRequests")) || [];
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Find all line managers who report to this VP
    const lineManagersUnderThisVP = allUsers.filter(
      (user) => user.reportsTo === loggedInUser && user.role === "line-manager"
    );

    // Get the usernames of these line managers
    const lineManagerUsernames = lineManagersUnderThisVP.map(lm => lm.username);

    // Filter requests that VP should see
    const filteredRequests = allRequests.filter((req) => {
      // Type 1: Employee requests approved by line managers under this VP
      const isEmployeeRequestApprovedByMyLM = 
        lineManagerUsernames.includes(req.assignedTo) && 
        (req.status === 'Pending VP Approval' || 
         req.status === 'Pending AE Approval' ||
         (req.status === 'Rejected by VP Operations' && req.clarification));

      // Type 2: Line Manager's own requests that are assigned to this VP
      const isLineManagerRequestForThisVP = 
        req.assignedTo === loggedInUser && 
        lineManagerUsernames.includes(req.submittedBy) &&
        (req.status === 'Pending VP Approval' ||
         req.status === 'Pending AE Approval' ||
         (req.status === 'Rejected by VP Operations' && req.clarification));

      return isEmployeeRequestApprovedByMyLM || isLineManagerRequestForThisVP;
    });

    setRequests(filteredRequests);
  }, [loggedInUser]);

  const handleApprove = (submittedAt) => {
    const allRequests = JSON.parse(localStorage.getItem("advanceRequests")) || [];
    const approvalTime = new Date();

    // Check if approval is before 15:59 PM deadline
    const isBeforeDeadline = approvalTime.getHours() < 19 || 
                           (approvalTime.getHours() === 19 && approvalTime.getMinutes() <= 59);

    const updatedAllRequests = allRequests.map((req) =>
      req.submittedAt === submittedAt
        ? { 
            ...req, 
            status: 'Pending AE Approval', 
            remarks: '', 
            vpApprovedBy: loggedInUser,
            vpApprovedAt: approvalTime.toISOString(), // Added timestamp
            isVPRequest: true, // Mark as VP request
            vpApprovedBeforeDeadline: isBeforeDeadline // Track if approved before deadline
          }
        : req
    );

    localStorage.setItem("advanceRequests", JSON.stringify(updatedAllRequests));

    // Update local state with the same filtering logic as initial load
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const lineManagersUnderThisVP = allUsers.filter(
      (user) => user.reportsTo === loggedInUser && user.role === "line-manager"
    );
    const lineManagerUsernames = lineManagersUnderThisVP.map(lm => lm.username);
    
    const filtered = updatedAllRequests.filter((req) => {
      const isEmployeeRequestApprovedByMyLM = 
        lineManagerUsernames.includes(req.assignedTo) && 
        (req.status === 'Pending VP Approval' || 
         req.status === 'Pending AE Approval' ||
         (req.status === 'Rejected by VP Operations' && req.clarification));

      const isLineManagerRequestForThisVP = 
        req.assignedTo === loggedInUser && 
        lineManagerUsernames.includes(req.submittedBy) &&
        (req.status === 'Pending VP Approval' ||
         req.status === 'Pending AE Approval' ||
         (req.status === 'Rejected by VP Operations' && req.clarification));

      return isEmployeeRequestApprovedByMyLM || isLineManagerRequestForThisVP;
    });
    
    setRequests(filtered);
    
    // Show different messages based on timing
    if (isBeforeDeadline) {
      toast.success("Request Approved - Sent to Account Executive (Eligible for same-day processing)");
    } else {
      toast.warning("Request Approved - Sent to Account Executive (Will be processed next working day - approved after 15:59)");
    }
  };

  const handleReject = () => {
    if (!remarks.trim()) return alert('Please provide rejection remarks');

    const allRequests = JSON.parse(localStorage.getItem("advanceRequests")) || [];
    const rejectionTime = new Date();

    const updatedAllRequests = allRequests.map((req) =>
      req.submittedAt === rejectId
        ? {
            ...req,
            status: 'Rejected by VP Operations',
            remarks,
            clarification: '',
            vpRejectedBy: loggedInUser,
            vpRejectedAt: rejectionTime.toISOString() // Added rejection timestamp
          }
        : req
    );

    localStorage.setItem("advanceRequests", JSON.stringify(updatedAllRequests));

    // Update local state with the same filtering logic
    const allUsers = JSON.parse(localStorage.getItem("users")) || [];
    const lineManagersUnderThisVP = allUsers.filter(
      (user) => user.reportsTo === loggedInUser && user.role === "line-manager"
    );
    const lineManagerUsernames = lineManagersUnderThisVP.map(lm => lm.username);
    
    const filtered = updatedAllRequests.filter((req) => {
      const isEmployeeRequestApprovedByMyLM = 
        lineManagerUsernames.includes(req.assignedTo) && 
        (req.status === 'Pending VP Approval' || 
         req.status === 'Pending AE Approval' ||
         (req.status === 'Rejected by VP Operations' && req.clarification));

      const isLineManagerRequestForThisVP = 
        req.assignedTo === loggedInUser && 
        lineManagerUsernames.includes(req.submittedBy) &&
        (req.status === 'Pending VP Approval' ||
         req.status === 'Pending AE Approval' ||
         (req.status === 'Rejected by VP Operations' && req.clarification));

      return isEmployeeRequestApprovedByMyLM || isLineManagerRequestForThisVP;
    });
    
    setRequests(filtered);
    setRemarks('');
    setRejectId(null);
    toast.error('Request Rejected by VP Operations');
  };

  const filteredRequests = requests
    .filter((req) =>
      req.employeeName.toLowerCase().includes(filters.name.toLowerCase()) &&
      req.employeeId.toLowerCase().includes(filters.employeeId.toLowerCase()) &&
      (filters.date === '' || req.requestDate === filters.date) &&
      (filters.requestId === '' || (req.requestId && req.requestId.toLowerCase().includes(filters.requestId.toLowerCase())))
    )
    .sort((a, b) => {
      // Sort by status priority first (Pending VP Approval at top)
      const statusPriority = {
        'Pending VP Approval': 1,
        'Rejected by VP Operations': 2,
        'Pending AE Approval': 3
      };
      
      const aPriority = statusPriority[a.status] || 4;
      const bPriority = statusPriority[b.status] || 4;
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Then sort by request date - newest first
      return new Date(b.requestDate) - new Date(a.requestDate);
    });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const isActionAllowed = (req) => {
    return (
      req.status === 'Pending VP Approval' ||
      (req.status === 'Rejected by VP Operations' && req.clarification)
    );
  };

  // Helper function to check if current time is before deadline
  const isCurrentlyBeforeDeadline = () => {
    const now = new Date();
    return now.getHours() < 15 || (now.getHours() === 15 && now.getMinutes() <= 59);
  };

  return (
    <div className="min-h-screen px-2 py-6 bg-white rounded shadow-md overflow-x-hidden">
      <div className="max-w-full mx-2">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">
            Advance Requests – VP Operations Approval
          </h2>
          <div className={`text-sm px-3 py-1 rounded ${
            isCurrentlyBeforeDeadline() 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isCurrentlyBeforeDeadline() 
              ? '🟢 Before 15:59 - Same day processing available' 
              : '🔴 After 15:59 - Next day processing only'
            }
          </div>
        </div>

        <ManagerFilter filters={filters} setFilters={setFilters} />

        <div className="overflow-x-auto">
          <table className="w-full table-auto border border-green-200 text-xs">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-2 py-1 whitespace-nowrap">Request ID</th>
                <th className="border px-2 py-1 whitespace-nowrap">Name</th>
                <th className="border px-2 py-1 whitespace-nowrap">Emp ID</th>
                <th className="border px-2 py-1 whitespace-nowrap">Amount</th>
                <th className="border px-2 py-1 whitespace-nowrap">Date</th>
                <th className="border px-2 py-1 whitespace-nowrap">O/s Bal</th>
                <th className="border px-2 py-1 whitespace-nowrap">Reason</th>
                <th className="border px-2 py-1 whitespace-nowrap">Submitted By</th>
                <th className="border px-2 py-1 whitespace-nowrap">Req Type</th>
                <th className="border px-2 py-1 whitespace-nowrap">Status</th>
                <th className="border px-2 py-1 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((req) => (
                <tr key={req.submittedAt} className="text-center">
                  <td className="border px-2 py-1 whitespace-nowrap font-mono text-xs">
                    {req.requestId || 'N/A'}
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">{req.employeeName}</td>
                  <td className="border px-2 py-1 whitespace-nowrap">{req.employeeId}</td>
                  <td className="border px-2 py-1 whitespace-nowrap">₹{req.amount}</td>
                  <td className="border px-2 py-1 whitespace-nowrap">{req.requestDate}</td>
                  <td className="border px-2 py-1 whitespace-nowrap">₹{Math.floor(Math.random() * 5000)}</td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    <button
                      onClick={() =>
                        setModalData({
                          reason: req.reason,
                          customReason: req.customReason,
                          formattedReason: formatReasons(req.reason, req.customReason)
                        })
                      }
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    <span className="text-gray-700 font-medium">
                      {req.submittedBy || req.employeeName}
                    </span>
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                      req.assignedTo === loggedInUser 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {req.assignedTo === loggedInUser ? 'Manager' : 'Employee'}
                    </span>
                  </td>
                  <td className="border px-2 py-1 whitespace-nowrap">
                    <div className="flex justify-center items-center gap-1">
                      <span
                        className={`font-semibold ${
                          req.status.includes('Rejected')
                            ? 'text-red-600'
                            : req.status.includes('Pending')
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {req.status.split('by')[0]}
                      </span>
                      {req.status === 'Rejected by VP Operations' && req.clarification && (
                        <button
                          onClick={() =>
                            setModalData({
                              reason: req.remarks || req.reason,
                              clarification: req.clarification,
                              formattedReason: formatReasons(req.remarks || req.reason, req.customReason)
                            })
                          }
                          title="View Remarks / Clarification"
                          className="text-blue-600 hover:text-blue-800 ml-1"
                        >
                          <FaEye />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="border px-2 py-1 whitespace-nowrap">
                    <div className="flex justify-center gap-1">
                      <button
                        disabled={!isActionAllowed(req)}
                        onClick={() => handleApprove(req.submittedAt)}
                        className={`px-2 py-0.5 rounded text-xs ${
                          isActionAllowed(req)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                        title={
                          isCurrentlyBeforeDeadline() 
                            ? "Approve for same-day processing" 
                            : "Approve for next-day processing (after 15:59)"
                        }
                      >
                        Approve
                      </button>
                      <button
                        disabled={!isActionAllowed(req)}
                        onClick={() => setRejectId(req.submittedAt)}
                        className={`px-2 py-0.5 rounded text-xs ${
                          isActionAllowed(req)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
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
          
          {paginatedRequests.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No requests pending VP approval at this time.
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-1 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2 py-1 border rounded text-xs ${
                  page === currentPage
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 border-green-300'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Reason + Clarification Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow max-w-md w-full mx-2">
            <h3 className="text-lg font-semibold mb-3">Request Details</h3>
            {(modalData.reason || modalData.customReason || modalData.formattedReason) && (
              <div className="mb-3">
                <h4 className="font-semibold text-gray-700 text-sm">Reason:</h4>
                <p className="text-gray-800 mt-1 text-sm">
                  {modalData.formattedReason || formatReasons(modalData.reason, modalData.customReason)}
                </p>
              </div>
            )}
            {modalData.clarification && (
              <div>
                <h4 className="font-semibold text-green-700 text-sm">Employee Clarification:</h4>
                <p className="text-gray-800 mt-1 text-sm">{modalData.clarification}</p>
              </div>
            )}
            <div className="text-right mt-4">
              <button
                onClick={() => setModalData(null)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow max-w-md w-full mx-2">
            <h3 className="text-lg font-semibold mb-3">VP Rejection Remarks</h3>
            <textarea
              className="w-full border px-2 py-1 rounded mb-3 text-sm"
              rows="4"
              placeholder="Enter detailed reason for rejection as VP Operations..."
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              >
                Reject Request
              </button>
              <button
                onClick={() => {
                  setRejectId(null);
                  setRemarks('');
                }}
                className="bg-gray-300 text-black px-3 py-1 rounded text-sm hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VPApproval;