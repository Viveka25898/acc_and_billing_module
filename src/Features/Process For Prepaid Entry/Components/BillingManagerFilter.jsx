// File: src/features/billingManager/components/BillingManagerFilter.jsx
import React from "react";

export default function BillingManagerFilter({
  filterText,
  setFilterText,
  statusFilter,
  setStatusFilter,
}) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <input
        type="text"
        placeholder="Filter by Invoice # or PO #..."
        className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />

      <select
        className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
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
