import React from "react";

const HKFilterSection = ({ filters, setFilters }) => {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap items-end gap-4 bg-gray-50 border-b border-gray-200 p-4">
      <div>
        <label className="block text-xs text-gray-600 mb-1">From Date</label>
        <input
          type="date"
          className="border rounded-md p-2 text-sm"
          value={filters.fromDate}
          onChange={(e) => handleChange("fromDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">To Date</label>
        <input
          type="date"
          className="border rounded-md p-2 text-sm"
          value={filters.toDate}
          onChange={(e) => handleChange("toDate", e.target.value)}
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600 mb-1">Entry Type</label>
        <select
          className="border rounded-md p-2 text-sm"
          value={filters.entryType}
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
        <label className="block text-xs text-gray-600 mb-1">Status</label>
        <select
          className="border rounded-md p-2 text-sm"
          value={filters.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="">All</option>
          <option value="Pending">Pending</option>
          <option value="Partial">Partial</option>
          <option value="Paid">Paid</option>
          <option value="Posted">Posted</option>
        </select>
      </div>
    </div>
  );
};

export default HKFilterSection;
