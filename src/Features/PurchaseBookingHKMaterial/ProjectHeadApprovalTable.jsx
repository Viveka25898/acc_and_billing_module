import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Dummy material requests accepted by the Manager (simulate fetched data)
const initialRequests = [
  {
    id: 1,
    material: 'Cement',
    quantity: '50 bags',
    requestedBy: 'Site Manager A',
    siteLocation: 'Site 101, Bangalore',
    date: '2025-05-25',
    status: 'Pending',
  },
  {
    id: 2,
    material: 'Bricks',
    quantity: '1000 units',
    requestedBy: 'Site Manager B',
    siteLocation: 'Site 102, Hyderabad',
    date: '2025-05-26',
    status: 'Pending',
  },
];

const ProjectHeadApprovalTable = () => {
  const [requests, setRequests] = useState([]);
  const navigate=useNavigate()

  useEffect(() => {
    // Simulate fetching only Manager-approved requests
    try {
      setRequests(initialRequests);
    } catch (error) {
      console.error('Error loading requests:', error);
    }
  }, []);

  const updateStatus = (id, newStatus) => {
    try {
      setRequests(prev =>
        prev.map(req =>
          req.id === id ? { ...req, status: newStatus } : req
        )
      );
      // Future: Call API or dispatch Redux action here
    } catch (error) {
      console.error(`Failed to update status for ID ${id}:`, error);
    }
  };

  const isActionDisabled = status => status !== 'Pending';

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-green-700">Project Head Material Approvals</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">#</th>
              <th className="py-2 px-4 border">Material</th>
              <th className="py-2 px-4 border">Quantity</th>
              <th className="py-2 px-4 border">Requested By</th>
              <th className="py-2 px-4 border">Site Location</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req, index) => (
              <tr key={req.id} className="text-center">
                <td className="py-2 px-4 border">{index + 1}</td>
                <td className="py-2 px-4 border">{req.material}</td>
                <td className="py-2 px-4 border">{req.quantity}</td>
                <td className="py-2 px-4 border">{req.requestedBy}</td>
                <td className="py-2 px-4 border">{req.siteLocation}</td>
                <td className="py-2 px-4 border">{req.date}</td>
                <td className="py-2 px-4 border font-medium">
                  {req.status}
                </td>
                <td className="py-2 px-4 border text-center space-y-1">
                  {/* Accept Button */}
                  <button
                    onClick={() => updateStatus(req.id, 'Accepted')}
                    disabled={isActionDisabled(req.status)}
                    className={`px-2 py-1 text-sm rounded ${
                      req.status === 'Accepted'
                        ? 'bg-green-400 text-white cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    Accept
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => updateStatus(req.id, 'Rejected')}
                    disabled={isActionDisabled(req.status)}
                    className={`px-2 py-1 text-sm rounded ml-1 ${
                      req.status === 'Rejected'
                        ? 'bg-red-400 text-white cursor-not-allowed'
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    Reject
                  </button>

                {/* Generate PO Button (Visible only if accepted) */}
                {req.status === 'Accepted' && (
                  <div className="mt-1">
                    <button
                      onClick={() =>
                        navigate('/dashboard/ph/po-form', {
                          state: { requestData: req },
                        })
                      }
                      className="px-2 py-1 text-sm rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Generate PO
                    </button>
                  </div>
                )}
            </td>


              </tr>
            ))}
            {requests.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No approved requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectHeadApprovalTable;
