// File: src/features/relieverPayments/components/FilterBar.jsx
import React, { useState } from "react";

export default function FilterBar({ onFilter }) {
  const [filters, setFilters] = useState({ name: "", status: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilter(filters);
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-4 flex flex-wrap gap-4">
      <input
        type="text"
        name="name"
        placeholder="Filter by Name"
        value={filters.name}
        onChange={handleChange}
        className="border p-2 rounded w-full md:w-1/3"
      />

      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="border p-2 rounded w-full md:w-1/3"
      >
        <option value="">All Statuses</option>
        <option value="Pending Line Manager Approval">Pending Line Manager Approval</option>
        <option value="Pending VP Approval">Pending VP Approval</option>
        <option value="Pending Accounts Approval">Pending Accounts Approval</option>
        <option value="Approved">Approved</option>
        <option value="Rejected by Line Manager">Rejected by Line Manager</option>
        <option value="Rejected by VP">Rejected by VP</option>
      </select>

      <button
        onClick={handleApply}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Apply Filters
      </button>
    </div>
  );
}
