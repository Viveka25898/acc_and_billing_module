import React, { useEffect, useState } from "react";
import PaidComplianceTable from "../Components/PaidComplianceTable";
import PaidComplianceFilter from "../Components/PaidComplianceFilter";

const dummyPaidEntries = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 101,
  paymentType: i % 2 === 0 ? "PF" : "ESIC",
  paymentMonth: `2024-${(i % 12 + 1).toString().padStart(2, "0")}`,
  amount: 12000 + i * 400,
  challan: "https://www.africau.edu/images/default/sample.pdf",
  remarks: `Paid entry for ${i % 2 === 0 ? "PF" : "ESIC"} - ${i + 1}`,
  aeStatus: "AcceptedByAE",
  paymentDate: new Date().toISOString().split("T")[0],
}));

export default function AEPaidCompliancePage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  useEffect(() => {
    setEntries(dummyPaidEntries);
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      entry.aeStatus === "AcceptedByAE" &&
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
          Paid Statutory Compliance Entries
        </h2>

        <PaidComplianceFilter filters={filters} onFilterChange={handleFilterChange} />

        <PaidComplianceTable entries={currentEntries} />

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
