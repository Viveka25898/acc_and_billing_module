import React, { useState } from 'react';
import { AiOutlineEye } from 'react-icons/ai';
import ManagerFilter from '../Components/ManagerFilter';
import RemarkModal from '../Components/RemarkModal';
import ManagerClarificationModal from '../Components/ManagerClarificationModal';
const dummyRequests = [
  {
    id: 1,
    employeeName: 'Rahul Sharma',
    excelFile: 'excel2.xlsx',
    attachments: ['bill1.pdf', 'receipt1.jpg'],
    status: 'Pending',
    remarks: '',
    date: '2025-05-20',
  },
  {
    id: 2,
    employeeName: 'Priya Verma',
    excelFile: 'excel2.xlsx',
    attachments: ['bill2.pdf'],
    status: 'Approved',
    remarks: '',
    date: '2025-05-18',
  },
  {
    id: 3,
    employeeName: 'Ankit Joshi',
    excelFile: 'excel3.xlsx',
    attachments: ['receipt3.pdf'],
    status: 'Rejected',
    remarks: 'Bill not clear',
    date: '2025-05-22',
    clarification: "Bill is Clear.",
  },
];

const VPReview = () => {
  const [requests, setRequests] = useState(dummyRequests);
  const [remarkInput, setRemarkInput] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [clarificationData, setClarificationData] = useState(null);
  const [filter, setFilter] = useState({ employee: '', status: 'All', date: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 2;

  const handleApprove = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: 'Approved', remarks: '', clarification: '' } : req
    );
    setRequests(updated);
    setClarificationData(null);
  };

 const handleReject = (id) => {
  if (!remarkInput.trim()) return alert('Please enter a remark for rejection.');
  const updated = requests.map((req) =>
    req.id === id
      ? { ...req, status: 'Rejected', remarks: remarkInput, clarification: '' } // <-- clear it here
      : req
  );
  setRequests(updated);
  setSelectedRejectId(null);
  setRemarkInput('');
};


  const filtered = requests.filter((req) => {
    const matchesName = req.employeeName.toLowerCase().includes(filter.employee.toLowerCase());
    const matchesStatus = filter.status === 'All' || req.status === filter.status;
    const matchesDate = !filter.date || req.date === filter.date;
    return matchesName && matchesStatus && matchesDate;
  });

  const sortedRequests = filtered.sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  });

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const getFileUrl = (filename) => `/dummy-files/${filename}`;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6 text-green-600">VP Operations Review</h2>

      <div className="overflow-x-auto">
        <ManagerFilter filter={filter} setFilter={setFilter} />

        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Employee</th>
              <th className="p-3 border">Date</th>
              <th className="p-3 border">Excel File</th>
              <th className="p-3 border">Attachments</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Remarks</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((req, index) => (
              <tr key={req.id} className="border">
                <td className="p-3 border">{(currentPage - 1) * rowsPerPage + index + 1}</td>
                <td className="p-3 border">{req.employeeName}</td>
                <td className="p-3 border">{req.date}</td>
                <td className="p-3 border text-blue-600 underline cursor-pointer flex items-center gap-1">
                  <a href={getFileUrl(req.excelFile)} target="_blank" rel="noopener noreferrer">
                    {req.excelFile}
                  </a>
                  <AiOutlineEye
                    className="hover:text-blue-800 cursor-pointer"
                    onClick={() => window.open(getFileUrl(req.excelFile), '_blank')}
                    title="View Excel file"
                  />
                </td>
                <td className="p-3 border">
                  <ul className="list-disc list-inside">
                    {req.attachments.map((file, idx) => (
                      <li key={idx} className="text-blue-600 underline cursor-pointer flex items-center gap-1">
                        <a href={getFileUrl(file)} target="_blank" rel="noopener noreferrer">
                          {file}
                        </a>
                        <AiOutlineEye
                          className="hover:text-blue-800 cursor-pointer"
                          onClick={() => window.open(getFileUrl(file), '_blank')}
                          title={`View ${file}`}
                        />
                      </li>
                    ))}
                  </ul>
                </td>
                <td className="p-3 border">
                  <span
                    className={`px-2 py-1 rounded text-white text-xs ${
                      req.status === 'Pending'
                        ? 'bg-yellow-500'
                        : req.status === 'Approved'
                        ? 'bg-green-600'
                        : 'bg-red-600'
                    }`}
                  >
                    {req.status}
                  </span>
                  {req.status === 'Rejected' && req.clarification && (
                    <AiOutlineEye
                      className="inline ml-2 text-blue-600 cursor-pointer"
                      title="View Clarification"
                      onClick={() => setClarificationData(req)}
                    />
                  )}
                </td>
                <td className="p-3 border text-red-600 text-sm">{req.remarks}</td>
                <td className="p-3 border">
                  {(req.status === 'Pending' || (req.status === 'Rejected' && req.clarification)) && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() =>
                            req.status === 'Rejected' && req.clarification
                              ? setClarificationData(req)
                              : setSelectedRejectId(req.id)
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex justify-end items-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {Math.ceil(sortedRequests.length / rowsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(sortedRequests.length / rowsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(sortedRequests.length / rowsPerPage)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>

        <RemarkModal
          isOpen={selectedRejectId !== null}
          onClose={() => {
            setSelectedRejectId(null);
            setRemarkInput('');
          }}
          onSubmit={() => handleReject(selectedRejectId)}
          remark={remarkInput}
          setRemark={setRemarkInput}
        />

        <ManagerClarificationModal
          isOpen={!!clarificationData}
          onClose={() => setClarificationData(null)}
          data={clarificationData}
          onApprove={handleApprove}
          onReject={(id) => {
            setSelectedRejectId(id);
            setClarificationData(null);
          }}
        />
      </div>
    </div>
  );
};

export default VPReview;
