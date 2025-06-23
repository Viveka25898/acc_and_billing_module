import { useState } from "react";
import PaymentEntriesFilter from "../Components/PaymentEntriesFilter";
import AERejectionModal from "../Components/AERejectionModal";
import { toast } from "react-toastify";

export default function AEPendingRequestsPage() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      code: "EMP001",
      name: "Raj Kumar",
      amount: 30000,
      account: "1234567890",
      ifsc: "SBIN0001234",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 2,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 3,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 4,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 5,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 6,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 7,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
    {
      id: 8,
      code: "EMP002",
      name: "Anjali Singh",
      amount: 34000,
      account: "9876543210",
      ifsc: "HDFC0005678",
      remarks: "June Salary",
      status: "Pending",
      reason: "",
    },
  ]);

  const [filters, setFilters] = useState({ name: "", code: "", status: "All" });
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;

  // Rejection modal state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [currentRejectId, setCurrentRejectId] = useState(null);

//For Sorting
  const getStatusOrder = (status) => {
  switch (status) {
    case "Pending":
      return 1;
    case "Approved":
      return 2;
    case "Rejected":
      return 3;
    default:
      return 4;
  }
};
  // Filtered and paginated entries
  const filteredEntries = entries.filter((entry) => {
    const matchStatus =
      filters.status === "All" || entry.status === filters.status;
    const matchName = entry.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchCode = entry.code
      .toLowerCase()
      .includes(filters.code.toLowerCase());
    return matchStatus && matchName && matchCode;
  });

  // Sort the filtered entries by status order before paginating
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    return getStatusOrder(a.status) - getStatusOrder(b.status);
  });
  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);
  const paginatedEntries = sortedEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );
  const handleApprove = (id) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id ? { ...entry, status: "Approved" } : entry
      )
    );
    toast.success("Entry Acceptes Successfully!")
  };

  const openRejectModal = (id) => {
    setCurrentRejectId(id);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === currentRejectId
          ? { ...entry, status: "Rejected", reason: rejectionReason }
          : entry
      )
    );
    setShowRejectModal(false);
    setRejectionReason("");
    setCurrentRejectId(null);
    toast.error("Payment Entry Rejected!")
  };

 

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-6">
        Pending Salary Payment Approvals
      </h1>

      <PaymentEntriesFilter filters={filters} onChange={setFilters} />

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto text-sm border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Emp Code</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Account</th>
              <th className="p-2 border">IFSC</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Remarks</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEntries.map((entry) => (
              <tr key={entry.id} className="border-t">
                <td className="p-2 border">{entry.code}</td>
                <td className="p-2 border">{entry.name}</td>
                <td className="p-2 border">{entry.account}</td>
                <td className="p-2 border">{entry.ifsc}</td>
                <td className="p-2 border">₹ {entry.amount}</td>
                <td className="p-2 border">{entry.remarks}</td>
                <td className={`p-2 border`}>
                  {entry.status}
                </td>
                <td className="p-2 border">
                  {entry.status === "Pending" ? (
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => handleApprove(entry.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(entry.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                         Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs italic text-gray-500">Action taken</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center mt-4 gap-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Rejection Modal */}
      <AERejectionModal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onSubmit={{
          reasonChange: setRejectionReason,
          confirm: confirmReject,
        }}
      />
    </div>
  );
}
