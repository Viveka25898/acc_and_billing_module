// File: components/AttendanceTable.jsx
import React from "react";

export default function AttendanceTable({ data, onEdit }) {
  return (
    <table className="w-full table-auto border text-sm rounded overflow-hidden shadow">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Employee Name</th>
          <th className="p-2 border">Designation</th>
          <th className="p-2 border">Present Days</th>
          <th className="p-2 border">Week Offs</th>
          <th className="p-2 border">Holidays</th>
          <th className="p-2 border">Issues</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((emp) => (
          <tr
            key={emp.id}
            className={
              emp.presentDays > 31 || emp.issues
                ? "bg-yellow-100"
                : "bg-white"
            }
          >
            <td className="p-2 border">{emp.name}</td>
            <td className="p-2 border">{emp.designation}</td>
            <td className="p-2 border">{emp.presentDays}</td>
            <td className="p-2 border">{emp.weekOffs}</td>
            <td className="p-2 border">{emp.holidays}</td>
            <td className="p-2 border text-red-500">{emp.issues}</td>
            <td className="p-2 border text-blue-600 cursor-pointer hover:underline" onClick={() => onEdit(emp)}>
              Edit
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
