import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AEFilter from '../Components/AEFilter';
import AERequestTable from '../Components/AERequestTable';

export default function AEAdvanceApprovalPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({ name: '', empId: '', date: '', requestId: '' });

useEffect(() => {
  // Load requests from localStorage
  const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
  console.log("All requests from localStorage:", allRequests);
  
  // Show ALL requests to AE for visibility, not just pending ones
  // This allows AE to see and download approved requests too
  const aeRequests = allRequests.filter(req => 
    req.status === 'Pending AE Approval' || 
    req.status === 'Approved' ||
    req.status === 'Rejected by AE'
  );
  
  console.log("Filtered AE requests:", aeRequests);
  setRequests(aeRequests);
}, []);

  const handleApprove = (submittedAt) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    const approvalTime = new Date();
    
    // Fixed: Changed from 18:59 to 15:59 for AE deadline
    const isBeforeDeadline = approvalTime.getHours() < 15 || 
                           (approvalTime.getHours() === 15 && approvalTime.getMinutes() <= 59);

    // Find the specific request to approve
    const requestIndex = allRequests.findIndex(req => req.submittedAt === submittedAt);
    
    if (requestIndex === -1) {
      toast.error('Request not found');
      return;
    }

    const request = allRequests[requestIndex];

    // Additional check: If it's a VP request, ensure VP approved before deadline
    if (request.isVPRequest && !request.vpApprovedBeforeDeadline) {
      toast.error('Cannot approve: VP request was approved after 15:59 deadline');
      return;
    }

    // Create a new array with only the specific request updated
    const updatedRequests = [...allRequests];
    updatedRequests[requestIndex] = {
      ...updatedRequests[requestIndex],
      status: 'Approved',
      approvedAt: approvalTime.toISOString(),
      aeApprovedBy: JSON.parse(localStorage.getItem('user')).username,
      aeApprovedBeforeDeadline: isBeforeDeadline
    };

    localStorage.setItem('advanceRequests', JSON.stringify(updatedRequests));
    
    // Update local state with filtered requests
    const filteredRequests = updatedRequests.filter(req => 
  req.status === 'Pending AE Approval' || 
  req.status === 'Approved' ||
  req.status === 'Rejected by AE'
);
    
    setRequests(filteredRequests);
    
    // Better toast messages
    if (isBeforeDeadline) {
      toast.success('Request Approved - Eligible for same-day processing');
    } else {
      toast.warning('Request Approved - Will be processed next working day (approved after 15:59)');
    }
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

  // New function to handle download completion and remove approved requests
  const handleDownloadComplete = (downloadedRequestIds) => {
    const allRequests = JSON.parse(localStorage.getItem('advanceRequests')) || [];
    
    // Remove downloaded requests from localStorage
    const remainingRequests = allRequests.filter(req => 
      !downloadedRequestIds.includes(req.submittedAt)
    );
    
    localStorage.setItem('advanceRequests', JSON.stringify(remainingRequests));
    
    // Update local state - filter for AE view
    const filteredRequests = remainingRequests.filter(req => 
      req.status === 'Pending AE Approval' || 
      req.status === 'Approved' ||
      req.status === 'Rejected by AE'
    );
    
    setRequests(filteredRequests);
    
    toast.success(`${downloadedRequestIds.length} approved requests downloaded and removed from table`);
  };

  const filteredRequests = requests.filter(r =>
    r.employeeName.toLowerCase().includes(filter.name.toLowerCase()) &&
    r.employeeId.toLowerCase().includes(filter.empId.toLowerCase()) &&
    (filter.date === '' || r.requestDate.includes(filter.date)) &&
    (filter.requestId === '' || (r.requestId && r.requestId.toLowerCase().includes(filter.requestId.toLowerCase())))
  );

  // Helper function to check current time status
  const getCurrentTimeStatus = () => {
    const now = new Date();
    const isBeforeDeadline = now.getHours() < 15 || (now.getHours() === 15 && now.getMinutes() <= 59);
    return isBeforeDeadline;
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">AE Dashboard - Advance Requests</h1>
        <div className={`text-sm px-3 py-1 rounded ${
          getCurrentTimeStatus() 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {getCurrentTimeStatus() 
            ? '🟢 Before 15:59 - Same day processing' 
            : '🔴 After 15:59 - Next day processing only'
          }
        </div>
      </div>
      
      <AEFilter filter={filter} setFilter={setFilter} />
      <AERequestTable 
        data={filteredRequests} 
        onApprove={handleApprove} 
        onReject={handleReject}
        onDownloadComplete={handleDownloadComplete}
      />
    </div>
  );
}