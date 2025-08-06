// AEPaidCompliancePage.js
import React, { useEffect, useState } from "react";
import PaidComplianceTable from "../Components/PaidComplianceTable";
import PaidComplianceFilter from "../Components/PaidComplianceFilter";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function AEPaidCompliancePage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const loadPaidEntries = () => {
      try {
        const statutoryData = JSON.parse(localStorage.getItem("statutoryPayments")) || { payments: [] };
        
        // Get list of compliance managers who report to this AE
        const reportingManagers = JSON.parse(localStorage.getItem("users"))
          .filter(user => user.reportsTo === currentUser.username && user.role === "compliance-manager")
          .map(user => user.username);

        // Filter entries:
        // 1. Approved by AE (status: approved)
        // 2. Approved by managers who report to this AE
        const paidEntries = statutoryData.payments.filter(entry => 
          entry.status === "approved" &&
          reportingManagers.includes(entry.history?.find(h => h.action === "Approved by Compliance Manager")?.by)
        );

        setEntries(paidEntries);
      } catch (error) {
        console.error("Failed to load paid entries:", error);
        toast.error("Failed to load paid compliance entries");
      }
    };
    loadPaidEntries();
  }, [currentUser?.username]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter(
    (entry) =>
      (!filters.type || entry.type === filters.type) &&
      (!filters.month || entry.period === filters.month)
  );

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredEntries.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const handlePendingCompliancesClick = () => {
  navigate("/dashboard/ae/pending-compliance-requests", { state: { refresh: Date.now() } });
};

  return (
    <div className="p-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Paid Statutory Compliance Entries
        </h2>

        <div className="flex justify-end mb-4">
          <button
            onClick={handlePendingCompliancesClick}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
          >
            Pending Compliances
          </button>
        </div>

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