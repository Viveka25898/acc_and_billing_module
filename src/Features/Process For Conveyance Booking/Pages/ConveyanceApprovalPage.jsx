/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ManagerConveyanceTable from "../Components/ManagerConveyanceTable";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import RejectionModal from "../Components/RejectionModal";

export default function ManagerConveyanceApprovalsPage() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState({ 
    date: "", 
    status: "Pending", 
    employee: "",
    transport: "" 
  });
  const [rejection, setRejection] = useState({ show: false, claimId: null });
  const [viewDocs, setViewDocs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Load claims with proper error handling
  useEffect(() => {
    try {
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      const managerRequests = allRequests.filter(
        request => request.assignedTo === currentUser.username && 
                  (request.status === "Pending Manager Approval" ||
                   request.status === "Pending VP Approval" ||
                   request.status === "Rejected by Line Manager")
      );
      setClaims(managerRequests);
    } catch (error) {
      toast.error("Failed to load requests");
      console.error("Loading error:", error);
    }
  }, [currentUser.username]);

  // Enhanced filtering
  const filteredClaims = claims.filter((claim) => {
    const employeeMatch = filter.employee === '' || 
      claim.employeeName?.toLowerCase().includes(filter.employee.toLowerCase());
    
    const statusMatch = filter.status === 'Pending' 
      ? claim.status === 'Pending Manager Approval'
      : filter.status === 'Approved'
      ? claim.status === 'Pending VP Approval'
      : filter.status === 'Rejected'
      ? claim.status === 'Rejected by Line Manager'
      : filter.status === '' || claim.status === filter.status;
    
    const dateMatch = filter.date === '' || 
      claim.date.split('T')[0] === filter.date;
    
    const transportMatch = filter.transport === '' || 
      claim.transport === filter.transport;

    return employeeMatch && statusMatch && dateMatch && transportMatch;
  });

  // Pagination with boundary checks
  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / itemsPerPage));
  const paginatedClaims = filteredClaims.slice(
    Math.max(0, (currentPage - 1) * itemsPerPage),
    Math.min(filteredClaims.length, currentPage * itemsPerPage)
  );

  const handleApprove = (id) => {
  try {
    const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
    const requestToApprove = allRequests.find(request => request.id === id);
    
    // Get the VP this Line Manager reports to
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const lineManager = users.find(user => user.username === currentUser.username);
    const assignedVP = lineManager?.reportsTo; // This will be "vp1" or "vp2"

    const updatedRequests = allRequests.map(request => 
      request.id === id ? {
        ...request,
        status: "Pending VP Approval",
        assignedTo: assignedVP, // Assign to the VP
        currentLevel: "vp",
        approvedAt: new Date().toISOString(),
        approvedBy: currentUser.username,
        approvers: [...(request.approvers || []), {
          level: "line-manager",
          user: currentUser.username,
          action: "approved",
          date: new Date().toISOString()
        }]
      } : request
    );
    
    localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
    setClaims(prev => prev.filter(c => c.id !== id));
    toast.success(`Sent to VP ${assignedVP} for approval`);
  } catch (error) {
    toast.error("Approval failed");
    console.error(error);
  }
};

  const handleReject = (id, reason) => {
    try {
      const updatedRequests = JSON.parse(localStorage.getItem("conveyanceRequests")).map(
        request => request.id === id ? {
          ...request,
          status: "Rejected by Line Manager",
          rejectedAt: new Date().toISOString(),
          rejectedBy: currentUser.username,
          rejectionReason: reason,
          currentLevel: "rejected",
          rejections: [...(request.rejections || []), {
            level: "line-manager",
            user: currentUser.username,
            reason: reason,
            date: new Date().toISOString()
          }]
        } : request
      );
      
      localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('conveyanceUpdated'));
      
      // Update local state instead of removing
      setClaims(prev => prev.map(c => 
        c.id === id ? { ...c, status: "Rejected by Line Manager", rejectionReason: reason } : c
      ));
      
      toast.warning("Request rejected");
    } catch (error) {
      toast.error("Rejection failed");
      console.error(error);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">
          Conveyance Approvals ({filteredClaims.length})
        </h2>
      </div>

      <ConveyanceFilter 
        filter={filter} 
        setFilter={setFilter} 
        showEmployeeFilter={true}
        showTransportFilter={true}
      />

      <ManagerConveyanceTable
  claims={paginatedClaims}
  onApprove={handleApprove}
  onReject={(id) => setRejection({ show: true, claimId: id })}
  onViewDocs={(docs) => setViewDocs(docs)}
  currentUserRole={currentUser.role} // Add this line
/>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      <RejectionModal
        isOpen={rejection.show}
        onClose={() => setRejection({ show: false, claimId: null })}
        onSubmit={(reason) => handleReject(rejection.claimId, reason)}
      />

     <DocumentPreviewModal 
      url={viewDocs?.[0] || null} // Explicitly pass null if no document
      onClose={() => setViewDocs(null)}
    />
    </div>
  );
}