// File: src/features/statutoryPayments/components/AEFilter.jsx

import React from "react";

export default function AEFilter({ filters, onFilterChange }) {
  const handleReset = () => {
    onFilterChange("type", "");
    onFilterChange("month", "");
    onFilterChange("status", "All");
  };

  return (
    <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
      <div>
        <label className="block text-sm font-medium mb-1">Payment Type</label>
        <select
          value={filters.type}
          onChange={(e) => onFilterChange("type", e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="">All</option>
          <option value="PF">PF</option>
          <option value="ESIC">ESIC</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Payment Month</label>
        <input
          type="month"
          value={filters.month}
          onChange={(e) => onFilterChange("month", e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">AE Status</label>
        <select
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="border px-3 py-2 rounded w-full"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="AcceptedByAE">Accepted</option>
          <option value="RejectedByAE">Rejected</option>
        </select>
      </div>
      <div className="sm:col-span-2 md:col-span-3 flex justify-end mt-2">
        <button
          onClick={handleReset}
          className="bg-green-600 hover:bg-green-700 text-white cursor-pointer text-sm px-4 py-2 rounded"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}