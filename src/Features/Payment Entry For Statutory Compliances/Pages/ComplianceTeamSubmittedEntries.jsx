// File: src/features/statutoryPayments/pages/SubmittedEntriesPage.jsx

import React, { useState, useEffect } from "react";
import SubmittedEntriesTable from "../Components/SubmittedEntriesTable";

const dummyEntries = Array.from({ length: 20 }).map((_, i) => ({
  id: i + 1,
  paymentType: i % 2 === 0 ? "PF" : "ESIC",
  paymentMonth: `2024-${(i % 12 + 1).toString().padStart(2, "0")}`,
  amount: (i + 1) * 1000,
  challan: new File(["Dummy content"], `challan_${i + 1}.pdf`, { type: "application/pdf" }),
  managerStatus: i % 4 === 0 ? "Rejected" : i % 3 === 0 ? "Approved" : "Pending",
  managerRejection: i % 4 === 0 ? "Incorrect data provided." : "",
  aeStatus: i % 5 === 0 ? "Rejected" : i % 2 === 0 ? "Approved" : "Pending",
  aeRejection: i % 5 === 0 ? "Document mismatch." : "",
}));

export default function SubmittedEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    setEntries(dummyEntries);
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter((entry) => {
    return (
      (!filters.type || entry.paymentType === filters.type) &&
      (!filters.month || entry.paymentMonth === filters.month)
    );
  });

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  return (
    <div className="p-4 bg-white shadow-md rounded-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Submitted Compliance Entries</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border rounded-lg p-2"
        >
          <option value="">Filter by Type</option>
          <option value="PF">PF</option>
          <option value="ESIC">ESIC</option>
        </select>

        <input
          type="month"
          name="month"
          value={filters.month}
          onChange={handleFilterChange}
          className="border rounded-lg p-2"
        />

        <button
          onClick={() => {
            setFilters({ type: "", month: "" });
            setCurrentPage(1);
          }}
          className="bg-green-600 text-white rounded-lg px-4 py-2 hover:bg-green-700 cursor-pointer"
        >
          Reset Filters
        </button>
      </div>

      <SubmittedEntriesTable entries={currentEntries} />

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border text-sm ${
                currentPage === i + 1
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
