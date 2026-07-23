import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ManagerConveyanceTable from "../Components/ManagerConveyanceTable";
import DocumentPreviewModal from "../Components/DocumentPreviewModal";
import RejectionModal from "../Components/RejectionModal";
import {
  fetchConveyanceQueue,
  approveConveyanceRequest,
  rejectConveyanceRequest,
  selectConveyanceQueueRequests,
  selectConveyanceQueueLoading,
  selectConveyanceActionLoadingId,
} from "../../../store/slices/conveyanceSlice";
import { FiCheckSquare, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ManagerConveyanceApprovalsPage() {
  const dispatch = useDispatch();

  const queueRequests = useSelector(selectConveyanceQueueRequests);
  const loading = useSelector(selectConveyanceQueueLoading);
  const actionLoadingId = useSelector(selectConveyanceActionLoadingId);

  const [filter, setFilter] = useState({
    date: "",
    status: "",
    employee: "",
    transport: "",
  });

  const [rejection, setRejection] = useState({ show: false, claimId: null });
  const [viewDocs, setViewDocs] = useState(null);
  const [viewReports, setViewReports] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const loadQueue = useCallback(() => {
    dispatch(fetchConveyanceQueue());
  }, [dispatch]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  // Enhanced filtering
  const filteredClaims = queueRequests.filter((claim) => {
    const employeeName = claim.employeeName || claim.employee_name || claim.submittedBy || "";
    const employeeMatch =
      filter.employee === "" ||
      employeeName.toLowerCase().includes(filter.employee.toLowerCase());

    const statusText = claim.status_display || claim.status || "";
    const statusMatch =
      filter.status === "" ||
      filter.status === "Pending" ||
      statusText.toLowerCase().includes(filter.status.toLowerCase());

    const claimDate = claim.visit_date || claim.date || "";
    const dateMatch =
      filter.date === "" ||
      claimDate.split("T")[0] === filter.date;

    const transportMode = claim.transport_mode || claim.transport || "";
    const transportMatch =
      filter.transport === "" ||
      transportMode.toLowerCase() === filter.transport.toLowerCase();

    return employeeMatch && statusMatch && dateMatch && transportMatch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredClaims.length / itemsPerPage));
  const paginatedClaims = filteredClaims.slice(
    Math.max(0, (currentPage - 1) * itemsPerPage),
    Math.min(filteredClaims.length, currentPage * itemsPerPage)
  );

  const handleApprove = async (id) => {
    try {
      const result = await dispatch(
        approveConveyanceRequest({
          id,
          comments: "Distance and amount verified against Google Maps",
        })
      ).unwrap();

      toast.success(result.message || `Claim request #${id.slice(-6)} approved successfully`);
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(error || "Approval failed. Please try again.");
    }
  };

  const handleReject = async (id, reason) => {
    if (!reason || !reason.trim()) {
      toast.error("Rejection reason is mandatory");
      return;
    }

    try {
      const result = await dispatch(
        rejectConveyanceRequest({
          id,
          comments: reason.trim(),
          rejectionReason: reason.trim(),
        })
      ).unwrap();

      toast.warning(result.message || `Claim request #${id.slice(-6)} rejected`);
      setRejection({ show: false, claimId: null });
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error(error || "Rejection failed. Please try again.");
    }
  };

  const prepareDocumentUrl = (documents) => {
    if (!documents || documents.length === 0) return null;
    const firstDoc = documents[0];
    if (typeof firstDoc === "string") return firstDoc;
    if (firstDoc?.fileUrl || firstDoc?.url) return firstDoc.fileUrl || firstDoc.url;
    return null;
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Container */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl shadow-lg p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <FiCheckSquare size={26} /> Regional Head - Conveyance Approvals
          </h1>
          <p className="text-green-100 text-sm mt-1 font-medium">
            Review and approve or reject employee conveyance reimbursement claims ({filteredClaims.length} pending).
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <ConveyanceFilter
          filter={filter}
          setFilter={setFilter}
          showEmployeeFilter={true}
          showTransportFilter={true}
        />
      </div>

      {/* Approval Table Container */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
            <span className="text-gray-500 text-sm font-semibold">Loading approval queue...</span>
          </div>
        ) : (
          <>
            <ManagerConveyanceTable
              claims={paginatedClaims}
              onApprove={handleApprove}
              onReject={(id) => setRejection({ show: true, claimId: id })}
              onViewDocs={(docs) => setViewDocs(docs)}
              onViewReports={(reports) => setViewReports(reports)}
              actionLoadingId={actionLoadingId}
              showActions={true}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm">
                <div className="text-gray-600">
                  Page <span className="font-semibold text-gray-900">{currentPage}</span> of{" "}
                  <span className="font-semibold text-gray-900">{totalPages}</span> ({filteredClaims.length} items)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage <= 1}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 font-medium text-xs text-gray-700"
                  >
                    <FiChevronLeft size={16} /> Previous
                  </button>

                  <span className="px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-xl border border-green-200">
                    {currentPage}
                  </span>

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 font-medium text-xs text-gray-700"
                  >
                    Next <FiChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={rejection.show}
        onClose={() => setRejection({ show: false, claimId: null })}
        onSubmit={(reason) => handleReject(rejection.claimId, reason)}
        claimId={rejection.claimId}
      />

      {/* Modal for receipts */}
      <DocumentPreviewModal
        url={viewDocs ? prepareDocumentUrl(viewDocs) : null}
        onClose={() => setViewDocs(null)}
        title="Transport Receipt"
      />

      {/* Modal for visit reports */}
      <DocumentPreviewModal
        url={viewReports ? prepareDocumentUrl(viewReports) : null}
        onClose={() => setViewReports(null)}
        title="Visit Report"
      />
    </div>
  );
}