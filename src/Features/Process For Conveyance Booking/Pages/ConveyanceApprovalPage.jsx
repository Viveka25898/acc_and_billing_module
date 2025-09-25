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
  const [viewReports, setViewReports] = useState(null);
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
      const assignedVP = lineManager?.reportsTo;

      const updatedRequests = allRequests.map(request => 
        request.id === id ? {
          ...request,
          status: "Pending VP Approval",
          assignedTo: assignedVP,
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

  // FIXED: handleReject function with proper rejection reason storage
  const handleReject = (id, reason) => {
    try {
      console.log("Rejecting request ID:", id, "with reason:", reason);
      
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      const updatedRequests = allRequests.map(request => {
        if (request.id === id) {
          // Create rejection entry with all necessary information
          const rejectionEntry = {
            level: "line-manager",
            user: currentUser.username,
            reason: reason.trim(), // Store the actual reason
            date: new Date().toISOString(),
            rejectedBy: currentUser.username
          };

          console.log("Creating rejection entry:", rejectionEntry);

          return {
            ...request,
            status: "Rejected by Line Manager",
            rejectedAt: new Date().toISOString(),
            rejectedBy: currentUser.username,
            rejectionReason: reason.trim(), // Store reason at top level too
            currentLevel: "rejected",
            // Add to rejections array and ensure it's properly structured
            rejections: [...(request.rejections || []), rejectionEntry]
          };
        }
        return request;
      });
      
      console.log("Updated requests after rejection:", updatedRequests.find(r => r.id === id));
      
      localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('conveyanceUpdated'));
      
      // Update local state
      setClaims(prev => prev.map(c => 
        c.id === id ? { 
          ...c, 
          status: "Rejected by Line Manager", 
          rejectionReason: reason.trim(),
          rejections: [...(c.rejections || []), {
            level: "line-manager",
            user: currentUser.username,
            reason: reason.trim(),
            date: new Date().toISOString()
          }]
        } : c
      ));
      
      toast.warning("Request rejected");
    } catch (error) {
      toast.error("Rejection failed");
      console.error("Rejection error:", error);
    }
  };

  // Helper function to convert file objects to URLs for viewing
  const prepareDocumentUrl = (documents) => {
    if (!documents || documents.length === 0) return null;
    
    const firstDoc = documents[0];
    if (typeof firstDoc === 'string') {
      return firstDoc;
    }
    
    if (firstDoc.type && firstDoc.size) {
      return URL.createObjectURL(new Blob([''], { type: firstDoc.type }));
    }
    
    return null;
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
        onViewReports={(reports) => setViewReports(reports)}
        currentUserRole={currentUser.role}
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

      {/* FIXED: RejectionModal with proper parameter passing */}
      <RejectionModal
        isOpen={rejection.show}
        onClose={() => setRejection({ show: false, claimId: null })}
        onSubmit={(reason) => handleReject(rejection.claimId, reason)}
        claimId={rejection.claimId}
      />

      {/* Modal for receipts */}
      <DocumentPreviewModal 
        url={viewDocs?.[0] ? prepareDocumentUrl(viewDocs) : null}
        onClose={() => setViewDocs(null)}
        title="Receipt"
      />

      {/* Modal for visit reports */}
      <DocumentPreviewModal 
        url={viewReports?.[0] ? prepareDocumentUrl(viewReports) : null}
        onClose={() => setViewReports(null)}
        title="Visit Report"
      />
    </div>
  );
}