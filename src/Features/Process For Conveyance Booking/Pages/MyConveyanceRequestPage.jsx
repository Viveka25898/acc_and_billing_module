/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ConveyanceTable from "../Components/ConveyanceTable";
import RejectReasonModal from "../Components/RejectionReasonModal";

export default function MyConveyanceRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filter, setFilter] = useState({
    client: "",
    status: "",
    date: ""
  });
  const [selectedRejectReason, setSelectedRejectReason] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  const loadRequests = () => {
    try {
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      const userRequests = allRequests
        .filter(request => request.submittedBy === currentUser.username)
        .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
        .slice(0, 5);
      
      console.log("Loaded user requests:", userRequests);
      setRequests(userRequests);
    } catch (error) {
      toast.error("Failed to load requests");
      console.error("Loading error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    
    // Add event listener for storage changes from other tabs
    window.addEventListener('storage', loadRequests);
    
    // Add custom event listener for same-tab updates
    window.addEventListener('conveyanceUpdated', loadRequests);
    
    return () => {
      window.removeEventListener('storage', loadRequests);
      window.removeEventListener('conveyanceUpdated', loadRequests);
    };
  }, [currentUser.username]);

  const filteredRequests = requests.filter((r) => (
    (filter.client === "" || r.client.toLowerCase().includes(filter.client.toLowerCase())) &&
    (filter.status === "" || r.status === filter.status) &&
    (filter.date === "" || r.date === filter.date)
  ));

  const getStatusStyle = (status) => {
    switch(status) {
      case "Pending Manager Approval":
        return "bg-yellow-100 text-yellow-800";
      case "Pending VP Approval":
        return "bg-blue-100 text-blue-800";
      case "Rejected by Line Manager":
      case "Rejected by VP":
      case "Rejected by AE":
        return "bg-red-100 text-red-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // FIXED: Improved handleViewReason function with better debugging and data retrieval
  const handleViewReason = (request) => {
    console.log("=== View Reason Debug Info ===");
    console.log("Full request object:", request);
    console.log("Request ID:", request.id);
    console.log("Request status:", request.status);
    console.log("rejectionReason field:", request.rejectionReason);
    console.log("rejections array:", request.rejections);
    console.log("================================");
    
    let rejectionReason = "No reason provided";
    
    try {
      // Strategy 1: Check top-level rejectionReason field
      if (request.rejectionReason && typeof request.rejectionReason === 'string' && request.rejectionReason.trim()) {
        rejectionReason = request.rejectionReason.trim();
        console.log("Found reason in rejectionReason field:", rejectionReason);
      }
      // Strategy 2: Check rejections array for the most recent rejection
      else if (request.rejections && Array.isArray(request.rejections) && request.rejections.length > 0) {
        // Get the most recent rejection
        const lastRejection = request.rejections[request.rejections.length - 1];
        console.log("Last rejection object:", lastRejection);
        
        if (lastRejection.reason && lastRejection.reason.trim()) {
          rejectionReason = lastRejection.reason.trim();
          console.log("Found reason in rejections array:", rejectionReason);
        } else {
          // Fallback: construct a message with available info
          const rejectedBy = lastRejection.user || lastRejection.rejectedBy || 'Unknown';
          const rejectedAt = lastRejection.date ? new Date(lastRejection.date).toLocaleDateString() : 'Unknown date';
          const level = lastRejection.level || 'unknown level';
          
          rejectionReason = `Request was rejected by ${rejectedBy} at ${level} level on ${rejectedAt}. No specific reason was provided.`;
          console.log("Constructed fallback reason:", rejectionReason);
        }
      }
      // Strategy 3: Check for other possible rejection reason fields
      else if (request.remarks && request.remarks.trim()) {
        rejectionReason = `Remarks: ${request.remarks.trim()}`;
        console.log("Found reason in remarks field:", rejectionReason);
      }
      // Strategy 4: Final fallback with basic rejection info
      else if (request.rejectedBy) {
        const rejectedAt = request.rejectedAt ? new Date(request.rejectedAt).toLocaleDateString() : 'Unknown date';
        rejectionReason = `Request was rejected by ${request.rejectedBy} on ${rejectedAt}. No specific reason was recorded.`;
        console.log("Final fallback reason:", rejectionReason);
      }
      
    } catch (error) {
      console.error("Error extracting rejection reason:", error);
      rejectionReason = "Error retrieving rejection reason. Please contact administrator.";
    }
    
    console.log("Final rejection reason to display:", rejectionReason);
    setSelectedRejectReason(rejectionReason);
  };

  const handleCloseModal = () => {
    console.log("Closing rejection reason modal");
    setSelectedRejectReason(null);
  };

  if (isLoading) {
    return <div className="p-4">Loading your requests...</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-600">My Recent Conveyance Requests (Last 5)</h2>

      <ConveyanceFilter filter={filter} setFilter={setFilter} />

      {filteredRequests.length > 0 ? (
        <div className="overflow-x-auto border border-gray-200 bg-white mt-4">
          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-left">Client</th>
                <th className="p-2 border text-left">Transport</th>
                <th className="p-2 border text-left">Distance</th>
                <th className="p-2 border text-left">Amount</th>
                <th className="p-2 border text-left">Status</th>
              </tr>
            </thead>  
            <tbody>
              {filteredRequests.map((request) => (
                <tr key={request.id}>
                  <td className="p-2 border">{request.date.split('T')[0]}</td>
                  <td className="p-2 border">{request.client}</td>
                  <td className="p-2 border">{request.transport}</td>
                  <td className="p-2 border">{request.distance} km</td>
                  <td className="p-2 border">₹{request.amount}</td>
                  <td className="p-2 border">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 border py-1 rounded-full font-medium ${getStatusStyle(request.status)}`}>
                        {request.status}
                      </span>
                      {(request.status.includes("Rejected") || request.status.includes("rejected")) && (
                        <button 
                          onClick={() => handleViewReason(request)}
                          className="ml-2 text-xs text-blue-500 hover:underline hover:text-blue-700 cursor-pointer transition-colors duration-200"
                          type="button"
                        >
                          View Reason
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No conveyance requests found.</p>
          {(filter.client || filter.status || filter.date) && (
            <button 
              className="text-blue-500 mt-2 hover:underline"
              onClick={() => setFilter({ client: "", status: "", date: "" })}
            >
              Clear filters
            </button>
          )}
        </div>
      )}

      {/* Modal for displaying rejection reason */}
      {selectedRejectReason && (
        <RejectReasonModal
          reason={selectedRejectReason}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}