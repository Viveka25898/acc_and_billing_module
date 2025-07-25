/* eslint-disable no-unused-vars */
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
    name: "Ravi Kumar",
    designation: "Cleaner",
    presentDays: 30,
    weekOffs: 4,
    holidays: 1,
    ot: "4 hours",
    totalAmount: 12000,
    issues: "",
  },
  {
    id: 2,
    name: "Aarti Shah",
    designation: "Supervisor",
    presentDays: 32,
    weekOffs: 4,
    holidays: 0,
    ot: "1 day",
    totalAmount: 15000,
    issues: "Wrong swipe",
  },
  {
    id: 3,
    name: "John Das",
    designation: "Helper",
    presentDays: null,
    weekOffs: 4,
    holidays: 2,
    ot: "0",
    totalAmount: 0,
    issues: "Missing data",
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
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white shadow-md rounded-md">
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
