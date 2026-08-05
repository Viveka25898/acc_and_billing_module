import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import FilterBar from "../Components/Filter";
import RelieverRequestsTable from "../Components/RelieverRequestsTable";
import {
  fetchMyRelieverRequests,
  selectRelieverRequests,
  selectRelieverPagination,
  selectRelieverFetchLoading,
} from "../../../store/slices/relieverSlice";

export default function OperationExecutiveMyRequestsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const requests = useSelector(selectRelieverRequests);
  const pagination = useSelector(selectRelieverPagination);
  const loading = useSelector(selectRelieverFetchLoading);

  const [filters, setFilters] = useState({ name: "", date: "" });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMyRelieverRequests({
      page: currentPage,
      limit: 5,
      name: filters.name,
      date: filters.date
    }));
  }, [dispatch, currentPage, filters]);

  const handleFilter = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset page on filter changes
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Client-side filtering fallback to ensure filters always work correctly
  const filteredRequests = requests.filter((req) => {
    if (filters.name?.trim()) {
      const searchName = filters.name.trim().toLowerCase();
      const reqName = (req.relieverName || req.name || "").toLowerCase();
      if (!reqName.includes(searchName)) return false;
    }
    if (filters.date?.trim()) {
      const searchDate = filters.date.trim(); // YYYY-MM-DD
      const reqDate = req.date || req.visit_date || "";
      if (!reqDate.includes(searchDate)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Premium Green Header Block */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 text-white flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold tracking-wide">My Reliever Requests</h1>
        <button
          className="bg-white hover:bg-gray-100 text-green-700 font-semibold px-4 py-2 rounded-xl text-sm transition-all shadow-sm cursor-pointer"
          onClick={() => navigate("/dashboard/employee/reliver-form")}
        >
          + Submit Reliever Request
        </button>
      </div>

      <div className="p-6">
        <FilterBar onFilter={handleFilter} />
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <div className="mt-4">
            <RelieverRequestsTable 
              requests={filteredRequests} 
              pagination={pagination}
              onPageChange={handlePageChange}
              showFullHistory={false} 
            />
          </div>
        )}
      </div>
    </div>
  );
}