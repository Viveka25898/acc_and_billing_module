/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ManagerFilter from './ManagerFilter';
import { useSelector } from 'react-redux';

// const initialRequests = [
//   {
//     id: 1,
//     employeeName: 'Amit Sharma',
//     employeeId: 'EMP001',
//     amount: '5000',
//     requestDate: '2024-05-01',
//     reason: 'Medical Emergency',
//     status: 'Rejected by Line Manager',
//     remarks: 'Missing medical bills',
//     clarification: 'Medical bills attached in new document',
//   },
//   {
//     id: 2,
//     employeeName: 'Sneha Patil',
//     employeeId: 'EMP002',
//     amount: '7000',
//     requestDate: '2024-05-02',
//     reason: 'House Rent',
//     status: 'Pending Manager Approval',
//   },
// ];

const ManagerApproval = () => {
  const loggedInUser = useSelector((state) => state.auth.user);
  console.log(loggedInUser);
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ name: '', employeeId: '', date: '' });
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
      (filters.date === '' || req.requestDate === filters.date)
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
    <div className="min-h-screen px-4 py-10 bg-white rounded shadow-md">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-green-800 mb-6">
          Advance Requests – Line Manager Approval
        </h2>

        <ManagerFilter filters={filters} setFilters={setFilters} />

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-green-200 text-sm">
            <thead className="bg-green-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Employee ID</th>
                <th className="border px-4 py-2">Amount</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">O/s Balance</th>
                <th className="border px-4 py-2">Reason</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((req) => (
                <tr  key={req.submittedAt}className="text-center">
                  <td className="border px-4 py-2">{req.employeeName}</td>
                  <td className="border px-4 py-2">{req.employeeId}</td>
                  <td className="border px-4 py-2">₹{req.amount}</td>
                  <td className="border px-4 py-2">{req.requestDate}</td>
                  <td className="border px-4 py-2">₹{Math.floor(Math.random() * 5000)}</td>
                  <td className="border px-4 py-2">
                    <button
                    onClick={() =>
                      setModalData({
                        reason: req.reason,
                        customReason: req.customReason,
                      })
                    }
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEye />
                    </button>
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex justify-center items-center gap-2">
                      <span
                        className={`font-semibold ${
                          req.status.includes('Rejected')
                            ? 'text-red-600'
                            : req.status.includes('Pending')
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {req.status}
                      </span>
                      {req.status === 'Rejected by Line Manager' && req.clarification && (
                        <button
                          onClick={() =>
                            setModalData({
                              reason: req.remarks || req.reason,
                              clarification: req.clarification,
                            })
                          }
                          title="View Remarks / Clarification"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEye />
                        </button>
                      )}
                    </div>
                  </td>

                  <td className="border px-4 py-2">
                    <div className="flex justify-center gap-2">
                      <button
                        disabled={!isActionAllowed(req)}
                        onClick={() => handleApprove(req.submittedAt)}
                        className={`px-3 py-1 rounded ${
                          isActionAllowed(req)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                        }`}
                      >
                        Approve
                      </button>
                      <button
                        disabled={!isActionAllowed(req)}
                        onClick={() => setRejectId(req.submittedAt)}
                        className={`px-3 py-1 rounded ${
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
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded font-medium ${
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
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            {modalData.reason && (
              <div className="mb-4">
                <p className="text-gray-800 mt-1">{modalData.reason}</p>
              </div>
            )}
            {modalData.clarification && (
              <div>
                <h4 className="font-semibold text-green-700">Employee Clarification:</h4>
                <p className="text-gray-800 mt-1">{modalData.clarification}</p>
              </div>
            )}
            <div className="text-right mt-6">
              <button
                onClick={() => setModalData(null)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
          <div className="bg-white p-6 rounded shadow max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Rejection Remarks</h3>
            <textarea
              className="w-full border px-3 py-2 rounded mb-4"
              rows="3"
              placeholder="Enter reason for rejection"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleReject}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setRejectId(null);
                  setRemarks('');
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
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

export default ManagerApproval;
