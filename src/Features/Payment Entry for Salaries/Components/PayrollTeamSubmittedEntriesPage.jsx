import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

export default function PayrollSubmittedEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const entriesPerPage = 10;

  const [filters, setFilters] = useState({
    status: "All",
    period: "",
    search: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Current user:", user); // Debug log
    setCurrentUser(user);
    loadEntries(user);
  }, []);

  const loadEntries = (user) => {
    try {
      const allEntries = JSON.parse(localStorage.getItem("salaryPayments")) || [];
      console.log("All entries:", allEntries); // Debug log
      
      if (user?.username) {
        const userEntries = allEntries.filter(entry => 
          entry.submittedBy === user.username
        );
        console.log("User entries:", userEntries); // Debug log
        setEntries(userEntries);
      } else {
        console.log("No user found or no username"); // Debug log
        setEntries([]);
      }
    } catch (error) {
      console.error("Failed to load entries:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEntries = entries.filter((entry) => {
    const matchesStatus = 
      filters.status === "All" || entry.status.includes(filters.status);
    const matchesPeriod = 
      !filters.period || entry.payrollPeriod.includes(filters.period);
    const matchesSearch =
      !filters.search || 
      entry.payrollPeriod.toLowerCase().includes(filters.search.toLowerCase()) ||
      entry.id.toLowerCase().includes(filters.search.toLowerCase());
    
    return matchesStatus && matchesPeriod && matchesSearch;
  });

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const viewRejectionReason = (entry) => {
    setSelectedEntry(entry);
    setRejectionReason(entry.reason || entry.rejectionReason || "No reason provided");
    setShowModal(true);
  };

  const getStatusBadge = (status, entry) => {
    const baseClass = "px-2 py-1 rounded text-xs font-medium";
    if (status.includes("Approved")) {
      return <span className={`${baseClass} bg-green-100 text-green-800`}>Approved</span>;
    }
    if (status.includes("Rejected")) {
      return (
        <div className="flex items-center gap-1">
          <span className={`${baseClass} bg-red-100 text-red-800`}>Rejected</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              viewRejectionReason(entry);
            }}
            className="text-blue-600 hover:text-blue-800"
            title="View rejection reason"
          >
            <FaEye size={14} />
          </button>
        </div>
      );
    }
    return <span className={`${baseClass} bg-yellow-100 text-yellow-800`}>Pending</span>;
  };

  if (loading) {
    return (
      <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        My Submitted Salary Batches
      </h1>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <p>Current User: {currentUser?.username || "Not logged in"}</p>
        <p>Total Entries in Storage: {JSON.parse(localStorage.getItem("salaryPayments") || "[]").length}</p>
        <p>Your Entries: {entries.length}</p>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="w-full border p-2 rounded"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <input
            type="text"
            placeholder="Search period..."
            value={filters.period}
            onChange={(e) => setFilters({...filters, period: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Search</label>
          <input
            type="text"
            placeholder="Search batches..."
            value={filters.search}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      {paginatedEntries.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {!currentUser ? (
            <p>Please log in to view your entries.</p>
          ) : entries.length === 0 ? (
            <p>No salary batches found. Submit some entries first.</p>
          ) : (
            <p>No salary batches found matching your criteria.</p>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border">Batch ID</th>
                  <th className="p-3 border">Period</th>
                  <th className="p-3 border">Employees</th>
                  <th className="p-3 border">Total Amount</th>
                  <th className="p-3 border">Bank Account</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Submitted On</th>
                  <th className="p-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((entry) => (
                  <tr key={entry.id} className="border-t hover:bg-gray-50">
                    <td className="p-3 border font-mono text-sm">{entry.id?.slice(-8) || "N/A"}</td>
                    <td className="p-3 border font-medium">{entry.payrollPeriod}</td>
                    <td className="p-3 border text-center">{entry.employeeCount}</td>
                    <td className="p-3 border font-medium">
                      ₹{entry.totalAmount?.toLocaleString() || "0"}
                    </td>
                    <td className="p-3 border text-xs">
                      {entry.bankFile?.["DEBIT BANK A/C NO"] || "N/A"}
                    </td>
                    <td className="p-3 border">
                      {getStatusBadge(entry.status, entry)}
                    </td>
                    <td className="p-3 border text-xs text-gray-600">
                      {entry.submittedAt ? new Date(entry.submittedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="p-3 border">
                      <button
                        onClick={() => {
                          setSelectedEntry(entry);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">
              Showing {paginatedEntries.length} of {filteredEntries.length} batches
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedEntry?.status?.includes("Rejected") ? (
                <span className="text-red-600">Rejection Details</span>
              ) : (
                <span className="text-green-600">Batch Details</span>
              )}
            </h2>
            <div className="mb-4">
              <p className="font-medium">Batch ID:</p>
              <p className="text-sm text-gray-700">{selectedEntry?.id}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Period:</p>
              <p className="text-sm text-gray-700">{selectedEntry?.payrollPeriod}</p>
            </div>
            {selectedEntry?.status?.includes("Rejected") && (
              <div className="mb-4">
                <p className="font-medium">Rejection Reason:</p>
                <p className="text-sm text-gray-700 mt-1 p-2 bg-gray-100 rounded">
                  {rejectionReason}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}