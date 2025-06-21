import React, { useState } from "react";
import { FaEye } from "react-icons/fa";
import ChallanPreviewModal from "./ChallanPreviewModal";
import RejectionReasonModal from "./RejectionReasonModal";

export default function SubmittedEntriesTable({ entries }) {
  const [selectedChallan, setSelectedChallan] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Type</th>
            <th className="p-2 border">Month</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Challan</th>
            <th className="p-2 border">Manager Status</th>
            <th className="p-2 border">AE Status</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id} className="hover:bg-gray-50">
              <td className="p-2 border">{entry.paymentType}</td>
              <td className="p-2 border">{entry.paymentMonth}</td>
              <td className="p-2 border">₹{entry.amount}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => setSelectedChallan(entry.challan)}
                  className="text-blue-600 hover:text-blue-800"
                  title="View Challan"
                >
                  <FaEye />
                </button>
              </td>
              <td className="p-2 border text-center">
                {entry.managerStatus === "Rejected" ? (
                  <button
                    onClick={() => setSelectedReason(entry.managerRejection || "No reason provided")}
                    title="View Manager Rejection"
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaEye />
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold">
                    {entry.managerStatus || "Pending"}
                  </span>
                )}
              </td>
              <td className="p-2 border text-center">
                {entry.aeStatus === "Rejected" ? (
                  <button
                    onClick={() => setSelectedReason(entry.aeRejection || "No reason provided")}
                    title="View AE Rejection"
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaEye />
                  </button>
                ) : (
                  <span className="text-green-600 font-semibold">
                    {entry.aeStatus || "Pending"}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedChallan && (
        <ChallanPreviewModal file={selectedChallan} onClose={() => setSelectedChallan(null)} />
      )}
      {selectedReason && (
        <RejectionReasonModal reason={selectedReason} onClose={() => setSelectedReason("")} />
      )}
    </div>
  );
}
