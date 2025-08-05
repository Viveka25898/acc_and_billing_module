import React from "react";
import { FaEye } from "react-icons/fa";

export default function ManagerConveyanceTable({ 
  claims, 
  onApprove, 
  onReject, 
  onViewDocs,
  currentUserRole // Add this prop to determine user role
}) {
  // Sort claims based on status priority
  const sortedClaims = [...claims].sort((a, b) => {
    const statusOrder = {
      "Pending Manager Approval": 1,
      "Pending VP Approval": 2,
      "Rejected by Line Manager": 3,
      "Rejected by VP": 4,
      "Approved": 5
    };
    return (statusOrder[a.status] || 6) - (statusOrder[b.status] || 6);
  });

  // Determine which statuses should show action buttons based on user role
  const shouldShowActions = (status) => {
    if (currentUserRole === "line-manager") {
      return status === "Pending Manager Approval";
    } else if (currentUserRole === "vp-operations") {
      return status === "Pending VP Approval";
    }
    return false;
  };

  // Get appropriate status display text
  const getStatusDisplay = (status) => {
    if (status === "Pending VP Approval") return "Pending VP Approval";
    if (status === "Rejected by Line Manager") return "Rejected by Manager";
    if (status === "Rejected by VP") return "Rejected by VP";
    return status;
  };

  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="w-full text-sm border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border text-left">Employee</th>
            <th className="p-2 border text-left">Date</th>
            <th className="p-2 border text-left">Client</th>
            <th className="p-2 border text-left">Transport</th>
            <th className="p-2 border text-left">Distance</th>
            <th className="p-2 border text-left">Amount</th>
            <th className="p-2 border text-left">Status</th>
            <th className="p-2 border text-left">Receipt</th>
            <th className="p-2 border text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedClaims.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center p-4 text-gray-500">
                No requests found.
              </td>
            </tr>
          ) : (
            sortedClaims.map((claim) => (
              <tr key={claim.id}>
                <td className="p-2 border">{claim.employeeName}</td>
                <td className="p-2 border">{claim.date.split('T')[0]}</td>
                <td className="p-2 border">{claim.client}</td>
                <td className="p-2 border">{claim.transport}</td>
                <td className="p-2 border">{claim.distance} km</td>
                <td className="p-2 border">₹{claim.amount}</td>
                <td className="p-2 border">
                  <span className={`text-xs px-2 border py-1 rounded-full font-medium ${
                    claim.status === "Pending VP Approval" 
                      ? "bg-blue-100 text-blue-700"
                      : claim.status === "Rejected by Line Manager" || claim.status === "Rejected by VP"
                      ? "bg-red-100 text-red-700"
                      : claim.status === "Pending Manager Approval"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {getStatusDisplay(claim.status)}
                  </span>
                </td>
                <td className="p-2 border">
                  {claim.transport !== "Bike" && claim.receipts?.length > 0 ? (
                    <button
                      title="View Receipt"
                      onClick={() => {
                        const validReceipts = claim.receipts.filter(r => r);
                        if (validReceipts.length > 0) {
                          onViewDocs(validReceipts);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-800 text-lg"
                    >
                      <FaEye />
                    </button>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="p-2 border">
                  {shouldShowActions(claim.status) ? (
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Approve clicked for:', claim.id);
                          onApprove(claim.id);
                        }}
                        className="text-white bg-green-600 px-2 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Reject clicked for:', claim.id);
                          onReject(claim.id);
                        }}
                        className="text-white bg-red-600 px-2 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-500 italic">
                      {claim.status === "Pending VP Approval" ? "Approved by Manager" : 
                      claim.status === "Rejected by Line Manager" ? "Rejected by Manager" :
                      claim.status === "Rejected by VP" ? "Rejected by VP" : 
                      "No Action"}
                    </span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}