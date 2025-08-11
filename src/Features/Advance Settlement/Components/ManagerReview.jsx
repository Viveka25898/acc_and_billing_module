import React, { useState, useEffect } from 'react';
import { AiOutlineEye, AiOutlineCheck, AiOutlineClose } from 'react-icons/ai';
import RemarkModal from './RemarkModal';
import ManagerFilter from './ManagerFilter';
import ManagerClarificationModal from './ManagerClarificationModal';

const ManagerReview = ({ currentUser }) => {
  const [settlements, setSettlements] = useState([]);
  const [remarkInput, setRemarkInput] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [clarificationData, setClarificationData] = useState(null);
  const [filter, setFilter] = useState({
    employee: '',
    status: 'All',
    date: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const storedSettlements = JSON.parse(localStorage.getItem('settlements')) || [];
   
    const pendingRequests = storedSettlements.filter(settlement => 
      settlement.assignedTo === currentUser?.username ||
      (settlement.status.includes('Clarification Submitted') && 
       settlement.currentLevel === currentUser?.role)
    );
    setSettlements(pendingRequests);
  }, [currentUser]);

  const handleApprove = (id) => {
    const updated = settlements.map(settlement => {
      if (settlement.id === id) {
        const nextApprover = getNextApprover(settlement.currentLevel);
        const newStatus = nextApprover 
          ? `Pending ${nextApprover.title} Approval` 
          : 'Approved by Account Executive';
        
        return {
          ...settlement,
          status: newStatus,
          currentLevel: nextApprover?.level || 'completed',
          assignedTo: nextApprover?.username || null,
          rejectionReason: null,
          history: [
            ...settlement.history,
            {
              action: settlement.status.includes('Clarification') ? 
                'approved-after-clarification' : 'approved',
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: ''
            }
          ]
        };
      }
      return settlement;
    });

    updateSettlements(updated);
    setClarificationData(null);
  };

  const handleReject = (id) => {
    if (!remarkInput.trim()) return alert('Please enter a rejection reason.');

    const updated = settlements.map(settlement => {
      if (settlement.id === id) {
        const isClarification = settlement.status.includes('Clarification');
        const status = isClarification 
          ? 'Rejected After Clarification' 
          : `Rejected by ${getCurrentApproverTitle(settlement.currentLevel)}`;
        
        return {
          ...settlement,
          status,
          rejectionReason: remarkInput,
          history: [
            ...settlement.history,
            {
              action: isClarification ? 'rejected-after-clarification' : 'rejected',
              by: currentUser.username,
              date: new Date().toISOString(),
              comments: remarkInput
            }
          ]
        };
      }
      return settlement;
    });

    updateSettlements(updated);
    setSelectedRejectId(null);
    setRemarkInput('');
  };

  const getNextApprover = (currentLevel) => {
    const hierarchy = {
      'line-manager': { 
        level: 'vp-operations', 
        title: 'VP Operations', 
        username: getVPUsername() 
      },
      'vp-operations': { 
        level: 'account-executive', 
        title: 'Account Executive',
        username: getAEUsername()
      },
      'account-executive': null
    };
    return hierarchy[currentLevel];
  };

  const getVPUsername = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.role === 'vp-operations')?.username;
  };

  const getAEUsername = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.role === 'account-executive')?.username;
  };

  const getCurrentApproverTitle = (currentLevel) => {
    const titles = {
      'line-manager': 'Line Manager',
      'vp-operations': 'VP Operations',
      'account-executive': 'Account Executive'
    };
    return titles[currentLevel] || 'Line Manager';
  };

  const updateSettlements = (updatedSettlements) => {
    setSettlements(updatedSettlements);
    const allSettlements = JSON.parse(localStorage.getItem('settlements')) || [];
    const updatedAll = allSettlements.map(settlement => {
      const updated = updatedSettlements.find(s => s.id === settlement.id);
      return updated || settlement;
    });
    localStorage.setItem('settlements', JSON.stringify(updatedAll));
  };

  const filtered = settlements.filter(settlement => {
    const matchesName = settlement.employeeName.toLowerCase().includes(filter.employee.toLowerCase());
    const matchesStatus = filter.status === 'All' || 
      settlement.status.toLowerCase().includes(filter.status.toLowerCase());
    const matchesDate = !filter.date || 
      new Date(settlement.submittedAt).toISOString().split('T')[0] === filter.date;
    return matchesName && matchesStatus && matchesDate;
  });

  const sortedRequests = filtered.sort((a, b) => {
    if (a.status.includes('Pending') && !b.status.includes('Pending')) return -1;
    if (!a.status.includes('Pending') && b.status.includes('Pending')) return 1;
    return new Date(b.submittedAt) - new Date(a.submittedAt);
  });

  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const calculateTotalAmount = (expenseItems) => {
    return expenseItems.reduce((sum, item) => {
      const amount = Number(item['Amount (₹)']) || 0;
      return sum + amount;
    }, 0);
  };

  const getStatusBadgeClass = (status) => {
    if (status.includes('Rejected')) return 'bg-red-100 text-red-800';
    if (status.includes('Approved')) return 'bg-green-100 text-green-800';
    if (status.includes('Clarification')) return 'bg-purple-100 text-purple-800';
    return 'bg-yellow-100 text-yellow-800';
  };

  const shouldShowActions = (settlement) => {
    return (
      (settlement.status.includes('Pending') && settlement.assignedTo === currentUser.username) ||
      settlement.status.includes('Clarification Submitted')
    );
  };

  // Function to handle file viewing
  const viewFile = (fileData) => {
    // For demo purposes, we'll just open a new window
    // In a real app, you would fetch the actual file from your server
    const fileUrl = URL.createObjectURL(new Blob([fileData], { type: 'application/pdf' }));
    window.open(fileUrl, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-green-600">Advance Settlement Requests</h2>

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
              <th className="p-3 border">Amount</th>
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
                <td className="p-3 border">
                  {new Date(req.submittedAt).toLocaleDateString()}
                </td>
                
                {/* Excel File Column */}
                <td className="p-3 border">
                  <div className="flex items-center gap-1 text-blue-600 cursor-pointer">
                    <span 
                      onClick={() => viewFile(req.excelFile)}
                      className="underline"
                    >
                      View Excel
                    </span>
                    <AiOutlineEye 
                      onClick={() => viewFile(req.excelFile)}
                      className="hover:text-blue-800"
                      title="View Excel File"
                    />
                  </div>
                </td>
                
                {/* Attachments Column */}
                <td className="p-3 border">
                  <div className="space-y-1">
                    {req.attachments?.map((attachment, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-blue-600 cursor-pointer">
                        <span 
                          onClick={() => viewFile(attachment)}
                          className="underline text-sm"
                        >
                          {attachment.name || `Attachment ${idx + 1}`}
                        </span>
                        <AiOutlineEye 
                          onClick={() => viewFile(attachment)}
                          className="hover:text-blue-800"
                          title={`View ${attachment.name || 'Attachment'}`}
                        />
                      </div>
                    ))}
                  </div>
                </td>
                
                <td className="p-3 border">
                  ₹{calculateTotalAmount(req.expenseItems).toFixed(2)}
                </td>
                <td className="p-3 border">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusBadgeClass(req.status)}`}>
                    {req.status}
                  </span>
                  {req.rejectionReason && (
                    <AiOutlineEye
                      className="inline ml-2 text-blue-600 cursor-pointer"
                      onClick={() => setClarificationData(req)}
                      title="View Details"
                    />
                  )}
                </td>
                <td className="p-3 border text-sm">
                  {req.rejectionReason || '-'}
                </td>
                <td className="p-3 border">
                  {shouldShowActions(req) && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-xs"
                        title="Approve"
                      >
                        <AiOutlineCheck size={14} /> Approve
                      </button>
                      <button
                        onClick={() => setSelectedRejectId(req.id)}
                        className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-xs"
                        title="Reject"
                      >
                        <AiOutlineClose size={14} /> Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length > rowsPerPage && (
          <div className="flex justify-end items-center mt-4 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {Math.ceil(filtered.length / rowsPerPage)}
            </span>
            <button
              onClick={() => 
                setCurrentPage(prev => 
                  Math.min(prev + 1, Math.ceil(filtered.length / rowsPerPage))
                )
              }
              disabled={currentPage === Math.ceil(filtered.length / rowsPerPage)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        <RemarkModal
          isOpen={selectedRejectId !== null}
          onClose={() => {
            setSelectedRejectId(null);
            setRemarkInput('');
          }}
          onSubmit={() => handleReject(selectedRejectId)}
          remark={remarkInput}
          setRemark={setRemarkInput}
          title="Enter Rejection Reason"
        />

        <ManagerClarificationModal
          isOpen={!!clarificationData}
          onClose={() => setClarificationData(null)}
          data={{
            ...clarificationData,
            // Include the rejection history
            rejectionHistory: clarificationData?.history?.find(h => 
              h.action.includes('rejected') && !h.action.includes('after-clarification')
            ),
            // Include the clarification history if exists
            clarificationHistory: clarificationData?.history?.find(h => 
              h.action.includes('clarification')
            )
          }}
          onApprove={() => handleApprove(clarificationData.id)}
          onReject={() => {
            setSelectedRejectId(clarificationData.id);
            setClarificationData(null);
          }}
        />
      </div>
    </div>
  );
};

export default ManagerReview;