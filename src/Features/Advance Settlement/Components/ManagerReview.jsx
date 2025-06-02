import React, { useState } from 'react';
import RemarkModal from './RemarkModal';
import { AiOutlineEye } from 'react-icons/ai'; // Add this import

const dummyRequests = [
  {
    id: 1,
    employeeName: 'Rahul Sharma',
    excelFile: 'excel1.xlsx',
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
  },
];

const ManagerReview = () => {
  const [requests, setRequests] = useState(dummyRequests);
  const [remarkInput, setRemarkInput] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState(null);

  const handleApprove = (id) => {
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: 'Approved', remarks: '' } : req
    );
    setRequests(updated);
  };

  const handleReject = (id) => {
    if (!remarkInput.trim()) return alert('Please enter a remark for rejection.');
    const updated = requests.map((req) =>
      req.id === id ? { ...req, status: 'Rejected', remarks: remarkInput } : req
    );
    setRequests(updated);
    setSelectedRejectId(null);
    setRemarkInput('');
  };

  // Sort pending first
  const sortedRequests = [...requests].sort((a, b) => {
    if (a.status === 'Pending' && b.status !== 'Pending') return -1;
    if (a.status !== 'Pending' && b.status === 'Pending') return 1;
    return 0;
  });

  // Helper function for file URLs (adjust base path as needed)
  const getFileUrl = (filename) => `/dummy-files/${filename}`;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Advance Settlement Requests</h2>

      <div className="overflow-x-auto">
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
            {sortedRequests.map((req, index) => (
              <tr key={req.id} className="border">
                <td className="p-3 border">{index + 1}</td>
                <td className="p-3 border">{req.employeeName}</td>
                <td className="p-3 border">{req.date}</td>
                <td className="p-3 border text-blue-600 underline cursor-pointer flex items-center gap-1">
                  <a
                    href={getFileUrl(req.excelFile)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
                      <li
                        key={idx}
                        className="text-blue-600 underline cursor-pointer flex items-center gap-1"
                      >
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
                </td>
                <td className="p-3 border text-red-600 text-sm">{req.remarks}</td>
                <td className="p-3 border">
                  {req.status === 'Pending' && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setSelectedRejectId(req.id)}
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
      </div>
    </div>
  );
};

export default ManagerReview;
