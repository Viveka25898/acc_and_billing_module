// File: src/features/billing/components/POSearchFilter.jsx

import React from "react";

export default function POSearchFilter({ search, setSearch, statusFilter, setStatusFilter }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4">
      <input
        type="text"
        placeholder="Search by Vendor or PO Number"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded p-2 w-full md:w-1/2"
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border rounded p-2 w-full md:w-1/4"
      >
        <option value="all">All Status</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}
