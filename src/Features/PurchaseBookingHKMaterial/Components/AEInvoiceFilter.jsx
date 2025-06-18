import React from "react";

const AEInvoiceFilter = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <input
        type="text"
        name="invoiceNumber"
        placeholder="Invoice Number"
        value={filters.invoiceNumber}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-48"
      />
      <input
        type="text"
        name="vendorName"
        placeholder="Vendor Name"
        value={filters.vendorName}
        onChange={handleChange}
        className="border px-3 py-2 rounded w-48"
      />
      <input
        type="date"
        name="date"
        value={filters.date}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      />
    </div>
  );
};

export default AEInvoiceFilter;
