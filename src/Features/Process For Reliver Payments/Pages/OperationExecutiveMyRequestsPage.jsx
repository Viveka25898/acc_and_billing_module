import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterBar from "../Components/Filter";
import RelieverRequestsTable from "../Components/RelieverRequestsTable";

export default function OperationExecutiveMyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const loadRequests = () => {
      try {
        const allRequests = JSON.parse(localStorage.getItem("relieverRequests")) || [];
        
        // Filter requests submitted by current user, sort by date (newest first)
        const userRequests = allRequests
          .filter(req => req.submittedBy === currentUser.username)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setRequests(userRequests);
        setFiltered(userRequests.slice(0, 5)); // Show only last 5 by default
      } catch (error) {
        console.error("Error loading requests:", error);
      }
    };

    loadRequests();
  }, [currentUser?.username]);

  const handleFilter = (filters) => {
    let temp = [...requests];

    if (filters.name?.trim()) {
      temp = temp.filter((req) =>
        req.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.status) {
      temp = temp.filter((req) => req.status === filters.status);
    }

    setFiltered(temp.slice(0, 5)); // Maintain 5 items after filtering
  };

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
        <div className="mt-4">
          <RelieverRequestsTable 
            requests={filtered} 
            showFullHistory={false} 
          />
        </div>
      </div>
    </div>
  );
}