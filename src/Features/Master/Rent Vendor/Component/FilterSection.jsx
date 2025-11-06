import React from "react";

const VendorFilterSection = ({ filters, onFilterChange, onPrint }) => {
  const handleChange = (k, v) => onFilterChange({ ...filters, [k]: v });

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 p-4 md:p-6 my-4">
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-3 items-end">
        <div>
          <label className="text-xs text-gray-600 block mb-1">From Date</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">To Date</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Entry Type</label>
          <select
            value={filters.entryType}
            onChange={(e) => handleChange("entryType", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Journal">Journal</option>
            <option value="Payment">Payment</option>
          </select>
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full border rounded px-3 py-2 text-sm"
          >
            <option value="All">All</option>
            <option value="Posted">Posted</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="md:col-span-2 lg:col-span-1">
          <label className="text-xs text-gray-600 block mb-1">Search</label>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            placeholder="Voucher / Narration / Ref No"
            className="w-full border rounded px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onPrint()}
            className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-semibold"
            aria-label="Print ledger"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorFilterSection;
