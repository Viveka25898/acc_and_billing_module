/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import RejectionModal from "./RejectionModal";

export default function AttendanceTable({ data, onEdit }) {
  const [statusMap, setStatusMap] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);

  const handleConfirm = (empId) => {
    setStatusMap((prev) => ({ ...prev, [empId]: "Salary Punched" }));
  };

  const handleReject = (emp) => {
    setSelectedEmp(emp);
    setModalOpen(true);
  };

  const handleRejectSubmit = (reason) => {
    if (selectedEmp) {
      setStatusMap((prev) => ({ ...prev, [selectedEmp.id]: "Rejected." }));
      setSelectedEmp(null);
      setModalOpen(false);
    }
  };

  return (
    <>
      <table className="w-full table-auto border border-gray-300 text-sm rounded overflow-hidden shadow border-collapse">
  <thead className="bg-gray-100 border border-gray-300">
    <tr>
      <th className="p-2 border border-gray-300">Employee Name</th>
      <th className="p-2 border border-gray-300">Designation</th>
      <th className="p-2 border border-gray-300">Present Days</th>
      <th className="p-2 border border-gray-300">Week Offs</th>
      <th className="p-2 border border-gray-300">Holidays</th>
      <th className="p-2 border border-gray-300">OT</th>
      <th className="p-2 border border-gray-300">Issues</th>
      <th className="p-2 border border-gray-300">Total Amount</th>
      <th className="p-2 border border-gray-300">Actions</th>
    </tr>
  </thead>
  <tbody>
    {data.map((emp) => (
      <tr key={emp.id} className="bg-white">
        <td className="p-2 border border-gray-300">{emp.name}</td>
        <td className="p-2 border border-gray-300">{emp.designation}</td>
        <td className="p-2 border border-gray-300">{emp.presentDays}</td>
        <td className="p-2 border border-gray-300">{emp.weekOffs}</td>
        <td className="p-2 border border-gray-300">{emp.holidays}</td>
        <td className="p-2 border border-gray-300">{emp.ot || "0"}</td>
        <td className="p-2 border border-gray-300 text-red-500">
          {emp.issues}
        </td>
        <td className="p-2 border border-gray-300">
          ₹{emp.totalAmount || "0"}
        </td>
        <td className="p-2 border border-gray-300">
          <div className="flex gap-2 items-center">
            {statusMap[emp.id] ? (
              <span
                className={`text-sm font-semibold ${
                  statusMap[emp.id] === "Rejected."
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {statusMap[emp.id]}
              </span>
            ) : (
              <>
                <button
                  onClick={() => handleReject(emp)}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleConfirm(emp.id)}
                  className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirm
                </button>
              </>
            )}
            {!statusMap[emp.id] && (
              <button
                onClick={() => onEdit(emp)}
                className="text-blue-600 hover:underline text-xs"
              >
                Edit
              </button>
            )}
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>


      {/* Rejection Modal */}
      {modalOpen && (
        <RejectionModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleRejectSubmit}
        />
      )}
    </>
  );
}
