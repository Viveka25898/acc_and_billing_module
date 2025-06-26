// File: src/features/conveyance/components/ConveyanceFilter.jsx

import React from "react";

export default function ConveyanceFilter({ filter, setFilter }) {
  const handleChange = (field, value) => {
    setFilter({ ...filter, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div>
        <label className="block text-sm font-medium mb-1">Client Name</label>
        <input
          type="text"
          value={filter.client}
          onChange={(e) => handleChange("client", e.target.value)}
          placeholder="Search by client name"
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={filter.status}
          onChange={(e) => handleChange("status", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">All</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Date</label>
        <input
          type="date"
          value={filter.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>
    </div>
  );
}
