// File: src/features/billing/pages/MyPOsList.jsx

import React, { useEffect, useState } from "react";
import POFakeData from "../data/POFakeData";
import POSearchFilter from "../Components/POSearchFilter";
import POListTable from "../Components/POListTable";


export default function MyPOsList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredPOs, setFilteredPOs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const result = POFakeData.filter((po) => {
      const matchSearch =
        po.vendorName.toLowerCase().includes(search.toLowerCase()) ||
        po.poNumber.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || po.status === statusFilter;
      return matchSearch && matchStatus;
    });
    setFilteredPOs(result);
    setCurrentPage(1); // reset to first page on filter
  }, [search, statusFilter]);

  const paginatedPOs = filteredPOs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPOs.length / itemsPerPage);

  return (
    <div className="p-4 space-y-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-bold text-green-600">My PO</h1>
      <POSearchFilter
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <POListTable pos={paginatedPOs} />

      <div className="flex justify-between items-center text-sm">
        <p>
          Page {currentPage} of {totalPages}
        </p>
        <div className="space-x-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
