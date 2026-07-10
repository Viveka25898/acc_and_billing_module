import React, { useState, useEffect } from "react";

const HKFilterSection = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  // Keep local filters synchronized when parent state is updated from the outside (e.g. Category changes)
  useEffect(() => {
    setLocalFilters((prev) => ({
      ...prev,
      ...filters
    }));
  }, [filters]);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleClear = () => {
    const cleared = {
      fromDate: "",
      toDate: "",
      entryType: "",
      status: "",
      category: filters.category || "" // Preserve category selection if managed by parent
    };
    setLocalFilters(cleared);
    setFilters(cleared);
  };

  return (
    <div className="flex flex-wrap items-end gap-4 bg-gray-50 border-b border-gray-200 p-4">
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
        <input
          type="date"
          className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={localFilters.fromDate || ""}
          onChange={(e) => handleChange("fromDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
        <input
          type="date"
          className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          value={localFilters.toDate || ""}
          onChange={(e) => handleChange("toDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Entry Type</label>
        <select
          className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={localFilters.entryType || ""}
          onChange={(e) => handleChange("entryType", e.target.value)}
        >
          <option value="">All</option>
          <option value="Opening">Opening</option>
          <option value="Invoice">Invoice</option>
          <option value="Payment">Payment</option>
          <option value="Credit Note">Credit Note</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
        <select
          className="border rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          value={localFilters.status || ""}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
          <option value="Posted">Posted</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={handleApply}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Apply Filters
        </button>
        <button
          onClick={handleClear}
          className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default HKFilterSection;
