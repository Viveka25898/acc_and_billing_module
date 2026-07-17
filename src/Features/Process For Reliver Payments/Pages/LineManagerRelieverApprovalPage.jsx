import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import FilterBar from "../Components/Filter";
import LineManagerApprovalTable from "../Components/LineManagerApprovalTable";
import {
  fetchRelieverQueue,
  approveRelieverRequest,
  rejectRelieverRequest,
  bulkApproveRelieverRequests,
  selectRelieverQueueRequests,
  selectRelieverQueueLoading
} from "../../../store/slices/relieverSlice";

export default function LineManagerRelieverApprovalPage() {
  const dispatch = useDispatch();
  const queueRequests = useSelector(selectRelieverQueueRequests);
  const loading = useSelector(selectRelieverQueueLoading);

  const [filters, setFilters] = useState({ name: "", date: "" });

  useEffect(() => {
    dispatch(fetchRelieverQueue());
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus, reason = null) => {
    try {
      if (newStatus.includes("Rejected")) {
        await dispatch(rejectRelieverRequest({ 
          id, 
          comments: "Rejected by Regional Head", 
          rejectionReason: reason || "Bank details mismatch"
        })).unwrap();
        toast.error(`Request #${id.slice(-6)} rejected`);
      } else {
        await dispatch(approveRelieverRequest({ 
          id, 
          comments: "Approved by Regional Head" 
        })).unwrap();
        toast.success(`Request #${id.slice(-6)} approved`);
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error(`Operation failed: ${error}`);
      throw error;
    }
  };

  const handleBulkApprove = async (ids) => {
    try {
      await dispatch(bulkApproveRelieverRequests({ ids })).unwrap();
      toast.success(`${ids.length} request(s) approved successfully`);
    } catch (error) {
      console.error("Bulk approval error:", error);
      toast.error(`Bulk approval failed: ${error}`);
    }
  };

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredRequests = queueRequests.filter((req) => {
    if (filters.name?.trim()) {
      const searchName = filters.name.trim().toLowerCase();
      const reqName = (req.name || req.relieverName || "").toLowerCase();
      if (!reqName.includes(searchName)) return false;
    }
    if (filters.date?.trim()) {
      const searchDate = filters.date.trim();
      const reqDate = req.date || "";
      if (!reqDate.includes(searchDate)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Premium Green Header Block */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 text-white shadow-sm">
        <h1 className="text-xl font-bold tracking-wide">Regional Head - Reliever Approvals</h1>
        <p className="text-green-100 text-sm mt-0.5">Review and approve or reject reliever payment claims</p>
      </div>

      <div className="p-6">
        <FilterBar onFilter={handleFilter} />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <LineManagerApprovalTable
            requests={filteredRequests}
            onStatusChange={handleStatusChange}
            onBulkApprove={handleBulkApprove}
            showActions={true}
          />
        )}
      </div>
    </div>
  );
}