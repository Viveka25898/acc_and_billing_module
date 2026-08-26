import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import ConveyanceFilter from "../Components/ConveyanceFilter";
import ConveyanceTable from "../Components/ConveyanceTable";
import RejectReasonModal from "../Components/RejectionReasonModal";
import {
  fetchMyConveyanceClaims,
  fetchRejectionReason,
  selectMyConveyanceClaims,
  selectConveyancePagination,
  selectConveyanceSummary,
  selectConveyanceClaimsLoading,
  clearRejectionDetails,
} from "../../../store/slices/conveyanceSlice";
import { selectRole } from "../../../Auth/authSlice";
import { FiPlusCircle, FiList, FiClock, FiCheckCircle, FiDollarSign, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const getConveyanceFormPath = (role) => {
  const normRole = (role || "").toLowerCase().replace(/_/g, "-");
  if (normRole === "regional-head") return "/dashboard/regional-head/conveyance-form";
  if (normRole === "line-manager") return "/dashboard/line-manager/conveyance-form";
  if (normRole === "avp-operations" || normRole === "avp") return "/dashboard/avp-operations/conveyance-form";
  if (normRole === "vp-operations" || normRole === "vp") return "/dashboard/vp-operations/conveyance-form";
  if (normRole === "account-executive" || normRole === "ae") return "/dashboard/ae/conveyance-form";
  return "/dashboard/employee/conveyance-form";
};

export default function MyConveyanceRequestsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const requests = useSelector(selectMyConveyanceClaims);
  const pagination = useSelector(selectConveyancePagination);
  const summary = useSelector(selectConveyanceSummary);
  const isLoading = useSelector(selectConveyanceClaimsLoading);

  const rawRole = useSelector(selectRole);
  const localUser = JSON.parse(localStorage.getItem("user")) || {};
  const role = rawRole || localUser.role || "";

  const [filter, setFilter] = useState({
    client: "",
    status: "",
    date: "",
  });

  const [page, setPage] = useState(1);
  const [selectedRejectReason, setSelectedRejectReason] = useState(null);

  const loadData = useCallback(() => {
    dispatch(
      fetchMyConveyanceClaims({
        page,
        limit: 5,
        status: filter.status,
        client: filter.client,
        date: filter.date,
      })
    );
  }, [dispatch, page, filter.status, filter.client, filter.date]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      setPage(newPage);
    }
  };

  const handleViewReason = async (request) => {
    if (request.rejectionReason) {
      setSelectedRejectReason(request.rejectionReason);
      return;
    }

    try {
      const data = await dispatch(fetchRejectionReason(request.id)).unwrap();
      if (data?.rejectionReason) {
        setSelectedRejectReason(data.rejectionReason);
      } else {
        setSelectedRejectReason("No specific rejection reason provided.");
      }
    } catch (err) {
      console.error("Failed to fetch rejection reason:", err);
      setSelectedRejectReason(request.remarks || "No rejection reason provided.");
    }
  };

  const handleCloseModal = () => {
    setSelectedRejectReason(null);
    dispatch(clearRejectionDetails());
  };

  const handleNavigateNewClaim = () => {
    const targetPath = getConveyanceFormPath(role);
    navigate(targetPath);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Container */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl shadow-lg p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Conveyance Claims</h1>
          <p className="text-green-100 text-sm mt-1 font-medium">
            Track and monitor the approval status of your conveyance reimbursement requests.
          </p>
        </div>
        <button
          type="button"
          onClick={handleNavigateNewClaim}
          className="flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-md cursor-pointer shrink-0"
        >
          <FiPlusCircle size={18} /> New Claim Request
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
            <FiList size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{summary.totalRequests || 0}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Claims</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-xl">
            <FiClock size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{summary.pendingApproval || 0}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending Approval</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <FiCheckCircle size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">{summary.approved || 0}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <FiDollarSign size={22} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800">
              ₹{Number(summary.totalAmountClaimed || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Claimed</div>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <ConveyanceFilter filter={filter} setFilter={setFilter} />
      </div>

      {/* Table Content */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3"></div>
            <span className="text-gray-500 text-sm font-semibold">Loading your conveyance claims...</span>
          </div>
        ) : (
          <>
            <ConveyanceTable
              requests={requests}
              onViewReason={handleViewReason}
            />

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-sm">
                <div className="text-gray-600">
                  Showing page <span className="font-semibold text-gray-900">{pagination.currentPage}</span> of{" "}
                  <span className="font-semibold text-gray-900">{pagination.totalPages}</span> ({pagination.totalRecords} records)
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1 font-medium text-xs text-gray-700"
                  >
                    <FiChevronLeft size={16} /> Previous
                  </button>

                  <span className="px-3 py-1 bg-green-50 text-green-700 font-bold text-xs rounded-xl border border-green-200">
                    {pagination.currentPage}
                  </span>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
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