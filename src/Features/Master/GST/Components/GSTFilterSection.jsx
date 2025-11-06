import React from "react";

const GSTFilterSection = ({ filters, onFilterChange, onPrint }) => {
  const handleChange = (field, value) => {
    onFilterChange({ ...filters, [field]: value });
  };

  return (
    <div className="bg-gray-50 p-4 md:p-6 border-b border-gray-200 rounded-md mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            From Date
          </label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            To Date
          </label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option>All</option>
            <option>Posted</option>
            <option>Pending</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search voucher/counterparty..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onPrint}
            className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default GSTFilterSection;
