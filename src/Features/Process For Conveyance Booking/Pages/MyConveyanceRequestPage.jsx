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
        .slice(0, 5); // Get only the last 5 requests
      
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
        return "bg-red-100 text-red-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewReason = (request) => {
    console.log("Button clicked!"); // Debug log
    console.log("Request object:", request); // Debug log
    console.log("rejectionReason field:", request.rejectionReason); // Debug log
    console.log("rejections array:", request.rejections); // Debug log
    
    let rejectionReason = "No reason provided";
    
    // Handle different rejection reason structures
    if (typeof request.rejectionReason === 'string' && request.rejectionReason.trim()) {
      rejectionReason = request.rejectionReason.trim();
    } else if (request.rejectionReason && typeof request.rejectionReason === 'object' && request.rejectionReason.reason) {
      rejectionReason = request.rejectionReason.reason;
    } else if (request.rejections && Array.isArray(request.rejections) && request.rejections.length > 0) {
      const lastRejection = request.rejections[request.rejections.length - 1];
      console.log("Last rejection object:", lastRejection); // Debug log
      
      // Check all possible fields where reason might be stored
      rejectionReason = lastRejection.reason || 
                       lastRejection.rejectionReason || 
                       lastRejection.comment || 
                       lastRejection.remarks ||
                       request.remarks || // Check if reason is in main request remarks
                       `Rejected by ${lastRejection.user} at ${lastRejection.level} level on ${new Date(lastRejection.date).toLocaleDateString()}`;
    } else if (request.rejectedBy) {
      // Fallback - show who rejected it and when
      rejectionReason = `Rejected by ${request.rejectedBy} on ${new Date(request.rejectedAt).toLocaleDateString()}`;
    }
    
    console.log("Final rejectionReason to set:", rejectionReason); // Debug log
    setSelectedRejectReason(rejectionReason);
  };

  const handleCloseModal = () => {
    console.log("Closing modal"); // Debug log
    setSelectedRejectReason(null);
  };

  if (isLoading) {
    return <div className="p-4">Loading your requests...</div>;
  }

  console.log("selectedRejectReason state:", selectedRejectReason); // Debug log

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
                      {request.status.includes("Rejected") && (
                        <button 
                          onClick={() => handleViewReason(request)}
                          className="ml-2 text-xs text-blue-500 hover:underline hover:text-blue-700 cursor-pointer"
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

      {/* Modal - this will show when selectedRejectReason is truthy */}
      {selectedRejectReason && (
        <RejectReasonModal
          reason={selectedRejectReason}
          onClose={handleCloseModal}
        />
      )}
      
      {/* Debug - temporarily uncomment this to test if modal component works */}
      {/* 
      <RejectReasonModal
        reason="Test reason - modal is working!"
        onClose={() => console.log("Test modal closed")}
      />
      */}
    </div>
  );
}