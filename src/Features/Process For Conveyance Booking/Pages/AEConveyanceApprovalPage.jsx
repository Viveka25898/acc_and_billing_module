import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaEye } from "react-icons/fa";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import Table from "../Components/Table";
import RejectionModal from "../Components/RejectionModal";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import ConveyanceExpenseVoucher from "../Components/ConveyanceExpenseVoucher";

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
  const [viewReports, setViewReports] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showVoucher, setShowVoucher] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
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

  // Helper function to convert file objects to URLs for viewing
  const prepareDocumentUrl = (documents) => {
    if (!documents || documents.length === 0) return null;
    
    const firstDoc = documents[0];
    if (typeof firstDoc === 'string') {
      return firstDoc; // If it's already a URL
    }
    
    // If it's a file object, create a blob URL
    if (firstDoc.type && firstDoc.size) {
      // For demonstration purposes - in real app you'd have the actual file content
      // This assumes you have the file data stored somewhere
      return URL.createObjectURL(new Blob([''], { type: firstDoc.type }));
    }
    
    return null;
  };

  // AE Approves the request (final approval) and generates voucher
  const handleApprove = (id) => {
    try {
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      const claimToApprove = allRequests.find(request => request.id === id);
      
      if (!claimToApprove) {
        toast.error("Request not found");
        return;
      }

      // Create voucher data
      const voucherData = {
        header: {
          company: "ISmart",
          voucherNo: `EV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          financialYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
          date: new Date().toISOString().split('T')[0],
          reference: `Conveyance Reimbursement - ${claimToApprove.employeeName}`,
          preparedBy: currentUser.username,
          expenseType: "Conveyance Expense",
          department: claimToApprove.department || "Not specified",
          approvalChain: "Manager → VP → Billing Executive"
        },
        employeeDetails: {
          employeeId: claimToApprove.employeeId || "N/A",
          employeeName: claimToApprove.employeeName,
          designation: claimToApprove.designation || "N/A",
          department: claimToApprove.department || "N/A",
          manager: claimToApprove.manager || "N/A",
          submissionDate: claimToApprove.submittedAt ? new Date(claimToApprove.submittedAt).toISOString().split('T')[0] : "N/A",
          approvalDate: new Date().toISOString().split('T')[0]
        },
        conveyanceDetails: [
          {
            id: 1,
            date: claimToApprove.date.split('T')[0],
            clientName: claimToApprove.client,
            fromLocation: claimToApprove.fromLocation || "Office",
            toLocation: claimToApprove.toLocation || "Client Location",
            purpose: claimToApprove.purpose,
            modeOfTransport: claimToApprove.transport || "Not specified",
            distance: claimToApprove.distance || "N/A",
            amount: claimToApprove.amount,
            billAttached: claimToApprove.receipts?.length > 0 ? "Yes" : "No"
          }
        ],
        approvals: {
          preparer: currentUser.username,
          reviewer: claimToApprove.approvers?.find(a => a.level === "manager")?.user || "Manager",
          approver: "VP Operations",
          date: new Date().toISOString().split('T')[0]
        }
      };

      // Update the request status
      const updatedRequests = allRequests.map(request => 
        request.id === id ? {
          ...request,
          status: "Approved",
          aeApprovedAt: new Date().toISOString(),
          aeApprovedBy: currentUser.username,
          currentLevel: "completed",
          voucherNumber: voucherData.header.voucherNo,
          approvers: [...(request.approvers || []), {
            level: "account-executive",
            user: currentUser.username,
            action: "approved",
            date: new Date().toISOString()
          }]
        } : request
      );
      
      localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
      
      // Save voucher to localStorage
      const existingVouchers = JSON.parse(localStorage.getItem("conveyanceVouchers")) || [];
      localStorage.setItem(
        "conveyanceVouchers", 
        JSON.stringify([...existingVouchers, {
          ...voucherData,
          claimId: id
        }])
      );

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('conveyanceUpdated'));

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('conveyanceUpdated'));

      // Set the voucher data to display
      setSelectedVoucher(voucherData);
      setShowVoucher(true);
      setClaims(prev => prev.filter(c => c.id !== id));
      
      toast.success("Request approved and voucher generated");
    } catch (error) {
      toast.error("Approval failed");
      console.error(error);
    }
  };

  // FIXED: AE Rejects the request with proper rejection reason storage
  const handleReject = (id, reason) => {
    try {
      console.log("AE Rejecting request ID:", id, "with reason:", reason);
      
      const allRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      
      const updatedRequests = allRequests.map(request => {
        if (request.id === id) {
          // Create rejection entry with all necessary information
          const rejectionEntry = {
            level: "account-executive",
            user: currentUser.username,
            reason: reason.trim(),
            date: new Date().toISOString(),
            rejectedBy: currentUser.username
          };

          console.log("AE Creating rejection entry:", rejectionEntry);

          return {
            ...request,
            status: "Rejected by AE",
            assignedTo: request.submittedBy,
            rejectedAt: new Date().toISOString(),
            rejectedBy: currentUser.username,
            rejectionReason: reason.trim(), // Store reason at top level
            currentLevel: "rejected",
            // Add to rejections array
            rejections: [...(request.rejections || []), rejectionEntry]
          };
        }
        return request;
      });

      console.log("AE Updated requests after rejection:", updatedRequests.find(r => r.id === id));

      localStorage.setItem("conveyanceRequests", JSON.stringify(updatedRequests));
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('conveyanceUpdated'));
      
      // Refresh the view - filter out rejected requests from AE view
      const refreshedRequests = JSON.parse(localStorage.getItem("conveyanceRequests")) || [];
      setClaims(refreshedRequests.filter(req => req.status === "Pending AE Approval"));
      
      toast.success("Request rejected successfully");
    } catch (error) {
      toast.error(`Rejection failed: ${error.message}`);
      console.error("AE Rejection error:", error);
    }
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
            title="View Receipt"
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
      label: "Visit Report",
      render: (row) => (
        row.reports?.length > 0 ? (
          <button
            className="text-green-600 hover:text-green-800 text-lg"
            title="View Visit Report"
            onClick={() => setViewReports(row.reports)}
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
          return (
            <button
              className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
              onClick={() => {
                // Load the voucher data from localStorage
                const vouchers = JSON.parse(localStorage.getItem("conveyanceVouchers")) || [];
                const voucher = vouchers.find(v => v.claimId === row.id);
                if (voucher) {
                  setSelectedVoucher(voucher);
                  setShowVoucher(true);
                }
              }}
            >
              View Voucher
            </button>
          );
        }
        
        if (row.status === "Rejected by AE") {
          return <span className="text-red-600">Rejected</span>;
        }

        return (
          <div className="flex gap-2">
            <button
              className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
              onClick={() => handleApprove(row.id)}
            >
              Approve
            </button>
            <button
              className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
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

      {/* FIXED: RejectionModal with proper parameter passing */}
      <RejectionModal
        isOpen={rejection.show}
        onClose={() => setRejection({ show: false, claimId: null })}
        onSubmit={(reason) => handleReject(rejection.claimId, reason)}
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

      {showVoucher && selectedVoucher && (
        <ConveyanceExpenseVoucher 
          data={selectedVoucher}
          onClose={() => {
            setShowVoucher(false);
            setSelectedVoucher(null);
          }}
        />
      )}
    </div>
  );
}