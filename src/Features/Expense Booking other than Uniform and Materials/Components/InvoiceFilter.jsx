// File: src/features/billing/components/InvoiceFilters.jsx

import React from "react";

export default function InvoiceFilters({ search, setSearch, statusFilter, setStatusFilter, dateFilter, setDateFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by Vendor, PO or Invoice No"
        className="border p-2 rounded w-full md:w-1/3"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="date"
        className="border p-2 rounded w-full md:w-1/4"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
      <select
        className="border p-2 rounded w-full md:w-1/4"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
}
