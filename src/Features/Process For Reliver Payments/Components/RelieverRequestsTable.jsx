// File: src/features/relieverPayments/components/RelieverRequestTable.jsx
import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import RejectionReasonModal from "./RejectionReasonModal";


const ITEMS_PER_PAGE = 5;

export default function RelieverRequestsTable({ requests }) {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginated = requests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(requests.length / ITEMS_PER_PAGE);

  const handleViewReason = (req) => {
    setReason(req.rejectionReason || "No reason provided");
    setShowModal(true);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Site</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Reliever Type</th>
              <th className="p-2 border">Line Manager</th>
              <th className="p-2 border">VP Approval</th>
              <th className="p-2 border">AE Approval</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((req) => (
              <tr key={req.id} className="text-center">
                <td className="border p-2">{req.name}</td>
                <td className="border p-2">{req.date}</td>
                <td className="border p-2">{req.site}</td>
                <td className="border p-2">₹{req.amount}</td>
                <td className="border p-2">{req.type}</td>
                <td className="border p-2">
                  {req.status.includes("Line Manager") ? req.status :
                    req.status.includes("Rejected") ? (
                      <div className="flex justify-center items-center gap-2">
                        Rejected <FaEye onClick={() => handleViewReason(req)} className="text-red-600 cursor-pointer" />
                      </div>
                    ) : "Approved"}
                </td>
                <td className="border p-2">
                  {req.status.includes("VP") ? req.status :
                    req.status.includes("Rejected") ? (
                      <div className="flex justify-center items-center gap-2">
                        Rejected <FaEye onClick={() => handleViewReason(req)} className="text-red-600 cursor-pointer" />
                      </div>
                    ) : "Approved"}
                </td>
                <td className="border p-2">
                  {req.status === "Approved" ? "Approved" :
                    req.status.includes("Rejected") ? (
                      <div className="flex justify-center items-center gap-2">
                        Rejected <FaEye onClick={() => handleViewReason(req)} className="text-red-600 cursor-pointer" />
                      </div>
                    ) : "Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <RejectionReasonModal reason={reason} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
