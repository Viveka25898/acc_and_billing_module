// ComplianceManagerApprovalPage.js
import React, { useEffect, useState } from "react";
import ManagerApprovalFilter from "../Components/ManagerApprovalFilter";
import ManagerApprovalTable from "../Components/ManagerApprovalTable";
import { toast } from "react-toastify";

export default function ComplianceManagerApprovalPage() {
  const [entries, setEntries] = useState([]);
  const [filters, setFilters] = useState({ type: "", month: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const allUsers = JSON.parse(localStorage.getItem("users")) || [];

  useEffect(() => {
    const loadEntries = () => {
      try {
        const statutoryData = JSON.parse(localStorage.getItem("statutoryPayments")) || { payments: [] };
        
        // Get list of compliance team members who report to this manager
        const teamMembers = allUsers
          .filter(user => user.reportsTo === currentUser.username && user.role === "compliance-team")
          .map(user => user.username);

        // Filter entries:
        // 1. Pending manager approval
        // 2. Created by team members who report to this manager
        const pendingEntries = statutoryData.payments.filter(entry => 
          entry.status === "pending-compliance-manager" && 
          teamMembers.includes(entry.createdBy)
        );

        setEntries(pendingEntries);
      } catch (error) {
        console.error("Error loading entries:", error);
      }
    };
    loadEntries();
  }, [currentUser?.username, allUsers]);

  const handleStatusUpdate = (id, status, rejection = "") => {
    try {
      const statutoryData = JSON.parse(localStorage.getItem("statutoryPayments")) || { payments: [] };
      const allUsers = JSON.parse(localStorage.getItem("users")) || [];
      
      const updatedPayments = statutoryData.payments.map(entry => {
        if (entry.id === id) {
          const newStatus = status === "Approved" ? "pending-ae" : "rejected";
          const action = status === "Approved" 
            ? "Approved by Compliance Manager" 
            : "Rejected by Compliance Manager";
            
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

      // Reload entries after update to reflect changes
      const teamMembers = allUsers
        .filter(user => user.reportsTo === currentUser.username && user.role === "compliance-team")
        .map(user => user.username);

      setEntries(updatedPayments.filter(entry => 
        entry.status === "pending-compliance-manager" && 
        teamMembers.includes(entry.createdBy)
      ));

      toast.success(`Payment ${status.toLowerCase()} successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update payment status");
    }
  };

  // ... rest of the code remains the same ...
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredEntries = entries.filter(entry => {
    return (
      (filters.status === "All" || entry.status === filters.status) &&
      (!filters.type || entry.type === filters.type) &&
      (!filters.month || entry.period === filters.month)
    );
  });

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