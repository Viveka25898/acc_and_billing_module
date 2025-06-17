import React, { useState } from "react";

export default function FixedAssetPOsFilter({ onFilter }) {
  const [filters, setFilters] = useState({
    assetName: "",
    poNumber: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilter(updatedFilters);
  };

  return (
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-end md:gap-6">
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Asset Name</label>
        <input
          type="text"
          name="assetName"
          value={filters.assetName}
          onChange={handleChange}
          placeholder="e.g. Laptop"
          className="px-4 py-2 border border-gray-300 rounded-md  focus:ring-green-400 focus:border-green-400 text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">PO Number</label>
        <input
          type="text"
          name="poNumber"
          value={filters.poNumber}
          onChange={handleChange}
          placeholder="e.g. PO12345"
          className="px-4 py-2 border border-gray-300 rounded-md  focus:ring-green-400 focus:border-green-400 text-sm"
        />
      </div>
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700">Date</label>
        <input
          type="date"
          name="date"
          value={filters.date}
          onChange={handleChange}
          className="px-4 py-2 border border-gray-300 rounded-md  focus:ring-green-400 focus:border-green-400 text-sm"
        />
      </div>
    </div>
  );
}
