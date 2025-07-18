import React from "react";

export default function FilterBar({ filters, setFilters }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <select
        name="month"
        value={filters.month}
        onChange={handleChange}
        className="border px-3 py-2 rounded shadow-sm"
      >
        <option value="">All Months</option>
        <option>June 2025</option>
        <option>July 2025</option>
        <option>August 2025</option>
      </select>

      <input
        type="text"
        name="client"
        placeholder="Search by Client"
        value={filters.client}
        onChange={handleChange}
        className="border px-3 py-2 rounded shadow-sm"
      />

      <select
        name="status"
        value={filters.status}
        onChange={handleChange}
        className="border px-3 py-2 rounded shadow-sm"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Punched">Punched</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
}