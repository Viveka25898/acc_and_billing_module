import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ManagerConveyanceTable from "../Components/ManagerConveyanceTable";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import RejectionModal from "../Components/RejectionModal";

export default function VPOperationsConveyanceApprovalPage() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState({ 
    date: "", 
    status: "Pending VP Approval", 
    employee: "" 
  });
  const [rejection, setRejection] = useState({ 
    show: false, 
    claimId: null 
  });
  const [viewDocs, setViewDocs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Load only requests pending VP approval and assigned to current VP
  useEffect(() => {
  try {
    const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
    const vpRequests = allRequests.filter(
      request => request.status === "Pending VP Approval" && 
                request.assignedTo === currentUser.username
    );
    setClaims(vpRequests);
  } catch (error) {
    toast.error("Failed to load requests");
    console.error("Loading error:", error);
  }
}, [currentUser.username]);

  // Filter claims based on filters
  const filteredClaims = claims.filter((claim) => {
    const employeeMatch = filter.employee === '' || 
      claim.employeeName?.toLowerCase().includes(filter.employee.toLowerCase());
    const dateMatch = filter.date === '' || 
      claim.date.split('T')[0] === filter.date;
    return employeeMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / itemsPerPage));
  const paginatedClaims = filteredClaims.slice(
    Math.max(0, (currentPage - 1) * itemsPerPage),
    Math.min(filteredClaims.length, currentPage * itemsPerPage)
  );

  // VP Approves the request
  const handleApprove = (id) => {
    try {
      const updatedRequests = JSON.parse(localStorage.getItem("conveyanceRequests")).map(
        request => request.id === id ? {
          ...request,
          status: "Pending AE Approval",
          assignedTo: "ae1", // Assign to Account Executive
          vpApprovedAt: new Date().toISOString(),
          vpApprovedBy: currentUser.username,
          currentLevel: "ae",
          approvers: [...(request.approvers || []), {
            level: "vp",
            user: currentUser.username,
            action: "approved",
            date: new Date().toISOString()
          }]
        } : request
      );
      
      localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('conveyanceUpdated'));
      
      setClaims(prev => prev.filter(c => c.id !== id));
      toast.success("Request approved and sent to Account Executive");
    } catch (error) {
      toast.error("Approval failed");
      console.error(error);
    }
  };

  // VP Rejects the request
  const handleReject = (id, reason) => {
  try {
    const updatedRequests = JSON.parse(localStorage.getItem("conveyanceRequests")).map(
      request => request.id === id ? {
        ...request,
        status: "Rejected by VP",
        assignedTo: request.submittedBy,
        rejectedAt: new Date().toISOString(),
        rejectedBy: currentUser.username,
        rejectionReason: reason,
        currentLevel: "rejected",
        rejections: [...(request.rejections || []), {
          level: "vp",
          user: currentUser.username,
          reason: reason,
          date: new Date().toISOString()
        }]
      } : request
    );
    
    localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
    
    // Manually trigger state update
    setClaims(prev => prev.filter(c => c.id !== id));
    
    // Dispatch storage event to sync across tabs
    window.dispatchEvent(new Event('storage'));
    
    toast.warning("Request rejected and returned to employee");
  } catch (error) {
    toast.error("Rejection failed");
    console.error(error);
  }
};

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-green-600">
          VP Conveyance Approvals ({filteredClaims.length})
        </h2>
        <button
          onClick={() => navigate("/dashboard/vp-operations/conveyance-form")}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-fit"
        >
          Conveyance Form
        </button>
      </div>

      <ConveyanceFilter 
        filter={filter} 
        setFilter={setFilter}
        showEmployeeFilter={true}
      />

      <ManagerConveyanceTable
        claims={paginatedClaims}
        onApprove={handleApprove}
        onReject={(id) => setRejection({ show: true, claimId: id })}
        onViewDocs={(docs) => setViewDocs(docs)}
        currentUserRole="vp-operations"
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
        documents={viewDocs}
        onClose={() => setViewDocs(null)}
      />
    </div>
  );
}