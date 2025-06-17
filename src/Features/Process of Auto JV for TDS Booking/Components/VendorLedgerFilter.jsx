import React from "react";

export default function VendorLedgerFilter({ vendorList, selectedVendor, onChange }) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-2 items-start sm:items-center">
  <label className="text-sm font-semibold text-gray-700">Select Vendor:</label>
  <select
    className="border border-green-300 text-green-900 p-2 rounded w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-green-400"
    value={selectedVendor}
    onChange={(e) => onChange(e.target.value)}
  >
        <option value="">-- All Vendors --</option>
        {vendorList.map((vendor) => (
          <option key={vendor.vendorCode} value={vendor.vendorCode}>
            {vendor.vendorName} ({vendor.vendorCode})
          </option>
        ))}
      </select>
    </div>
  );
}
