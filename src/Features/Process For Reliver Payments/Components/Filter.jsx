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
    <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl flex flex-wrap items-end gap-4 shadow-sm mb-6">
      <div className="flex-1 min-w-[200px] md:max-w-[280px]">
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Search by Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter reliever name..."
          value={filters.name}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
        />
      </div>

      <div className="flex-1 min-w-[200px] md:max-w-[280px]">
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Status</label>
        <select
          name="status"
          value={filters.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="Pending Line Manager Approval">Pending Line Manager Approval</option>
          <option value="Pending VP Operations Approval">Pending VP Operations Approval</option>
          <option value="Pending Account Executive Approval">Pending Account Executive Approval</option>
          <option value="Approved">Approved</option>
          <option value="Rejected by Line Manager">Rejected by Line Manager</option>
          <option value="Rejected by VP Operations">Rejected by VP Operations</option>
          <option value="Rejected by Account Executive">Rejected by Account Executive</option>
        </select>
      </div>

      <button
        onClick={handleApply}
        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer min-w-[120px]"
      >
        Apply Filters
      </button>
    </div>
  );
}
