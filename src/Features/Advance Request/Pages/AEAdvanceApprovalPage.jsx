import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AEFilter from '../Components/AEFilter';
import AERequestTable from '../Components/AERequestTable';

export default function AEAdvanceApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ name: '', empId: '', date: '' });

  useEffect(() => {
    // Load requests from localStorage instead of dummy data
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    // Filter only requests that need AE approval
    const aeRequests = allRequests.filter(
      req => req.status === 'Pending AE Approval' || 
             (req.status === 'Rejected by AE' && req.clarification) ||
             (req.status === 'Approved' && req.currentLevel === 'account-executive')
    );
    setRequests(aeRequests);
  }, []);

  const handleApprove = (submittedAt) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    const approvalTime = new Date();
    const isBeforeDeadline = approvalTime.getHours() < 15 || 
                           (approvalTime.getHours() === 15 && approvalTime.getMinutes() <= 59);

    // Find the specific request to approve
    const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
    if (requestIndex === -1) {
      toast.error('Request not found');
      return;
    }

    // Create a new array with only the specific request updated
    const updatedRequests = [...allRequests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status: 'Approved',
      approvedAt: approvalTime.toISOString(),
      aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
      approvedBeforeDeadline: isBeforeDeadline
    };

    localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
    
    // Update local state with filtered requests
    const filteredRequests = updatedRequests.filter(
      req => req.status === 'Pending AE Approval' || 
             (req.status === 'Rejected by AE' && req.clarification) ||
             (req.status === 'Approved' && req.currentLevel === 'account-executive')
    );
    
    setRequests(filteredRequests);
    toast.success(`Request Approved${isBeforeDeadline ? ' and processed' : ''}`);
  };

  const handleReject = (submittedAt, reason) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    
    // Find the specific request to reject
    const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
    if (requestIndex === -1) {
      toast.error('Request not found');
      return;
    }

    // Create a new array with only the specific request updated
    const updatedRequests = [...allRequests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status: 'Rejected by AE',
      remarks: reason,
      rejectedAt: new Date().toISOString(),
      aeRejectedBy: JSON.parse(localStorage.getItem('user')).username
    };

    localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
    
    // Update local state with filtered requests
    const filteredRequests = updatedRequests.filter(
      req => req.status === 'Pending AE Approval' || 
             (req.status === 'Rejected by AE' && req.clarification) ||
             (req.status === 'Approved' && req.currentLevel === 'account-executive')
    );
    
    setRequests(filteredRequests);
    toast.error('Request Rejected');
  };

  const filteredRequests = requests.filter(r =>
    r.employeeName.toLowerCase().includes(filter.name.toLowerCase()) &&
    r.employeeId.toLowerCase().includes(filter.empId.toLowerCase()) &&
    (filter.date === '' || r.requestDate.includes(filter.date))
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">AE Dashboard - Advance Requests</h1>
      <AEFilter filter={filter} setFilter={setFilter} />
      <AERequestTable 
        data={filteredRequests} 
        onApprove={handleApprove} 
        onReject={handleReject} 
      />
    </div>
  );
}