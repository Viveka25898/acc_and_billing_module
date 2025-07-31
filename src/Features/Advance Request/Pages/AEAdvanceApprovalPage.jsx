import React, { useState } from 'react';

import {  toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dummyData from '../data/dummyData';
import AEFilter from '../Components/AEFilter';
import AERequestTable from '../Components/AERequestTable';


export default function AEAdvanceApprovalPage() {
  const [requests, setRequests] = useState(dummyData);
  const [filter, setFilter] = useState({ name: '', empId: '', date: '' });

 const handleApprove = (id) => {
  toast.success('Advance Request Approved and Payment entry is Passed.');
  setRequests(prev =>
  prev.map(r =>
    r.id === id
      ? { ...r, status: 'Approved', approvedAt: new Date().toISOString() }
      : r
  )
);

};


  const handleReject = (id, reason) => {
    toast.error('Advance Request Rejected');
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Rejected', rejectReason: reason } : r));
  };

  const filteredRequests = requests.filter(r =>
    r.employeeName.toLowerCase().includes(filter.name.toLowerCase()) &&
    r.employeeId.toLowerCase().includes(filter.empId.toLowerCase()) &&
    r.date.includes(filter.date)
  );

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">AE Dashboard - Advance Requests</h1>
      <AEFilter filter={filter} setFilter={setFilter} />
      <AERequestTable data={filteredRequests} onApprove={handleApprove} onReject={handleReject} />
    </div>
  );
}