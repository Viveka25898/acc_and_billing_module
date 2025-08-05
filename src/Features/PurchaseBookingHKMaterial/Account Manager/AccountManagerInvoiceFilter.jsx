import React, { useState } from "react";

const AMInvoiceFilter = ({ filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    setFilters(localFilters);
  };

  const handleClearFilter = () => {
    const clearedFilters = {
      invoiceNumber: "",
      vendorName: "",
      date: "",
    };
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
      <h3 className="text-md font-semibold mb-3 text-blue-700">Filter Invoices</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Invoice Number Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Invoice Number</label>
          <input
            type="text"
            name="invoiceNumber"
            value={localFilters.invoiceNumber}
            onChange={handleInputChange}
            placeholder="e.g., INV-001"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Vendor Name Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Vendor Name</label>
          <input
            type="text"
            name="vendorName"
            value={localFilters.vendorName}
            onChange={handleInputChange}
            placeholder="e.g., ABC Enterprises"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={localFilters.date}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-blue-200"
          />
        </div>
      </div>

      {/* Filter Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleApplyFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Apply Filter
        </button>
        <button
          onClick={handleClearFilter}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm font-medium"
        >
          Clear Filter
        </button>
      </div>
    </div>
  );
};

export default AMInvoiceFilter;