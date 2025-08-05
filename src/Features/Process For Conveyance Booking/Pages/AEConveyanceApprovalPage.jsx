import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import Table from "../Components/Table";
import RejectionModal from "../Components/RejectionModal";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import ConveyanceVoucherPreviewModal from "../Components/ConveyanceVoucherPreviewModal";

export default function AEConveyanceApprovalPage() {
  const [claims, setClaims] = useState([]);
  const [filter, setFilter] = useState({ 
    status: "Pending AE Approval", 
    client: "", 
    date: "" 
  });
  const [rejection, setRejection] = useState({ 
    show: false, 
    claimId: null 
  });
  const [viewDocs, setViewDocs] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showVoucher, setShowVoucher] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [generatedVoucherIds, setGeneratedVoucherIds] = useState([]);
  const itemsPerPage = 5;
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};

  // Load only requests pending AE approval
  useEffect(() => {
    try {
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      const aeRequests = allRequests.filter(
        request => request.status === "Pending AE Approval"
      );
      setClaims(aeRequests);
    } catch (error) {
      toast.error("Failed to load requests");
      console.error("Loading error:", error);
    }
  }, []);

  // Filter claims based on filters
  const filteredClaims = claims.filter((claim) => {
    const clientMatch = filter.client === '' || 
      claim.client?.toLowerCase().includes(filter.client.toLowerCase());
    const dateMatch = filter.date === '' || 
      claim.date.split('T')[0] === filter.date;
    return clientMatch && dateMatch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / itemsPerPage));
  const paginatedClaims = filteredClaims.slice(
    Math.max(0, (currentPage - 1) * itemsPerPage),
    Math.min(filteredClaims.length, currentPage * itemsPerPage)
  );

  // AE Approves the request (final approval)
  const handleApprove = (id) => {
    try {
      const updatedRequests = JSON.parse(localStorage.getItem("conveyanceRequests")).map(
        request => request.id === id ? {
          ...request,
          status: "Approved",
          aeApprovedAt: new Date().toISOString(),
          aeApprovedBy: currentUser.username,
          currentLevel: "completed",
          approvers: [...(request.approvers || []), {
            level: "account-executive",
            user: currentUser.username,
            action: "approved",
            date: new Date().toISOString()
          }]
        } : request
      );
      
      localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
      setClaims(prev => prev.filter(c => c.id !== id));
      toast.success("Request approved");
    } catch (error) {
      toast.error("Approval failed");
      console.error(error);
    }
  };

  // AE Rejects the request
  // AE Rejects the request - Updated version
const handleReject = (id, reason) => {
  try {
    const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
    
    const updatedRequests = allRequests.map(request => {
      if (request.id === id) {
        const rejectionEntry = {
          level: "account-executive",
          user: currentUser.username,
          reason: reason,  // Ensure this stores the text reason
          date: new Date().toISOString()
        };

        return {
          ...request,
          status: "Rejected by AE",
          assignedTo: request.submittedBy,
          rejectedAt: new Date().toISOString(),
          rejectedBy: currentUser.username,
          rejectionReason: reason,  // Store text reason here
          currentLevel: "rejected",
          rejections: [
            ...(request.rejections || []),
            rejectionEntry
          ]
        };
      }
      return request;
    });

    localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
    
    // Refresh the view
    const refreshedRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
    setClaims(refreshedRequests.filter(req => req.status === "Pending AE Approval"));
    
    toast.success("Request rejected successfully");
  } catch (error) {
    toast.error(`Rejection failed: ${error.message}`);
    console.error("Rejection error:", error);
  }
};
  // Generate voucher for approved requests
  const handleGenerateVoucher = (claim) => {
    const voucher = {
      voucherNo: `EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      employee: claim.employeeName,
      purpose: claim.purpose,
      amount: claim.amount,
      approvedBy: currentUser.username,
      claimId: claim.id
    };

    // Save voucher to localStorage
    const existingVouchers = JSON.parse(localStorage.getItem("conveyanceVouchers")) || [];
    localStorage.setItem(
      "conveyanceVouchers", 
      JSON.stringify([...existingVouchers, voucher])
    );

    setSelectedVoucher(voucher);
    setShowVoucher(true);
    setGeneratedVoucherIds(prev => [...prev, claim.id]);
    toast.success("Voucher generated successfully");
  };

  const columns = [
    { label: "Employee", key: "employeeName" },
    { label: "Date", key: "date" },
    { label: "Client", key: "client" },
    { label: "Purpose", key: "purpose" },
    { label: "Amount", key: "amount", render: (row) => `₹${row.amount}` },
    {
      label: "Receipt",
      render: (row) => (
        row.receipts?.length > 0 ? (
          <button
            className="text-blue-600 hover:text-blue-800 text-lg"
            onClick={() => setViewDocs(row.receipts)}
          >
            <FaEye />
          </button>
        ) : (
          <span className="text-gray-400">--</span>
        )
      )
    },
    {
      label: "Status",
      render: (row) => (
        <span className={`text-xs px-2 border py-1 rounded-full font-medium ${
          row.status === "Approved" ? "bg-green-100 text-green-700" :
          row.status === "Rejected by AE" ? "bg-red-100 text-red-700" :
          "bg-blue-100 text-blue-700"
        }`}>
          {row.status}
        </span>
      )
    },
    {
      label: "Actions",
      render: (row) => {
        if (row.status === "Approved") {
          const isGenerated = generatedVoucherIds.includes(row.id);
          return (
            <button
              disabled={isGenerated}
              className={`text-sm px-2 py-1 rounded ${
                isGenerated
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-green-700 text-white hover:bg-green-800"
              }`}
              onClick={() => !isGenerated && handleGenerateVoucher(row)}
            >
              {isGenerated ? "Voucher Created" : "Generate Voucher"}
            </button>
          );
        }
        
        if (row.status === "Rejected by AE") {
          return <span className="text-red-600">Rejected</span>;
        }

        return (
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => handleApprove(row.id)}
            >
              Approve
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded text-sm"
              onClick={() => setRejection({ show: true, claimId: row.id })}
            >
              Reject
            </button>
          </div>
        );
      }
    }
  ];

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-green-600">
          AE Conveyance Approvals ({filteredClaims.length})
        </h2>
      </div>

      <ConveyanceFilter 
        filter={filter} 
        setFilter={setFilter}
        showClientFilter={true}
      />

      <Table columns={columns} data={paginatedClaims} />

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
          claimId={rejection.claimId}
        />


      <DocumentPreviewModal 
        documents={viewDocs}
        onClose={() => setViewDocs(null)}
      />

      {showVoucher && (
        <ConveyanceVoucherPreviewModal
          voucher={selectedVoucher}
          onClose={() => setShowVoucher(false)}
        />
      )}
    </div>
  );
}