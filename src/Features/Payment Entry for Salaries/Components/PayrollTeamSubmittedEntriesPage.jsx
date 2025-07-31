import { useEffect, useState } from "react";
import PaymentEntriesFilter from "./PaymentEntriesFilter";
import { FaEye } from "react-icons/fa";
export default function PayrollSubmittedEntriesPage() {
  const [entries, setEntries] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
const [rejectionReason, setRejectionReason] = useState("");

  const entriesPerPage = 10;

  const [filters, setFilters] = useState({
    status: "All",
    name: "",
    code: "",
  });

  useEffect(() => {
    const dummy = [
      {
        id: 1,
        code: "EMP001",
        name: "Raj Kumar",
        account: "1234567890",
        ifsc: "SBIN0001234",
        fixed: 25000,
        allowance: 5000,
        remarks: "June Salary",
        status: "Pending",
        submittedAt: "2025-06-20T10:00:00Z",
      },
      {
        id: 2,
        code: "EMP002",
        name: "Anjali Singh",
        account: "9876543210",
        ifsc: "HDFC0005678",
        fixed: 30000,
        allowance: 4000,
        remarks: "June Salary",
        status: "Approved",
        submittedAt: "2025-06-18T14:30:00Z",
      },
      {
         id: 3,
          code: "EMP003",
          name: "Vikram Mehta",
          account: "1122334455",
          ifsc: "ICIC0009988",
          fixed: 28000,
          allowance: 3500,
          remarks: "June Salary",
          status: "Rejected",
          rejectionReason: "Incorrect account details provided.",
          submittedAt: "2025-06-19T08:20:00Z",
      },
    ];
    setEntries(dummy);
  }, []);

  const filteredEntries = entries.filter((entry) => {
    const matchesStatus =
      filters.status === "All" || entry.status === filters.status;
    const matchesName = entry.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchesCode = entry.code
      .toLowerCase()
      .includes(filters.code.toLowerCase());
    return matchesStatus && matchesName && matchesCode;
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

  return (
    <div className="p-4 max-w-7xl mx-auto bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-green-600 mb-6">My Submitted Salary Entries</h1>

      <PaymentEntriesFilter filters={filters} onChange={setFilters} />

      {paginatedEntries.length === 0 ? (
        <p className="text-gray-500">No submissions found.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Emp Code</th>
                  <th className="p-2 border">Name</th>
                  <th className="p-2 border">ACC</th>
                  <th className="p-2 border">IFSC</th>
                  <th className="p-2 border">Fixed</th>
                  <th className="p-2 border">Allowance</th>
                  <th className="p-2 border">Gross</th>
                  <th className="p-2 border">Remarks</th>
                  <th className="p-2 border">Status</th>
                  <th className="p-2 border">Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEntries.map((entry) => (
                  <tr key={entry.id} className="border-t">
                    <td className="p-2 border">{entry.code}</td>
                    <td className="p-2 border">{entry.name}</td>
                    <td className="p-2 border">{entry.account}</td>
                    <td className="p-2 border">{entry.ifsc}</td>
                    <td className="p-2 border">₹ {entry.fixed}</td>
                    <td className="p-2 border">₹ {entry.allowance}</td>
                    <td className="p-2 border font-medium">
                      ₹ {Number(entry.fixed) + Number(entry.allowance)}
                    </td>
                    <td className="p-2 border">{entry.remarks}</td>
                  <td className="p-2 border font-semibold">
                      {entry.status === "Rejected" ? (
                        <div className="inline-flex items-center gap-2">
                          <span className="text-red-600">Rejected</span>
                          <button
                            onClick={() => {
                              setRejectionReason(entry.rejectionReason);
                              setShowModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 focus:outline-none"
                            title="View Rejection Reason"
                          >
                            <FaEye className="cursor-pointer" />
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`${
                            entry.status === "Approved" ? "text-green-600" : "text-yellow-600"
                          }`}
                        >
                          {entry.status}
                        </span>
                      )}
                    </td>
                    <td className="p-2 border text-xs text-gray-500">
                      {new Date(entry.submittedAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Modal  */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center px-4">
                  <div className="bg-white p-6 rounded-md w-full max-w-md shadow-lg">
                    <h2 className="text-lg font-semibold mb-3 text-red-600">Rejection Reason</h2>
                    <p className="text-sm text-gray-800">{rejectionReason || "No reason provided."}</p>

                    <div className="text-right mt-6">
                      <button
                        onClick={() => setShowModal(false)}
                        className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-4 gap-4 text-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
               Prev
            </button>
            <span>
              Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next 
            </button>
          </div>
        </>
      )}
    </div>
  );
}
