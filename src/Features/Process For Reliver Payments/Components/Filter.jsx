// File: src/features/relieverPayments/components/FilterBar.jsx
import React, { useState } from "react";

export default function FilterBar({ onFilter }) {
  const [filters, setFilters] = useState({ name: "", date: "" });

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
        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wider">Filter by Date</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white transition-all shadow-sm text-gray-700"
        />
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
