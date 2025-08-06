import React, { useEffect, useState } from "react";
import FilterBar from "../Components/Filter";
import RelieverRequestsTable from "../Components/RelieverRequestsTable";

export default function OperationExecutiveMyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));

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
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">My Reliever Requests</h1>
      <FilterBar onFilter={handleFilter} />
      <RelieverRequestsTable 
        requests={filtered} 
        showFullHistory={false} 
      />
    </div>
  );
}