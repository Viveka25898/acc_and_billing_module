// File: src/features/statutoryPayments/components/ApprovalFilter.jsx

import React from "react";

export default function ManagerApprovalFilter({ filters, onFilterChange }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <select
        value={filters.type}
        onChange={(e) => onFilterChange("type", e.target.value)}
        className="border rounded-md p-2 w-full"
      >
        <option value="">Filter by Type</option>
        <option value="PF">PF</option>
        <option value="ESIC">ESIC</option>
      </select>

      <input
        type="month"
        value={filters.month}
        onChange={(e) => onFilterChange("month", e.target.value)}
        className="border rounded-md p-2 w-full"
      />

      <button
        onClick={() => {
          onFilterChange("type", "");
          onFilterChange("month", "");
        }}
        className="bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 w-full cursor-pointer"
      >
        Reset Filters
      </button>
    </div>
  );
}
