import React, { useEffect, useState } from "react";
import ManagerApprovalFilter from "../Components/ManagerApprovalFilter";
import ManagerApprovalTable from "../Components/ManagerApprovalTable";


const dummyEntries = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  paymentType: i % 2 === 0 ? "PF" : "ESIC",
  paymentMonth: `2024-${(i % 12 + 1).toString().padStart(2, "0")}`,
  amount: 10000 + i * 500,
  challan: "https://example.com/invoice/inv001.pdf",
  remarks: `Compliance for ${i % 2 === 0 ? "PF" : "ESIC"} - ${i + 1}`,
  managerStatus: "Pending",
  aeStatus:"Pending",
  managerRejection: "",
}));

export default function ComplianceManagerApprovalPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    setEntries(dummyEntries);
  }, []);

  const handleStatusUpdate = (id, status, rejection = "") => {
    const updated = entries.map((entry) =>
      entry.id === id
        ? {
            ...entry,
            managerStatus: status,
            managerRejection: rejection,
          }
        : entry
    );
    setEntries(updated);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter(
  (entry) =>
    (filters.status === "All" || entry.managerStatus === filters.status) &&
    (!filters.type || entry.paymentType === filters.type) &&
    (!filters.month || entry.paymentMonth === filters.month)
);


  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Compliance Manager - Approve Payments
        </h2>

        <ManagerApprovalFilter filters={filters} onFilterChange={handleFilterChange} />

        <ManagerApprovalTable entries={currentEntries} onUpdate={handleStatusUpdate} />

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-md border text-sm ${
                  currentPage === i + 1
                    ? "bg-green-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
