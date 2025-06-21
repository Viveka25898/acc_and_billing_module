// File: src/features/statutoryPayments/components/PaidComplianceFilter.jsx

import React from "react";

export default function PaidComplianceFilter({ filters, onFilterChange }) {
  const handleReset = () => {
    onFilterChange("type", "");
    onFilterChange("month", "");
  };

  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
      <div className="flex-1">
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
      <div className="flex-1">
        <label className="block text-sm font-medium mb-1">Payment Month</label>
        <input
          type="month"
          value={filters.month}
          onChange={(e) => onFilterChange("month", e.target.value)}
          className="border px-3 py-2 rounded w-full"
        />
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={handleReset}
          className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded mt-1 w-full md:mt-0"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
}
