import React from "react";

export default function PHInvoiceFilter({ filter, setFilter }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <input
        type="text"
        name="po"
        value={filter.po}
        onChange={handleChange}
        placeholder="Filter by PO No."
        className="border px-3 py-2 rounded"
      />

      <input
        type="text"
        name="invoice"
        value={filter.invoice}
        onChange={handleChange}
        placeholder="Filter by Invoice No."
        className="border px-3 py-2 rounded"
      />

      <select
        name="status"
        value={filter.status}
        onChange={handleChange}
        className="border px-3 py-2 rounded"
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
      </select>
    </div>
  );
}
