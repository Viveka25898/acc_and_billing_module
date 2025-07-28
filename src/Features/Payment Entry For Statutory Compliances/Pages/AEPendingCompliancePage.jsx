import React, { useEffect, useState } from "react";
import AEFilter from "../Components/AEFilter";
import AEPendingTable from "../Components/AEPendingTable";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const dummyEntries = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  paymentType: i % 2 === 0 ? "PF" : "ESIC",
  paymentMonth: `2024-${(i % 12 + 1).toString().padStart(2, "0")}`,
  amount: 10000 + i * 500,
  challan: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  remarks: `Compliance for ${i % 2 === 0 ? "PF" : "ESIC"} - ${i + 1}`,
  managerStatus: "ApprovedByManager",
  aeStatus: "Pending",
  aeRejection: "",
}));

export default function AEPendingCompliancePage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const navigate=useNavigate()

  useEffect(() => {
    try {
      setEntries(dummyEntries);
    } catch (error) {
      console.error("Failed to load entries:", error);
    }
  }, []);

  const handleStatusUpdate = (id, status, rejection = "") => {
    try {
      const updated = entries.map((entry) =>
        entry.id === id
          ? { ...entry, aeStatus: status, aeRejection: rejection }
          : entry
      );
      setEntries(updated);
      toast.success(`${status}`)
    } catch (error) {
      console.error("Failed to update AE status:", error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.managerStatus === "ApprovedByManager" &&
      (filters.status === "All" || entry.aeStatus === filters.status) &&
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
        <h2 className="text-2xl font-bold text-green-600 mb-6">
          Accounts Executive - Pending Compliance Payments
        </h2>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => navigate("/dashboard/ae/paid-compliance-page")}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Paid Compliances
          </button>
        </div>

        <AEFilter filters={filters} onFilterChange={handleFilterChange} />

        <AEPendingTable entries={currentEntries} onUpdate={handleStatusUpdate} />

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
