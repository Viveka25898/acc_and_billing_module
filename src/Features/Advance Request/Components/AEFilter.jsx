// AEFilter.jsx
import React from 'react';

export default function AEFilter({ filter, setFilter }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        placeholder="Filter by Name"
        value={filter.name}
        onChange={(e) => setFilter(prev => ({ ...prev, name: e.target.value }))}
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="text"
        placeholder="Filter by Employee ID"
        value={filter.empId}
        onChange={(e) => setFilter(prev => ({ ...prev, empId: e.target.value }))}
        className="border rounded px-3 py-2 w-full"
      />
      <input
        type="date"
        value={filter.date}
        onChange={(e) => setFilter(prev => ({ ...prev, date: e.target.value }))}
        className="border rounded px-3 py-2 w-full"
      />
    </div>
  );
}