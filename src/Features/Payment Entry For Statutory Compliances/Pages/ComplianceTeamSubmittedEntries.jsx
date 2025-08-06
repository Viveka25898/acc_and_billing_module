// SubmittedEntriesPage.js
import React, { useState, useEffect } from "react";
import SubmittedEntriesTable from "../Components/SubmittedEntriesTable";

export default function SubmittedEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadEntries = () => {
      try {
        const statutoryData = JSON.parse(localStorage.getItem("statutoryPayments")) || { payments: [] };
        // Filter entries created by current user
        const userEntries = statutoryData.payments.filter(
          entry => entry.createdBy === currentUser.username
        );
        setEntries(userEntries);
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    };
    loadEntries();
  }, [currentUser?.username]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter((entry) => {
    return (
      (!filters.type || entry.type === filters.type) &&
      (!filters.month || entry.period === filters.month)
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