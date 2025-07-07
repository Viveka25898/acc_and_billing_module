
import React, { useEffect, useState } from "react";
import FilterBar from "../Components/Filter";
import RelieverRequestsTable from "../Components/RelieverRequestsTable";
import relieverDummyData from "../data/relieverDummyData";

export default function OperationExecutiveMyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
  setRequests(relieverDummyData);
  setFiltered(relieverDummyData);
}, []);

  const handleFilter = (filters) => {
  let temp = [...requests];

  if (filters.name.trim()) {
    temp = temp.filter((req) =>
      req.name.toLowerCase().includes(filters.name.toLowerCase())
    );
  }

  if (filters.status) {
    temp = temp.filter((req) => req.status === filters.status);
  }

  setFiltered(temp);
};


  return (
    <div className="max-w-6xl mx-auto p-4 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-green-600">My Reliever Requests</h1>
      <FilterBar onFilter={handleFilter} />
      <RelieverRequestsTable requests={filtered} />
    </div>
  );
} 