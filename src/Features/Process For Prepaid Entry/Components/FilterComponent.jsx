// File: src/features/prepaidEntry/components/FilterComponent.jsx
import React from "react";

export default function FilterComponent({ filterText, setFilterText, statusFilter, setStatusFilter }) {
  return (
    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <input
        type="text"
        placeholder="Filter by site name..."
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <select
        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Approved">Approved</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
}