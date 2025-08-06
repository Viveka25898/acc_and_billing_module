// /* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import AEFilter from "../Components/AEFilter";
import AEPendingTable from "../Components/AEPendingTable";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

export default function AEPendingCompliancePage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const loadEntries = () => {
      try {
        const statutoryData = JSON.parse(localStorage.getItem("statutoryPayments")) || { payments: [] };
        const allUsers = JSON.parse(localStorage.getItem("users")) || [];
        
        // Get list of compliance managers who report to this AE
        const reportingManagers = allUsers
          .filter(user => user.reportsTo === currentUser.username && user.role === "compliance-manager")
          .map(user => user.username);

        // Filter entries:
        // 1. Pending AE approval (status: pending-ae)
        // 2. Approved by managers who report to this AE
        const pendingEntries = statutoryData.payments.filter(entry => 
          entry.status === "pending-ae" &&
          reportingManagers.includes(entry.history?.find(h => h.action === "Approved by Compliance Manager")?.by)
        );

        setEntries(pendingEntries);
      } catch (error) {
        console.error("Failed to load entries:", error);
        toast.error("Failed to load compliance payments");
      }
    };
    
    loadEntries();
  }, [currentUser?.username, location.key]); // Removed allUsers from dependencies

  const handleStatusUpdate = (id, status, rejection = "") => {
    try {
      const statutoryData = JSON.parse(localStorage.getItem("statutoryPayments")) || { payments: [] };
      
      const updatedPayments = statutoryData.payments.map(entry => {
        if (entry.id === id) {
          const newStatus = status === "AcceptedByAE" ? "approved" : "rejected";
          const action = status === "AcceptedByAE" 
            ? "Approved by Account Executive" 
            : "Rejected by Account Executive";
            
          return {
            ...entry,
            status: newStatus,
            rejectionReason: rejection,
            history: [
              ...(entry.history || []),
              {
                action,
                by: currentUser.username,
                at: new Date().toISOString(),
                comments: rejection || "Approved"
              }
            ]
          };
        }
        return entry;
      });

      localStorage.setItem("statutoryPayments", JSON.stringify({
        ...statutoryData,
        payments: updatedPayments
      }));

      // Force reload by navigating to the same route with new state
      navigate(location.pathname, { state: { refresh: Date.now() } });

      toast.success(`Payment ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Failed to update AE status:", error);
      toast.error("Failed to update payment status");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handlePaidCompliancesClick = () => {
    // Force a fresh load by adding a timestamp to state
    navigate("/dashboard/ae/paid-compliance-page", { state: { refresh: Date.now() } });
  };

  const filteredEntries = entries.filter(
    (entry) =>
      (filters.status === "All" || entry.status === filters.status) &&
      (!filters.type || entry.type === filters.type) &&
      (!filters.month || entry.period === filters.month)
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
            onClick={handlePaidCompliancesClick}
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