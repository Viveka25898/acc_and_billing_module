// File: AttendanceDetails.jsx
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import AttendanceTable from "../Components/PayrollAttendenceTable";
import CommentBox from "../Components/CommentBox";
import ActionButtons from "../Components/ActionButtons";
import EditAttendanceModal from "../Components/EditAttendenceModal";

export default function AttendanceDetails() {
  const { siteId, month } = useParams();

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: "Amit Kumar",
      designation: "Cleaner",
      presentDays: 30,
      weekOffs: 4,
      holidays: 2,
      issues: "",
    },
    {
      id: 2,
      name: "Seema Gupta",
      designation: "Supervisor",
      presentDays: 32,
      weekOffs: 4,
      holidays: 2,
      issues: "Missing entry on 15th",
    },
  ]);

  const [editModal, setEditModal] = useState(null); // selected row for editing
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("Pending");

  const updateEmployee = (id, updatedData) => {
    const newData = attendanceData.map((emp) =>
      emp.id === id ? { ...emp, ...updatedData } : emp
    );
    setAttendanceData(newData);
    setEditModal(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-green-600">
          Attendance Details – Site: {siteId}, Month: {month}
        </h2>
        <p className="text-gray-500 mb-4">Review and take action for each staff.</p>
      </div>

      <AttendanceTable data={attendanceData} onEdit={setEditModal} />

      {editModal && (
        <EditAttendanceModal
          data={editModal}
          onClose={() => setEditModal(null)}
          onSave={updateEmployee}
        />
      )}
    </div>
  );
}
